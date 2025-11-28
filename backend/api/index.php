<?php

/**
 * API Router
 *
 * Simple router to handle API requests.
 * Routes requests to the appropriate endpoint.
 */

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Debug endpoint - test if router is working
if (isset($_GET['test']) || (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'test') !== false)) {
    echo json_encode([
        "success" => true,
        "message" => "Router is working",
        "debug" => [
            "REQUEST_URI" => $_SERVER['REQUEST_URI'] ?? 'not set',
            "SCRIPT_NAME" => $_SERVER['SCRIPT_NAME'] ?? 'not set',
            "PATH_INFO" => $_SERVER['PATH_INFO'] ?? 'not set',
            "QUERY_STRING" => $_SERVER['QUERY_STRING'] ?? 'not set',
            "REQUEST_METHOD" => $_SERVER['REQUEST_METHOD'] ?? 'not set',
            "GET" => $_GET,
        ]
    ], JSON_PRETTY_PRINT);
    exit;
}

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Also check SCRIPT_NAME and REQUEST_URI for better path detection
$script_name = $_SERVER['SCRIPT_NAME'] ?? '';
$query_string = $_SERVER['QUERY_STRING'] ?? '';

// Debug: log the original path
error_log("API Router - REQUEST_URI: " . $request_uri);
error_log("API Router - Parsed path: " . $path);
error_log("API Router - SCRIPT_NAME: " . $script_name);
error_log("API Router - QUERY_STRING: " . $query_string);

// Check for event media endpoint FIRST - before path cleaning
// This is more reliable as it checks the original URI
$eventId = null;

// Try to extract event ID from the original request URI first
// Match pattern: /event/{id}/media anywhere in the URI
$isSections = false;
if (preg_match('#/event/(\d+)/media#i', $request_uri, $uriMatches)) {
    $eventId = intval($uriMatches[1]);
    error_log("API Router - Found event ID from REQUEST_URI: " . $eventId . " (URI: " . $request_uri . ")");
} elseif (preg_match('#/event/(\d+)/sections#i', $request_uri, $uriMatches)) {
    $eventId = intval($uriMatches[1]);
    $isSections = true;
    error_log("API Router - Found event ID for sections from REQUEST_URI: " . $eventId);
} elseif (preg_match('#/event/(\d+)/media#i', $path, $pathMatches)) {
    $eventId = intval($pathMatches[1]);
    error_log("API Router - Found event ID from path: " . $eventId . " (Path: " . $path . ")");
} elseif (preg_match('#/event/(\d+)/sections#i', $path, $pathMatches)) {
    $eventId = intval($pathMatches[1]);
    $isSections = true;
    error_log("API Router - Found event ID for sections from path: " . $eventId);
} elseif (isset($_GET['event_id'])) {
    $eventId = intval($_GET['event_id']);
    error_log("API Router - Found event ID from GET param: " . $eventId);
} else {
    // Debug: log what we're looking for
    error_log("API Router - No event ID found. REQUEST_URI: " . $request_uri . ", Path: " . $path);
}

// If we found an event ID, route to appropriate endpoint
if ($eventId) {
    $_GET['event_id'] = $eventId;
    
    if ($isSections) {
        error_log("API Router - Routing to event_sections_direct.php with event_id: " . $eventId);
        include_once __DIR__ . '/event_sections_direct.php';
        exit;
    }
    
    error_log("API Router - Routing to event_media.php with event_id: " . $eventId);
    include_once __DIR__ . '/endpoints/event_media.php';
    exit;
}

// Remove common prefixes - handle various server structures
$path = preg_replace('#^/.*?/backend/api/#', '', $path);
$path = preg_replace('#^/.*?/adminpanel/backend/api/#', '', $path);
$path = preg_replace('#^/backend/api/#', '', $path);
$path = preg_replace('#^/api/#', '', $path);
$path = trim($path, '/');

error_log("API Router - Cleaned path: " . $path);

// Route requests
switch ($path) {
    case 'events':
    case 'timeline/events':
        // GET all events
        include_once 'endpoints/get_events.php';
        break;

    case 'event':
    case 'admin/event':
        // CRUD operations on single event
        include_once 'endpoints/event_crud.php';
        break;

    case 'key-moments':
    case 'event/key-moments':
        // Get key moments for an event
        $keyMomentsPath = __DIR__ . '/endpoints/get_key_moments.php';
        if (file_exists($keyMomentsPath)) {
            include_once $keyMomentsPath;
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Key moments endpoint file not found",
                "path" => $keyMomentsPath
            ]);
        }
        break;

    case '':
    case 'index.php':
        // API info
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Timeline Events API",
            "version" => "1.0.0",
            "endpoints" => [
                "GET /api/events" => "Get all timeline events",
                "GET /api/event?id={id}" => "Get single event by ID",
                "POST /api/event" => "Create new event (admin)",
                "PUT /api/event" => "Update event (admin)",
                "DELETE /api/event?id={id}" => "Delete event (admin)"
            ]
        ]);
        break;

    default:
        // 404 Not Found
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Endpoint not found",
            "path" => $path
        ]);
        break;
}
