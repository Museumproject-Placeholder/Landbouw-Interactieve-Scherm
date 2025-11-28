<?php
/**
 * Direct Puzzle Image URL Endpoint
 * 
 * Returns the full URL to a puzzle image file
 * Usage: /backend/api/puzzle_image_direct.php?filename=1763627546_xdddd.jpg
 * 
 * Uses the same path detection logic as event_media_direct.php
 */

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Get filename from GET parameter
$filename = isset($_GET['filename']) ? basename($_GET['filename']) : null;

if (!$filename) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Filename is required",
        "usage" => "Add ?filename=1763627546_xdddd.jpg to the URL"
    ]);
    exit;
}

// Build URL dynamically based on current request (same logic as event_media_direct.php)
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

// Get the base path from the current request
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
$basePath = '';

// Extract base path from script name (more reliable)
// Script is at: /museumproject/landbouwmuseum/timeline/backend/api/puzzle_image_direct.php
// We need: /museumproject/landbouwmuseum/timeline/adminpanel
if (preg_match('#^(/.*?)/backend/api#', $scriptName, $pathMatches)) {
    // If backend is directly in timeline, add adminpanel
    $basePath = $pathMatches[1] . '/adminpanel';
} elseif (preg_match('#^(/.*?)/adminpanel/backend/api#', $scriptName, $pathMatches)) {
    $basePath = $pathMatches[1] . '/adminpanel';
} else {
    // Default fallback
    $basePath = '/museumproject/landbouwmuseum/timeline/adminpanel';
}

// Construct full URL to the puzzle image
// Puzzle images are in adminpanel/uploads/ (not in event_media subfolder)
$uploadPath = $basePath . '/uploads/';
$fullUrl = $protocol . '://' . $host . $uploadPath . $filename;

// Check if file exists (optional - can be removed if file check is not needed)
$filePath = $_SERVER['DOCUMENT_ROOT'] . $uploadPath . $filename;
$fileExists = file_exists($filePath);

http_response_code(200);
echo json_encode([
    "success" => true,
    "url" => $fullUrl,
    "filename" => $filename,
    "exists" => $fileExists,
    "base_path" => $basePath
]);





