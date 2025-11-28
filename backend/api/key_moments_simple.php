<?php

/**
 * Simple key moments endpoint - exact copy of events.php structure
 * Usage: /backend/api/key_moments_simple.php?event_id=18
 */

// Set headers for JSON response and CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");

// Include database configuration
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
        "message" => "Event ID is required"
    ]);
    exit();
}

try {
    // Get all key moments for this event
    $query = "SELECT 
                id,
                event_id,
                year,
                title,
                short_description,
                full_description,
                display_order
              FROM event_key_moments 
              WHERE event_id = :event_id 
              ORDER BY display_order ASC, year ASC";

    // Execute query
    $stmt = $db->prepare($query);
    $stmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch all results
    $keyMoments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process each key moment
    foreach ($keyMoments as &$moment) {
        $moment['id'] = (int)$moment['id'];
        $moment['event_id'] = (int)$moment['event_id'];
        $moment['year'] = (int)$moment['year'];
        $moment['display_order'] = (int)$moment['display_order'];
        // Convert to camelCase for frontend
        $moment['shortDescription'] = $moment['short_description'] ? $moment['short_description'] : '';
        $moment['fullDescription'] = $moment['full_description'] ? $moment['full_description'] : '';
        // Remove snake_case keys
        unset($moment['short_description']);
        unset($moment['full_description']);
    }

    // Return success response
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "count" => count($keyMoments),
        "data" => $keyMoments
    ]);
} catch (PDOException $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error fetching key moments: " . $e->getMessage()
    ]);
}

