<?php
/**
 * Authentication API
 * Endpoints for user registration, login, session check, logout, and credential updates
 */

require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    case 'register':
        if ($method !== 'POST') {
            json_response(['success' => false, 'error' => 'Method not allowed'], 405);
        }

        $input = get_json_input();
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        $confirmPassword = $input['confirmPassword'] ?? '';

        if (empty($username) || empty($password)) {
            json_response(['success' => false, 'error' => 'Username and password are required'], 400);
        }

        if (strlen($username) < 3 || strlen($username) > 30) {
            json_response(['success' => false, 'error' => 'Username must be between 3 and 30 characters.'], 400);
        }

        if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $username)) {
            json_response(['success' => false, 'error' => 'Username may only contain letters, numbers, hyphens, and underscores.'], 400);
        }

        if (strlen($password) < 4) {
            json_response(['success' => false, 'error' => 'Password must be at least 4 characters.'], 400);
        }

        if ($password !== $confirmPassword) {
            json_response(['success' => false, 'error' => 'Passwords do not match.'], 400);
        }

        // Check if username already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            json_response(['success' => false, 'error' => 'Username is already taken. Please choose another.'], 409);
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $insert = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        $insert->execute([$username, $passwordHash]);
        $newUserId = (int)$pdo->lastInsertId();

        // Auto-login the new user
        session_regenerate_id(true);
        $_SESSION['user_logged_in'] = true;
        $_SESSION['user_id'] = $newUserId;
        $_SESSION['username'] = $username;
        $_SESSION['admin_logged_in'] = true; // backward-compat

        json_response([
            'success' => true,
            'message' => 'Account created successfully! Welcome to your workspace.',
            'user' => [
                'id' => $newUserId,
                'username' => $username
            ]
        ], 201);
        break;

    case 'login':
        if ($method !== 'POST') {
            json_response(['success' => false, 'error' => 'Method not allowed'], 405);
        }

        $input = get_json_input();
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($username) || empty($password)) {
            json_response(['success' => false, 'error' => 'Username and password are required'], 400);
        }

        $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['user_logged_in'] = true;
            $_SESSION['user_id'] = (int)$user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['admin_logged_in'] = true; // backward-compat

            json_response([
                'success' => true,
                'message' => 'Authentication successful',
                'user' => [
                    'id' => (int)$user['id'],
                    'username' => $user['username']
                ]
            ]);
        } else {
            json_response(['success' => false, 'error' => 'Access Denied: Invalid credentials'], 401);
        }
        break;

    case 'check':
        if (is_authenticated()) {
            $userId = get_current_user_id();
            $stmt = $pdo->prepare("SELECT settings FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $settingsRaw = $stmt->fetchColumn();
            $settings = !empty($settingsRaw) ? (json_decode($settingsRaw, true) ?: (object)[]) : (object)[];

            json_response([
                'success' => true,
                'authenticated' => true,
                'user' => [
                    'id' => $userId,
                    'username' => get_current_username(),
                    'settings' => $settings
                ],
                'username' => get_current_username(),
                'settings' => $settings
            ]);
        } else {
            json_response([
                'success' => true,
                'authenticated' => false
            ]);
        }
        break;

    case 'logout':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        json_response(['success' => true, 'message' => 'Logged out successfully']);
        break;

    case 'change_password':
        require_auth();
        if ($method !== 'POST') {
            json_response(['success' => false, 'error' => 'Method not allowed'], 405);
        }

        $input = get_json_input();
        $oldPass = $input['oldPassword'] ?? '';
        $newPass = $input['newPassword'] ?? '';

        if (empty($newPass) || strlen($newPass) < 4) {
            json_response(['success' => false, 'error' => 'New password must be at least 4 characters.'], 400);
        }

        $userId = get_current_user_id();
        $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($oldPass, $user['password_hash'])) {
            json_response(['success' => false, 'error' => 'Incorrect current password'], 400);
        }

        $newHash = password_hash($newPass, PASSWORD_BCRYPT);
        $update = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $update->execute([$newHash, $userId]);

        json_response(['success' => true, 'message' => 'Password updated successfully!']);
        break;

    case 'change_username':
        require_auth();
        if ($method !== 'POST') {
            json_response(['success' => false, 'error' => 'Method not allowed'], 405);
        }

        $input = get_json_input();
        $currentPass = $input['currentPassword'] ?? '';
        $newUsername = trim($input['newUsername'] ?? '');

        if (empty($currentPass)) {
            json_response(['success' => false, 'error' => 'Current password is required to change your username.'], 400);
        }

        if (empty($newUsername) || strlen($newUsername) < 3 || strlen($newUsername) > 30) {
            json_response(['success' => false, 'error' => 'New username must be between 3 and 30 characters.'], 400);
        }

        if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $newUsername)) {
            json_response(['success' => false, 'error' => 'Username may only contain letters, numbers, hyphens, and underscores.'], 400);
        }

        $userId = get_current_user_id();
        $stmt = $pdo->prepare("SELECT username, password_hash FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($currentPass, $user['password_hash'])) {
            json_response(['success' => false, 'error' => 'Incorrect current password. Verification failed.'], 400);
        }

        if (strtolower($newUsername) === strtolower($user['username'])) {
            json_response(['success' => false, 'error' => 'New username must be different from current username.'], 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?");
        $checkStmt->execute([$newUsername, $userId]);
        if ($checkStmt->fetch()) {
            json_response(['success' => false, 'error' => 'That username is already in use.'], 409);
        }

        $update = $pdo->prepare("UPDATE users SET username = ? WHERE id = ?");
        $update->execute([$newUsername, $userId]);

        $_SESSION['username'] = $newUsername;

        json_response([
            'success' => true,
            'message' => 'Username updated successfully!',
            'username' => $newUsername
        ]);
        break;

    case 'get_settings':
        require_auth();
        $userId = get_current_user_id();
        $stmt = $pdo->prepare("SELECT settings FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $settingsRaw = $stmt->fetchColumn();
        $settings = !empty($settingsRaw) ? (json_decode($settingsRaw, true) ?: (object)[]) : (object)[];
        json_response(['success' => true, 'settings' => $settings]);
        break;

    case 'update_settings':
        require_auth();
        if ($method !== 'POST') {
            json_response(['success' => false, 'error' => 'Method not allowed'], 405);
        }
        $userId = get_current_user_id();
        $stmt = $pdo->prepare("SELECT settings FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $existingRaw = $stmt->fetchColumn();
        $existing = !empty($existingRaw) ? (json_decode($existingRaw, true) ?: []) : [];

        $input = get_json_input();
        $merged = array_merge($existing, $input);

        $update = $pdo->prepare("UPDATE users SET settings = ? WHERE id = ?");
        $update->execute([json_encode($merged), $userId]);

        json_response(['success' => true, 'settings' => $merged, 'message' => 'Settings saved successfully']);
        break;

    default:
        json_response(['success' => false, 'error' => 'Invalid action'], 400);
}

