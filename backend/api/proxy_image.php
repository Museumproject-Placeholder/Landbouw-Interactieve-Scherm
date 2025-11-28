<?php
/**
 * Image Proxy for CORS
 * 
 * Fetches an image from a remote URL and serves it with CORS headers.
 * Usage: /backend/api/proxy_image.php?url=ENCODED_URL
 */

// Allow access from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$url = isset($_GET['url']) ? $_GET['url'] : null;

if (!$url) {
    http_response_code(400);
    die('URL is required');
}

// Basic security: ensure URL is valid and points to allowed domain (optional but recommended)
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    die('Invalid URL');
}

// Fetch the image
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ]
]);

$content = @file_get_contents($url, false, $context);

if ($content === false) {
    http_response_code(404);
    die('Failed to fetch image');
}

// Determine content type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$contentType = $finfo->buffer($content);

// Set content type header
header("Content-Type: " . $contentType);

// Output image content
echo $content;

