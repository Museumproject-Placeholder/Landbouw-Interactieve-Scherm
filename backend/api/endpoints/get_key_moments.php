<?php

/**
 * GET Event Key Moments Endpoint
 *
 * Returns all key moments for a specific event.
 * Used by the React frontend to display mini timeline in detailed modal.
 */

// Set headers for JSON response and CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");

// Include database configuration
$dbConfigPath = __DIR__ . '/../config/database.php';
if (!file_exists($dbConfigPath)) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database config file not found",
        "path" => $dbConfigPath
    ]);
    exit();
}

include_once $dbConfigPath;

// Create database connection
try {
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
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database initialization error: " . $e->getMessage()
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

    $stmt = $db->prepare($query);
    $stmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $stmt->execute();

    $keyMoments = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $keyMoments[] = [
            'id' => intval($row['id']),
            'event_id' => intval($row['event_id']),
            'year' => intval($row['year']),
            'title' => $row['title'],
            'shortDescription' => $row['short_description'] ? $row['short_description'] : '',
            'fullDescription' => $row['full_description'] ? $row['full_description'] : '',
            'display_order' => intval($row['display_order'])
        ];
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $keyMoments,
        "count" => count($keyMoments)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage(),
        "error_code" => $e->getCode(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unexpected error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}
