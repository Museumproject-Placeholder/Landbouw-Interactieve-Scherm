<?php
/**
 * Direct Event Media Endpoint
 * 
 * This is a direct endpoint for event media that can be accessed without routing
 * Usage: /backend/api/event_media_direct.php?event_id=18
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
        "usage" => "Add ?event_id=18 to the URL"
    ]);
    exit;
}

// Get all media for this event (using PDO like events.php)
try {
    $query = "SELECT id, event_id, media_type, file_url, caption, display_order 
              FROM event_media 
              WHERE event_id = :event_id 
              ORDER BY display_order ASC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $stmt->execute();

    $media = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Build URL dynamically based on current request
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    
    // Get the base path from the current request
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $basePath = '';
    
    // Extract base path from script name (more reliable)
    // Script is at: /museumproject/landbouwmuseum/timeline/backend/api/event_media_direct.php
    // We need: /museumproject/landbouwmuseum/timeline/adminpanel
    if (preg_match('#^(/.*?)/backend/api#', $scriptName, $pathMatches)) {
        // If backend is directly in timeline, add adminpanel
        $basePath = $pathMatches[1] . '/adminpanel';
    } elseif (preg_match('#^(/.*?)/adminpanel/backend/api#', $scriptName, $pathMatches)) {
        $basePath = $pathMatches[1] . '/adminpanel';
    } elseif (preg_match('#^(/.*?)/backend/api#', $requestUri, $pathMatches)) {
        $basePath = $pathMatches[1] . '/adminpanel';
    } else {
        // Default fallback - ensure adminpanel is in the path
        $basePath = '/museumproject/landbouwmuseum/timeline/adminpanel';
    }
    
    // Construct full URL to the uploaded image
    $uploadPath = $basePath . '/uploads/event_media/';
    $fullUrl = $protocol . '://' . $host . $uploadPath . $row['file_url'];

    $media[] = [
        'id' => intval($row['id']),
        'event_id' => intval($row['event_id']),
        'media_type' => $row['media_type'],
        'file_url' => $fullUrl,
        'caption' => $row['caption'] ? $row['caption'] : '',
        'display_order' => intval($row['display_order'])
    ];
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $media,
        "count" => count($media)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}

