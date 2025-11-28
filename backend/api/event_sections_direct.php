<?php
/**
 * Direct Event Sections Endpoint
 * 
 * This is a direct endpoint for event sections that can be accessed without routing
 * Usage: /backend/api/event_sections_direct.php?event_id=1
 * 
 * Uses the same database connection as events.php for consistency
 */

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database configuration (same as events.php)
include_once __DIR__ . '/config/database.php';

// Create database connection
$database = new Database();
$db = $database->getConnection();

// Check if connection was successful
if ($db === null) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// Get event ID from GET parameter
$eventId = isset($_GET['event_id']) ? intval($_GET['event_id']) : null;

if (!$eventId) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Event ID is required",
        "usage" => "Add ?event_id=1 to the URL"
    ]);
    exit;
}

// Get all sections for this event (using PDO like events.php)
try {
    $query = "SELECT id, event_id, section_title, section_content, section_order, has_border
              FROM event_sections 
              WHERE event_id = :event_id 
              ORDER BY section_order ASC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $stmt->execute();

    $sections = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $sections[] = [
            'id' => intval($row['id']),
            'event_id' => intval($row['event_id']),
            'section_title' => $row['section_title'],
            'section_content' => $row['section_content'],
            'section_order' => intval($row['section_order']),
            'has_border' => isset($row['has_border']) ? (bool)$row['has_border'] : false
        ];
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $sections,
        "count" => count($sections)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}





