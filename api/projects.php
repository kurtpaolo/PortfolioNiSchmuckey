<?php
/**
 * Projects API
 * Full CRUD for Video Projects Tracker backed by MySQL (Scoped Per User Account)
 */

require_once __DIR__ . '/db.php';
require_auth();

$userId = get_current_user_id();
$method = $_SERVER['REQUEST_METHOD'];

function format_project_row($row) {
    $customFields = [];
    if (!empty($row['custom_fields'])) {
        $decoded = json_decode($row['custom_fields'], true);
        if (is_array($decoded)) {
            $customFields = $decoded;
        }
    }
    if (!isset($customFields['rawFilesUrl']) && !empty($row['raw_files_url'])) {
        $customFields['rawFilesUrl'] = $row['raw_files_url'];
    }
    if (!isset($customFields['youtubeLink']) && !empty($row['youtube_link'])) {
        $customFields['youtubeLink'] = $row['youtube_link'];
    }

    return [
        'id' => $row['id'],
        'boardId' => !empty($row['board_id']) ? $row['board_id'] : 'video_editor',
        'title' => $row['title'],
        'clientName' => $row['client_name'],
        'service' => $row['service'],
        'price' => (float)$row['price'],
        'budget' => (float)$row['budget'],
        'paidAmount' => (float)$row['paid_amount'],
        'paymentStatus' => $row['payment_status'],
        'status' => $row['status'],
        'dueDate' => !empty($row['due_date']) ? $row['due_date'] : '',
        'youtubeLink' => $row['youtube_link'] ?? '',
        'rawFilesUrl' => $row['raw_files_url'] ?? '',
        'customFields' => (object)$customFields,
        'createdAt' => $row['created_at']
    ];
}

switch ($method) {
    case 'GET':
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC, id DESC");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        $projects = array_map('format_project_row', $rows);
        json_response(['success' => true, 'data' => $projects]);
        break;

    case 'POST':
        $data = get_json_input();
        $id = !empty($data['id']) ? trim($data['id']) : ('tsk_' . round(microtime(true) * 1000));
        $boardId = !empty($data['boardId']) ? trim($data['boardId']) : (!empty($data['preset']) ? trim($data['preset']) : 'video_editor');
        $title = trim($data['title'] ?? '');
        $clientName = trim($data['clientName'] ?? 'Client');
        $service = trim($data['service'] ?? 'Freelance');
        $price = floatval($data['price'] ?? 0);
        $budget = isset($data['budget']) ? floatval($data['budget']) : $price;
        $paidAmount = isset($data['paidAmount']) ? floatval($data['paidAmount']) : 0;
        $paymentStatus = trim($data['paymentStatus'] ?? 'Unpaid');
        $status = trim($data['status'] ?? 'In Progress');
        $dueDate = !empty($data['dueDate']) ? trim($data['dueDate']) : null;
        
        $customFields = isset($data['customFields']) && is_array($data['customFields']) ? $data['customFields'] : [];
        $youtubeLink = trim($data['youtubeLink'] ?? ($customFields['youtubeLink'] ?? ''));
        $rawFilesUrl = trim($data['rawFilesUrl'] ?? ($customFields['rawFilesUrl'] ?? ''));
        $customFieldsJson = !empty($customFields) ? json_encode($customFields) : null;
        $createdAt = !empty($data['createdAt']) ? trim($data['createdAt']) : date('Y-m-d');

        if (empty($title)) {
            json_response(['success' => false, 'error' => 'Task title is required'], 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO projects 
            (id, user_id, board_id, title, client_name, service, price, budget, paid_amount, payment_status, status, due_date, youtube_link, raw_files_url, custom_fields, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id, $userId, $boardId, $title, $clientName, $service, $price, $budget, $paidAmount, $paymentStatus, $status, $dueDate, $youtubeLink, $rawFilesUrl, $customFieldsJson, $createdAt
        ]);

        $fetchStmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?");
        $fetchStmt->execute([$id, $userId]);
        $created = $fetchStmt->fetch();

        json_response(['success' => true, 'data' => format_project_row($created)], 201);
        break;

    case 'PUT':
        $data = get_json_input();
        $id = trim($data['id'] ?? ($_GET['id'] ?? ''));

        if (empty($id)) {
            json_response(['success' => false, 'error' => 'Task ID is required'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $existing = $stmt->fetch();

        if (!$existing) {
            json_response(['success' => false, 'error' => 'Task not found'], 404);
        }

        $title = isset($data['title']) ? trim($data['title']) : $existing['title'];
        $boardId = isset($data['boardId']) ? trim($data['boardId']) : (isset($data['preset']) ? trim($data['preset']) : ($existing['board_id'] ?? 'video_editor'));
        $clientName = isset($data['clientName']) ? trim($data['clientName']) : $existing['client_name'];
        $service = isset($data['service']) ? trim($data['service']) : $existing['service'];
        $price = isset($data['price']) ? floatval($data['price']) : (float)$existing['price'];
        $budget = isset($data['budget']) ? floatval($data['budget']) : (float)$existing['budget'];
        $paidAmount = isset($data['paidAmount']) ? floatval($data['paidAmount']) : (float)$existing['paid_amount'];
        $paymentStatus = isset($data['paymentStatus']) ? trim($data['paymentStatus']) : $existing['payment_status'];
        $status = isset($data['status']) ? trim($data['status']) : $existing['status'];
        $dueDate = isset($data['dueDate']) ? (!empty($data['dueDate']) ? trim($data['dueDate']) : null) : $existing['due_date'];
        
        $customFields = isset($data['customFields']) && is_array($data['customFields']) 
            ? $data['customFields'] 
            : (json_decode($existing['custom_fields'] ?? '{}', true) ?: []);
            
        $youtubeLink = isset($data['youtubeLink']) ? trim($data['youtubeLink']) : ($customFields['youtubeLink'] ?? $existing['youtube_link']);
        $rawFilesUrl = isset($data['rawFilesUrl']) ? trim($data['rawFilesUrl']) : ($customFields['rawFilesUrl'] ?? $existing['raw_files_url']);
        $customFieldsJson = !empty($customFields) ? json_encode($customFields) : null;

        $update = $pdo->prepare("
            UPDATE projects 
            SET board_id = ?, title = ?, client_name = ?, service = ?, price = ?, budget = ?, paid_amount = ?, payment_status = ?, status = ?, due_date = ?, youtube_link = ?, raw_files_url = ?, custom_fields = ?
            WHERE id = ? AND user_id = ?
        ");
        $update->execute([
            $boardId, $title, $clientName, $service, $price, $budget, $paidAmount, $paymentStatus, $status, $dueDate, $youtubeLink, $rawFilesUrl, $customFieldsJson, $id, $userId
        ]);

        $stmt->execute([$id, $userId]);
        $updated = $stmt->fetch();

        json_response(['success' => true, 'data' => format_project_row($updated)]);
        break;

    case 'PATCH':
        $data = get_json_input();
        $id = trim($data['id'] ?? ($_GET['id'] ?? ''));

        if (empty($id)) {
            json_response(['success' => false, 'error' => 'Project ID is required'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $existing = $stmt->fetch();

        if (!$existing) {
            json_response(['success' => false, 'error' => 'Project not found'], 404);
        }

        $fields = [];
        $params = [];

        if (isset($data['boardId'])) {
            $fields[] = "board_id = ?";
            $params[] = trim($data['boardId']);
        }
        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $params[] = trim($data['status']);
        }
        if (isset($data['paymentStatus'])) {
            $fields[] = "payment_status = ?";
            $params[] = trim($data['paymentStatus']);
        }
        if (isset($data['paidAmount'])) {
            $fields[] = "paid_amount = ?";
            $params[] = floatval($data['paidAmount']);
        }
        if (isset($data['youtubeLink'])) {
            $fields[] = "youtube_link = ?";
            $params[] = trim($data['youtubeLink']);
        }
        if (isset($data['dueDate'])) {
            $fields[] = "due_date = ?";
            $params[] = !empty($data['dueDate']) ? trim($data['dueDate']) : null;
        }
        if (isset($data['customFields']) && is_array($data['customFields'])) {
            $existingCf = json_decode($existing['custom_fields'] ?? '{}', true) ?: [];
            $mergedCf = array_merge($existingCf, $data['customFields']);
            $fields[] = "custom_fields = ?";
            $params[] = json_encode($mergedCf);
        }

        if (empty($fields)) {
            json_response(['success' => false, 'error' => 'No fields to update'], 400);
        }

        $params[] = $id;
        $params[] = $userId;
        $sql = "UPDATE projects SET " . implode(', ', $fields) . " WHERE id = ? AND user_id = ?";
        $update = $pdo->prepare($sql);
        $update->execute($params);

        $stmt->execute([$id, $userId]);
        $updated = $stmt->fetch();

        json_response(['success' => true, 'data' => format_project_row($updated)]);
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            $data = get_json_input();
            $id = trim($data['id'] ?? '');
        }

        if (empty($id)) {
            json_response(['success' => false, 'error' => 'Project ID is required'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        json_response(['success' => true, 'message' => 'Project deleted successfully']);
        break;

    default:
        json_response(['success' => false, 'error' => 'Method not allowed'], 405);
}

