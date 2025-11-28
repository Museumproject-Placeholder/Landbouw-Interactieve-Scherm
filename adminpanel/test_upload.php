<?php
/**
 * Test script for upload functionality
 * Access this file directly to check if uploads work
 */

echo "<h1>Upload Test</h1>";

$uploadDir = __DIR__ . '/uploads/';

echo "<h2>Directory Check</h2>";
echo "<p><strong>Upload directory:</strong> " . $uploadDir . "</p>";
echo "<p><strong>Directory exists:</strong> " . (file_exists($uploadDir) ? '✅ Yes' : '❌ No') . "</p>";

if (!file_exists($uploadDir)) {
    echo "<p>Attempting to create directory...</p>";
    if (@mkdir($uploadDir, 0755, true)) {
        echo "<p>✅ Directory created successfully!</p>";
    } else {
        echo "<p>❌ Failed to create directory. Check server permissions.</p>";
    }
}

if (file_exists($uploadDir)) {
    echo "<p><strong>Directory writable:</strong> " . (is_writable($uploadDir) ? '✅ Yes' : '❌ No') . "</p>";
    
    // List files in uploads
    $files = scandir($uploadDir);
    echo "<h3>Files in uploads:</h3><ul>";
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "<li>" . htmlspecialchars($file) . "</li>";
        }
    }
    echo "</ul>";
}

echo "<h2>PHP Info</h2>";
echo "<p><strong>upload_max_filesize:</strong> " . ini_get('upload_max_filesize') . "</p>";
echo "<p><strong>post_max_size:</strong> " . ini_get('post_max_size') . "</p>";
echo "<p><strong>file_uploads:</strong> " . (ini_get('file_uploads') ? 'On' : 'Off') . "</p>";

echo "<h2>Test Upload Form</h2>";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['test_file'])) {
    echo "<h3>Upload Result:</h3>";
    echo "<pre>";
    print_r($_FILES['test_file']);
    echo "</pre>";
    
    if ($_FILES['test_file']['error'] === UPLOAD_ERR_OK) {
        $testFileName = 'test_' . time() . '_' . basename($_FILES['test_file']['name']);
        $testPath = $uploadDir . $testFileName;
        
        if (move_uploaded_file($_FILES['test_file']['tmp_name'], $testPath)) {
            echo "<p>✅ Upload successful! File saved as: " . htmlspecialchars($testFileName) . "</p>";
            // Delete test file
            unlink($testPath);
            echo "<p>Test file deleted.</p>";
        } else {
            echo "<p>❌ move_uploaded_file() failed!</p>";
            echo "<p>Temp file: " . $_FILES['test_file']['tmp_name'] . "</p>";
            echo "<p>Target path: " . $testPath . "</p>";
        }
    } else {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'File too large (php.ini limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
            UPLOAD_ERR_PARTIAL => 'File only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temp directory',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write to disk',
            UPLOAD_ERR_EXTENSION => 'Upload blocked by extension',
        ];
        echo "<p>❌ Upload error: " . ($errors[$_FILES['test_file']['error']] ?? 'Unknown error') . "</p>";
    }
}
?>

<form method="POST" enctype="multipart/form-data">
    <input type="file" name="test_file" accept="image/*">
    <button type="submit">Test Upload</button>
</form>

<p><a href="index.php">← Back to Admin</a></p>

