<?php
/**
 * Calendar Events API
 * CRUD for user calendar events & deadlines backed by MySQL
 */

require_once __DIR__ . '/db.php';
require_auth();

$userId = get_current_user_id();
$method = $_SERVER['REQUEST_METHOD'];

function format_event_row($row) {
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'eventDate' => $row['event_date'],
        'eventTime' => $row['event_time'] ?? '',
        'eventType' => $row['event_type'] ?? 'event',
        'notes' => $row['notes'] ?? '',
        'createdAt' => $row['created_at']
    ];
}

switch ($method) {
    case 'GET':
        $month = isset($_GET['month']) ? intval($_GET['month']) : null;
        $year = isset($_GET['year']) ? intval($_GET['year']) : null;

        if ($month && $year) {
            $stmt = $pdo->prepare("
                SELECT * FROM calendar_events 
                WHERE user_id = ? AND MONTH(event_date) = ? AND YEAR(event_date) = ?
                ORDER BY event_date ASC, event_time ASC
            ");
            $stmt->execute([$userId, $month, $year]);
        } else {
            $stmt = $pdo->prepare("
                SELECT * FROM calendar_events 
                WHERE user_id = ?
                ORDER BY event_date ASC, event_time ASC
            ");
            $stmt->execute([$userId]);
        }

        $rows = $stmt->fetchAll();
        $events = array_map('format_event_row', $rows);
        json_response(['success' => true, 'data' => $events]);
        break;

    case 'POST':
        $data = get_json_input();
        $id = !empty($data['id']) ? trim($data['id']) : ('evt_' . round(microtime(true) * 1000));
        $title = trim($data['title'] ?? '');
        $eventDate = trim($data['eventDate'] ?? $data['event_date'] ?? '');
        $eventTime = trim($data['eventTime'] ?? $data['event_time'] ?? '');
        $eventType = trim($data['eventType'] ?? $data['event_type'] ?? 'event');
        $notes = trim($data['notes'] ?? '');

        if (empty($title)) {
            json_response(['success' => false, 'error' => 'Event title is required'], 400);
        }
        if (empty($eventDate)) {
            json_response(['success' => false, 'error' => 'Event date is required'], 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO calendar_events 
            (id, user_id, title, event_date, event_time, event_type, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id, $userId, $title, $eventDate, $eventTime, $eventType, $notes
        ]);

        $fetch = $pdo->prepare("SELECT * FROM calendar_events WHERE id = ? AND user_id = ?");
        $fetch->execute([$id, $userId]);
        $created = $fetch->fetch();

        json_response(['success' => true, 'data' => format_event_row($created)], 201);
        break;

    case 'PUT':
        $data = get_json_input();
        $id = trim($data['id'] ?? ($_GET['id'] ?? ''));

        if (empty($id)) {
            json_response(['success' => false, 'error' => 'Event ID is required'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM calendar_events WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $existing = $stmt->fetch();

        if (!$existing) {
            json_response(['success' => false, 'error' => 'Event not found'], 404);
        }

        $title = isset($data['title']) ? trim($data['title']) : $existing['title'];
        $eventDate = isset($data['eventDate']) ? trim($data['eventDate']) : (isset($data['event_date']) ? trim($data['event_date']) : $existing['event_date']);
        $eventTime = isset($data['eventTime']) ? trim($data['eventTime']) : (isset($data['event_time']) ? trim($data['event_time']) : $existing['event_time']);
        $eventType = isset($data['eventType']) ? trim($data['eventType']) : (isset($data['event_type']) ? trim($data['event_type']) : $existing['event_type']);
        $notes = isset($data['notes']) ? trim($data['notes']) : $existing['notes'];

        $update = $pdo->prepare("
            UPDATE calendar_events 
            SET title = ?, event_date = ?, event_time = ?, event_type = ?, notes = ?
            WHERE id = ? AND user_id = ?
        ");
        $update->execute([$title, $eventDate, $eventTime, $eventType, $notes, $id, $userId]);

        $stmt->execute([$id, $userId]);
        $updated = $stmt->fetch();

        json_response(['success' => true, 'data' => format_event_row($updated)]);
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            $data = get_json_input();
            $id = trim($data['id'] ?? '');
        }

        if (empty($id)) {
            json_response(['success' => false, 'error' => 'Event ID is required'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM calendar_events WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        json_response(['success' => true, 'message' => 'Event deleted successfully']);
        break;

    default:
        json_response(['success' => false, 'error' => 'Method not allowed'], 405);
}
