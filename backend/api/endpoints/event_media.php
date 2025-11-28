<?php

/**
 * Event Media API Endpoint
 * 
 * Handles GET requests for event media (images)
 * GET /api/event/{id}/media - Get all media for an event
 */

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database configuration (using mysqli like the rest of the admin panel)
include_once __DIR__ . '/../../includes/db.php';

// Check if connection was successful
if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// Get event ID from GET parameter (set by router)
$eventId = isset($_GET['event_id']) ? intval($_GET['event_id']) : null;

if (!$eventId) {
    // Try to extract from REQUEST_URI as fallback
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#event[^/]*/(\d+)/media#i', $requestUri, $matches)) {
        $eventId = intval($matches[1]);
    } else {
        // Last resort: try PATH_INFO
        $pathInfo = $_SERVER['PATH_INFO'] ?? '';
        if (preg_match('#event[^/]*/(\d+)/media#i', $pathInfo, $pathMatches)) {
            $eventId = intval($pathMatches[1]);
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Event ID is required",
                "debug" => [
                    "request_uri" => $requestUri,
                    "path_info" => $pathInfo,
                    "get_params" => $_GET
                ]
            ]);
            exit;
        }
    }
}

// Get all media for this event
$query = "SELECT id, event_id, media_type, file_url, caption, display_order 
          FROM event_media 
          WHERE event_id = " . intval($eventId) . "
          ORDER BY display_order ASC";

$result = mysqli_query($conn, $query);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
    exit();
}

$media = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Build URL dynamically based on current request
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    
    // Get the base path from the current request
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $basePath = '';
    
    // Extract base path from script name (more reliable)
    // Script is at: /museumproject/landbouwmuseum/timeline/adminpanel/backend/api/index.php
    // We need: /museumproject/landbouwmuseum/timeline/adminpanel
    if (preg_match('#^(/.*?)/adminpanel/backend/api#', $scriptName, $pathMatches)) {
        $basePath = $pathMatches[1] . '/adminpanel';
    } elseif (preg_match('#^(/.*?)/backend/api#', $scriptName, $pathMatches)) {
        $basePath = $pathMatches[1];
    } elseif (preg_match('#^(/.*?)/adminpanel/backend/api#', $requestUri, $pathMatches)) {
        $basePath = $pathMatches[1] . '/adminpanel';
    } else {
        // Default fallback
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
