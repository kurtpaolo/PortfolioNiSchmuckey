<?php
/**
 * Database setup and initial migration script
 * Run via CLI: php setup_db.php
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die('Access Denied: Setup script can only be executed via the command line.');
}

$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$pass = 'root';
$dbname = 'portfolio_tracker';

try {
    echo "Connecting to MySQL server at $host:$port...\n";
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    echo "Creating database if not exists: $dbname...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbname`");

    echo "Creating tables...\n";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `projects` (
            `id` VARCHAR(50) PRIMARY KEY,
            `user_id` INT NOT NULL DEFAULT 1,
            `title` VARCHAR(255) NOT NULL,
            `client_name` VARCHAR(100) NOT NULL,
            `service` VARCHAR(100) DEFAULT 'Video Editor',
            `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `budget` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `paid_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `payment_status` VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
            `status` VARCHAR(50) NOT NULL DEFAULT 'In Progress',
            `youtube_link` VARCHAR(500) NULL,
            `raw_files_url` VARCHAR(500) NULL,
            `created_at` DATE NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `promos` (
            `id` VARCHAR(50) PRIMARY KEY,
            `user_id` INT NOT NULL DEFAULT 1,
            `title` VARCHAR(255) NOT NULL,
            `client_name` VARCHAR(100) NOT NULL,
            `platform` VARCHAR(50) DEFAULT 'Instagram',
            `deliverables` VARCHAR(255) NULL,
            `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `paid_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `payment_status` VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
            `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
            `link` VARCHAR(500) NULL,
            `notes` TEXT NULL,
            `created_at` DATE NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Check or insert default account: 'ky' with password 'ky'
    $stmt = $pdo->prepare("SELECT id FROM `users` WHERE `username` = ?");
    $stmt->execute(['ky']);
    if (!$stmt->fetch()) {
        $hashed = password_hash('ky', PASSWORD_BCRYPT);
        $insertStmt = $pdo->prepare("INSERT INTO `users` (`username`, `password_hash`) VALUES (?, ?)");
        $insertStmt->execute(['ky', $hashed]);
        echo "Default user 'ky' created with secure bcrypt hash.\n";
    } else {
        echo "User 'ky' already exists.\n";
    }

    // Check if projects table needs seeding
    $countProjects = $pdo->query("SELECT COUNT(*) FROM `projects`")->fetchColumn();
    if ($countProjects == 0) {
        echo "Seeding initial video projects into MySQL...\n";
        $initialProjects = [
            ['vid_01', 'Bad Customer - Michael', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/YIf-bCycNYI', 'https://drive.google.com/drive/folders/1evx2DKcVq6m1---AuimukuVUrg7mBQAw', '2026-08-12'],
            ['vid_02', 'Rude Girl At The Grocery', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/6OBuvsC492M', 'https://drive.google.com/drive/folders/1XR3KKmtElNJcvWS9_YUidWCFgoJPoa5U', '2026-08-14'],
            ['vid_03', 'Hotel Lobby', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/sH87GfQFejQ', 'https://drive.google.com/file/d/1HDkp9VEiSf2XTpxvKVVu2Yyx9Gqh_P6C/view', '2026-08-16'],
            ['vid_04', 'Plane Story', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/4tBL1ovfo0w', 'https://drive.google.com/drive/folders/1HIFnCWpEen2Yjuf_-AoD77V35b2xGaKT', '2026-08-18'],
            ['vid_05', "Liam's Story", 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/J6cNaCOeuaA', 'https://drive.google.com/drive/folders/1xOkWRxB609UHX2bpxh5mOo8TkvoYk5RE', '2026-08-20'],
            ['vid_06', 'Biggest Man In The Room', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/uWyhdtGFJaw', 'https://drive.google.com/drive/folders/1yR1Mhw48ltzfU_9EGLYD2VfhnIzKn7zL', '2026-08-22'],
            ['vid_07', 'Grocery Story', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/I5jiuwrGDOk', 'https://drive.google.com/file/d/1oN5_oM9civP4iKr5aYJFC0A40mxSId-6/view', '2026-08-24'],
            ['vid_08', 'Cinema Story', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/Mnnd3hpsvGs', 'https://drive.google.com/file/d/12AcuzC0HKGJEYGL1O31Sm9mTi_4XZmjr/view', '2026-08-26'],
            ['vid_09', 'Supermarket', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/aeqoPDfGSYI', 'https://drive.google.com/drive/folders/1eWHkdjrtzjDb9SoH1QwFaohR95sQVluG', '2026-08-28'],
            ['vid_10', 'Father & Son Accident', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/M6wQoJ8yJTs', 'https://drive.google.com/drive/folders/1xaL5Fa2O6VtZR5u0o_9YVrXCBhjFBrXG', '2026-08-30'],
            ['vid_11', "Marcus Doesn't Feel Pain", 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/O3GNtiAqfGE', 'https://drive.google.com/drive/folders/1Q2Js4lgdWZL4LiHAGcAtt2CemDZ9s1FN', '2026-09-01'],
            ['vid_12', 'Elevator Incident', 'bludan', 'Video Editor', 12.00, 12.00, 12.00, 'Paid', 'Published', 'https://youtube.com/shorts/YzcEz5mKmbQ', 'https://drive.google.com/drive/folders/1P6UmPweLPlpGccvzh6WgDvxtWoZDchBL', '2026-09-02'],
            ['vid_13', 'Alex Fear Story', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/-CZoRBssi2A', 'https://drive.google.com/drive/folders/1e4831QZuvRSLNOAoSl6qCeUYavmN63c5?usp=sharing', '2026-09-03'],
            ['vid_14', 'Alex Fear Story Revision', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/k_E8qSr6knY', 'https://drive.google.com/drive/folders/1e4831QZuvRSLNOAoSl6qCeUYavmN63c5?usp=drive_link', '2026-09-03'],
            ['vid_15', 'Noah Time Freeze', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/M_nHo0ApiW4', 'https://drive.google.com/drive/folders/1j9_i_T1S1fmdl7ogZSD4kMdfmlKL4aSq', '2026-09-04'],
            ['vid_16', 'Biggest Man on a Train', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/L-s3WTuHnyU', 'https://drive.google.com/drive/folders/1exCHhqV8c8D-Qhf6FUH9Ch9rQgTR_1qe?usp=sharing', '2026-09-04'],
            ['vid_17', '100 Years of Life', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/VzZXJ7by03g', 'https://drive.google.com/drive/folders/1Y07JxzsiC0r3liPRue0qI9BwY-5q539l', '2026-09-05'],
            ['vid_18', 'Parking Lot', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/kQQP7NGhXHk', 'https://drive.google.com/drive/folders/17-Zo1sbWvOBJNa5v_2XR99MoVCgsgPds?usp=sharing', '2026-09-05'],
            ['vid_19', 'Bridge Incident', 'bludan', 'Video Editor', 15.00, 15.00, 0.00, 'Unpaid', 'Published', 'https://youtube.com/shorts/wAIOnX3_0XA', 'https://drive.google.com/file/d/12NqlpdZ5vqGMeUyYCBUsUvB8U8HQa22t/view', '2026-09-05']
        ];

        $ins = $pdo->prepare("
            INSERT INTO `projects` 
            (`id`, `title`, `client_name`, `service`, `price`, `budget`, `paid_amount`, `payment_status`, `status`, `youtube_link`, `raw_files_url`, `created_at`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($initialProjects as $proj) {
            $ins->execute($proj);
        }
        echo "Successfully seeded " . count($initialProjects) . " projects.\n";
    } else {
        echo "Projects table already contains $countProjects records.\n";
    }

    echo "\nDATABASE SETUP COMPLETED SUCCESSFULLY!\n";
    echo "You can now open MySQL Workbench, connect to 'localhost:3306', and view the 'portfolio_tracker' database!\n";

} catch (Exception $e) {
    echo "Database setup error: " . $e->getMessage() . "\n";
    exit(1);
}
