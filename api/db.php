<?php
/**
 * Database connection, multi-user auto-migration, & helper functions
 */

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'db.php') {
    http_response_code(403);
    exit('Access Denied');
}

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

$db_host = '127.0.0.1';
$db_port = 3306;
$db_name = 'portfolio_tracker';
$db_user = 'root';
$db_pass = 'root';

try {
    $pdo = new PDO(
        "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    // Auto-migrate schema to support multiple user accounts and isolated data
    auto_migrate_schema($pdo);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

/**
 * Ensures users table exists and projects/promos have user_id columns.
 * Preserves all existing records by tying them to user 1.
 */
function auto_migrate_schema(PDO $pdo) {
    static $migrated = false;
    if ($migrated) return;

    // 1. Check if users table exists
    $usersTableExists = false;
    $adminUsersTableExists = false;
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $t) {
        if ($t === 'users') $usersTableExists = true;
        if ($t === 'admin_users') $adminUsersTableExists = true;
    }

    if (!$usersTableExists) {
        if ($adminUsersTableExists) {
            // Rename admin_users to users
            $pdo->exec("RENAME TABLE `admin_users` TO `users`");
            $usersTableExists = true;
        } else {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS `users` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `username` VARCHAR(50) NOT NULL UNIQUE,
                    `password_hash` VARCHAR(255) NOT NULL,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
            $usersTableExists = true;
        }
    }

    // Ensure at least one default account exists if users table is empty
    $userCount = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
    if ($userCount == 0) {
        $defaultHash = password_hash('ky', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO `users` (`username`, `password_hash`) VALUES (?, ?)");
        $stmt->execute(['ky', $defaultHash]);
    }

    // 2. Check if user_id column exists in projects table
    if (in_array('projects', $tables)) {
        $hasUserId = false;
        $cols = $pdo->query("SHOW COLUMNS FROM `projects`")->fetchAll();
        foreach ($cols as $c) {
            if ($c['Field'] === 'user_id') {
                $hasUserId = true;
                break;
            }
        }
        if (!$hasUserId) {
            $pdo->exec("ALTER TABLE `projects` ADD COLUMN `user_id` INT NOT NULL DEFAULT 1 AFTER `id`");
            $pdo->exec("CREATE INDEX `idx_projects_user_id` ON `projects` (`user_id`)");
        }
    }

    // 3. Check if user_id column exists in promos table
    if (in_array('promos', $tables)) {
        $hasUserId = false;
        $cols = $pdo->query("SHOW COLUMNS FROM `promos`")->fetchAll();
        foreach ($cols as $c) {
            if ($c['Field'] === 'user_id') {
                $hasUserId = true;
                break;
            }
        }
        if (!$hasUserId) {
            $pdo->exec("ALTER TABLE `promos` ADD COLUMN `user_id` INT NOT NULL DEFAULT 1 AFTER `id`");
            $pdo->exec("CREATE INDEX `idx_promos_user_id` ON `promos` (`user_id`)");
        }
    }

    // 4. Ensure settings column in users table
    if ($usersTableExists) {
        $hasSettings = false;
        $cols = $pdo->query("SHOW COLUMNS FROM `users`")->fetchAll();
        foreach ($cols as $c) {
            if ($c['Field'] === 'settings') {
                $hasSettings = true;
                break;
            }
        }
        if (!$hasSettings) {
            $pdo->exec("ALTER TABLE `users` ADD COLUMN `settings` LONGTEXT NULL");
        }
    }

    // 5. Ensure board_id, due_date and custom_fields in projects table
    if (in_array('projects', $tables)) {
        $cols = $pdo->query("SHOW COLUMNS FROM `projects`")->fetchAll();
        $hasBoardId = false;
        $hasDueDate = false;
        $hasCustomFields = false;
        foreach ($cols as $c) {
            if ($c['Field'] === 'board_id') $hasBoardId = true;
            if ($c['Field'] === 'due_date') $hasDueDate = true;
            if ($c['Field'] === 'custom_fields') $hasCustomFields = true;
        }
        if (!$hasBoardId) {
            $pdo->exec("ALTER TABLE `projects` ADD COLUMN `board_id` VARCHAR(64) NOT NULL DEFAULT 'video_editor' AFTER `user_id`");
            $pdo->exec("CREATE INDEX `idx_projects_user_board` ON `projects` (`user_id`, `board_id`)");
        }
        if (!$hasDueDate) {
            $pdo->exec("ALTER TABLE `projects` ADD COLUMN `due_date` DATE NULL AFTER `status`");
        }
        if (!$hasCustomFields) {
            $pdo->exec("ALTER TABLE `projects` ADD COLUMN `custom_fields` LONGTEXT NULL AFTER `raw_files_url`");
        }
    }

    // 6. Ensure calendar_events table exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `calendar_events` (
            `id` VARCHAR(64) PRIMARY KEY,
            `user_id` INT NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `event_date` DATE NOT NULL,
            `event_time` VARCHAR(20) NULL,
            `event_type` VARCHAR(50) DEFAULT 'event',
            `notes` TEXT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_cal_user_date` (`user_id`, `event_date`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $migrated = true;
}

function json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function get_json_input() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function is_authenticated() {
    return (!empty($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true)
        || (!empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true);
}

function get_current_user_id() {
    return $_SESSION['user_id'] ?? $_SESSION['admin_user_id'] ?? null;
}

function get_current_username() {
    return $_SESSION['username'] ?? $_SESSION['admin_username'] ?? 'User';
}

function require_auth() {
    if (!is_authenticated() || !get_current_user_id()) {
        json_response([
            'success' => false,
            'error' => 'Unauthorized: Please log in to access your workspace data.'
        ], 401);
    }
}

// Backward compatibility alias
function require_admin() {
    require_auth();
}

