<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

include 'includes/db.php';
include 'includes/auth.php';
include 'includes/functions.php';

// Check if we are editing
$isEdit = isset($_GET['id']);
$event = [
    'jaar' => '',
    'titel' => '',
    'text' => '',
    'gradient' => '',
    'museum_gradient' => '',
    'puzzle' => 0,
    'puzzle_image' => '',
    'game_type' => 'none',
    'context' => '',
    'actief' => 1,
    'category' => 'museum',
    'has_key_moments' => 0
];

// Get event sections (only when editing)
$eventSections = [];
$eventMedia = [];
$eventKeyMoments = [];

if ($isEdit) {
    $id = intval($_GET['id']);
    $result = mysqli_query($conn, "SELECT * FROM timeline_events WHERE id = $id");
    if ($result && mysqli_num_rows($result) > 0) {
        $event = mysqli_fetch_assoc($result);
        // Keep full year value (can be single year or range like "1900-1910")
        $event['jaar'] = $event['year'];
        $event['titel'] = $event['title'];
        $event['text'] = $event['description'];
        $event['puzzle'] = $event['has_puzzle'];
        $event['puzzle_image'] = $event['puzzle_image_url'] ?? '';
        $event['context'] = $event['historical_context'] ?? '';
        $event['actief'] = $event['is_active'];
        $event['category'] = $event['category'] ?? 'museum';
        $event['has_key_moments'] = $event['has_key_moments'] ?? 0;
        
        // Determine game_type
        $hasPuzzle = ($event['puzzle'] == 1 || $event['puzzle'] === true || $event['puzzle'] === '1');
        $hasPuzzleImage = !empty($event['puzzle_image']) && $event['puzzle_image'] !== '';
        
        if ($hasPuzzle && $hasPuzzleImage) {
            $event['game_type'] = 'puzzle';
        } elseif ($hasPuzzle) {
            $event['game_type'] = 'memory';
        } else {
            $event['game_type'] = 'none';
        }

        // Get event sections
        $sectionsResult = mysqli_query($conn, "SELECT * FROM event_sections WHERE event_id = $id ORDER BY section_order ASC");
        if ($sectionsResult) {
            while ($section = mysqli_fetch_assoc($sectionsResult)) {
                $eventSections[] = $section;
            }
        }

        // Get event media
        $mediaResult = mysqli_query($conn, "SELECT * FROM event_media WHERE event_id = $id ORDER BY display_order ASC");
        if ($mediaResult) {
            while ($media = mysqli_fetch_assoc($mediaResult)) {
                $eventMedia[] = $media;
            }
        }

        // Get event key moments
        $keyMomentsResult = mysqli_query($conn, "SELECT id, event_id, year, title, short_description as description, display_order FROM event_key_moments WHERE event_id = $id ORDER BY display_order ASC, year ASC");
        if ($keyMomentsResult) {
            while ($moment = mysqli_fetch_assoc($keyMomentsResult)) {
                $eventKeyMoments[] = $moment;
            }
        }
    }
}

$error = '';
$success = '';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jaar = mysqli_real_escape_string($conn, trim($_POST['jaar'] ?? ''));
    $titel = mysqli_real_escape_string($conn, trim($_POST['titel'] ?? ''));
    $text = mysqli_real_escape_string($conn, trim($_POST['text'] ?? ''));
    $gradient = mysqli_real_escape_string($conn, $_POST['gradient'] ?? '');
    $museum_gradient = mysqli_real_escape_string($conn, $_POST['museum_gradient'] ?? '');
    $context = mysqli_real_escape_string($conn, $_POST['context'] ?? '');
    $actief = isset($_POST['actief']) ? 1 : 0;
    $category = mysqli_real_escape_string($conn, $_POST['category'] ?? 'museum');
    $has_key_moments = isset($_POST['has_key_moments']) ? 1 : 0;

    // Handle game type selection
    $game_type = $_POST['game_type'] ?? 'none';
    $puzzle = ($game_type === 'puzzle' || $game_type === 'memory') ? 1 : 0;
    
    // Handle puzzle image upload
    $puzzle_image = $event['puzzle_image'] ?? '';
    
    if ($game_type === 'puzzle') {
        if (isset($_FILES['puzzle_image']) && $_FILES['puzzle_image']['error'] === UPLOAD_ERR_OK && $_FILES['puzzle_image']['size'] > 0) {
            $uploadDir = __DIR__ . '/uploads/';
            
            if (!file_exists($uploadDir)) {
                if (!@mkdir($uploadDir, 0755, true)) {
                    $error = "Kan uploads map niet aanmaken. Controleer de serverrechten.";
                }
            }
            
            if (empty($error) && !is_writable($uploadDir)) {
                $error = "Uploads map is niet schrijfbaar. Controleer de bestandsrechten (chmod 755 of 777).";
            }
            
            if (empty($error)) {
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                $fileType = $_FILES['puzzle_image']['type'];
                
                if (!in_array($fileType, $allowedTypes)) {
                    $error = "Alleen afbeeldingen zijn toegestaan (JPEG, PNG, GIF, WebP). Ontvangen type: " . htmlspecialchars($fileType);
                } else {
                    $originalName = basename($_FILES['puzzle_image']['name']);
                    $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '', $originalName);
                    if (empty($cleanName)) {
                        $cleanName = 'image.jpg';
                    }
                    $fileName = time() . '_' . $cleanName;
        $targetPath = $uploadDir . $fileName;
                    
        if (move_uploaded_file($_FILES['puzzle_image']['tmp_name'], $targetPath)) {
            $puzzle_image = $fileName;
                    } else {
                        $error = "Fout bij het uploaden. Upload map: " . $uploadDir . " | Bestand: " . $fileName;
        }
                }
            }
        }
    } else {
        $puzzle_image = '';
    }

    // Validate year (accepts single year like "1950" or range like "1900-1910")
    $jaar = trim($jaar);
    if (!preg_match('/^\d{4}(-\d{4})?$/', $jaar)) {
        $error = "Jaar moet een 4-cijferig getal zijn (bijv. 1950) of een bereik (bijv. 1900-1910)";
    } else {
        // Validate individual years in range
        if (strpos($jaar, '-') !== false) {
            list($startYear, $endYear) = explode('-', $jaar);
            $startYear = intval($startYear);
            $endYear = intval($endYear);
            if ($startYear < 0 || $startYear > 9999 || $endYear < 0 || $endYear > 9999) {
                $error = "Jaren moeten tussen 0 en 9999 zijn";
            } elseif ($startYear >= $endYear) {
                $error = "Startjaar moet kleiner zijn dan eindjaar";
            }
        } else {
            $yearInt = intval($jaar);
            if ($yearInt < 0 || $yearInt > 9999) {
                $error = "Jaar moet tussen 0 en 9999 zijn";
            }
        }
    }

    // Validate required fields
    if (empty($error)) {
        $missing = [];
        if (empty($jaar)) $missing[] = "Jaar";
        if (empty($titel)) $missing[] = "Titel";
        if (empty($text)) $missing[] = "Beschrijving";
        
        if (!empty($missing)) {
            $error = "Vul alle verplichte velden in: " . implode(", ", $missing);
        }
    }

    if (empty($error)) {
        if ($isEdit) {
            $query = "UPDATE timeline_events SET 
                year='$jaar', title='$titel', description='$text',
                gradient='$gradient', museum_gradient='$museum_gradient',
                has_puzzle='$puzzle', puzzle_image_url='$puzzle_image',
                use_detailed_modal=1, historical_context='$context',
                is_active='$actief', category='$category',
                has_key_moments='$has_key_moments'
                WHERE id=$id";
        } else {
            $query = "INSERT INTO timeline_events (year, title, description, gradient, museum_gradient, has_puzzle, puzzle_image_url, use_detailed_modal, historical_context, is_active, category, has_key_moments)
                VALUES ('$jaar','$titel','$text','$gradient','$museum_gradient','$puzzle','$puzzle_image',1,'$context','$actief','$category','$has_key_moments')";
        }

        if (mysqli_query($conn, $query)) {
            $eventId = $isEdit ? $id : mysqli_insert_id($conn);

            // Process event sections
            if (isset($_POST['sections']) && is_array($_POST['sections'])) {
                mysqli_query($conn, "DELETE FROM event_sections WHERE event_id = $eventId");
                foreach ($_POST['sections'] as $index => $section) {
                    if (!empty($section['title']) && !empty($section['content'])) {
                        $sectionTitle = mysqli_real_escape_string($conn, $section['title']);
                        $sectionContent = mysqli_real_escape_string($conn, $section['content']);
                        $sectionOrder = intval($section['order']) ?: ($index + 1);
                        $hasBorder = isset($section['has_border']) ? 1 : 0;
                        mysqli_query($conn, "INSERT INTO event_sections (event_id, section_title, section_content, section_order, has_border) 
                                            VALUES ($eventId, '$sectionTitle', '$sectionContent', $sectionOrder, $hasBorder)");
                    }
                }
            }

            // Process key moments
            if ($has_key_moments && isset($_POST['key_moments']) && is_array($_POST['key_moments'])) {
                mysqli_query($conn, "DELETE FROM event_key_moments WHERE event_id = $eventId");
                $momentCount = 0;
                foreach ($_POST['key_moments'] as $index => $moment) {
                    if ($momentCount >= 5) break;
                    if (!empty($moment['year']) && !empty($moment['title'])) {
                        $momentYear = intval($moment['year']);
                        $momentTitle = mysqli_real_escape_string($conn, $moment['title']);
                        $momentDesc = mysqli_real_escape_string($conn, $moment['description'] ?? '');
                        $displayOrder = $momentCount + 1;
                        mysqli_query($conn, "INSERT INTO event_key_moments (event_id, year, title, short_description, display_order) 
                                            VALUES ($eventId, $momentYear, '$momentTitle', '$momentDesc', $displayOrder)");
                        $momentCount++;
                    }
                }
            }

            // Process existing media (update captions and handle deletions)
            if (isset($_POST['existing_media']) && is_array($_POST['existing_media'])) {
                foreach ($_POST['existing_media'] as $media) {
                    $mediaId = intval($media['id']);
                    $caption = mysqli_real_escape_string($conn, $media['caption'] ?? '');
                    mysqli_query($conn, "UPDATE event_media SET caption='$caption' WHERE id=$mediaId AND event_id=$eventId");
                }
            }
            
            // Handle media deletions
            if (isset($_POST['delete_media']) && is_array($_POST['delete_media'])) {
                foreach ($_POST['delete_media'] as $mediaId) {
                    $mediaId = intval($mediaId);
                    mysqli_query($conn, "DELETE FROM event_media WHERE id=$mediaId AND event_id=$eventId");
                }
            }

            // Process new media uploads
            if (isset($_FILES['new_media_file']) && is_array($_FILES['new_media_file']['name'])) {
                $mediaUploadDir = __DIR__ . '/uploads/event_media/';
                if (!file_exists($mediaUploadDir)) {
                    @mkdir($mediaUploadDir, 0755, true);
                }
                
                $allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                $allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
                
                foreach ($_FILES['new_media_file']['name'] as $index => $fileName) {
                    if (!empty($fileName) && $_FILES['new_media_file']['error'][$index] === UPLOAD_ERR_OK) {
                        $fileType = $_FILES['new_media_file']['type'][$index];
                        $mediaType = isset($_POST['new_media_type'][$index]) ? $_POST['new_media_type'][$index] : 'image';
                        
                        $allowed = ($mediaType === 'image' && in_array($fileType, $allowedImageTypes)) || 
                                   ($mediaType === 'video' && in_array($fileType, $allowedVideoTypes));
                        
                        if ($allowed) {
                            $originalName = basename($fileName);
                            $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '', $originalName);
                            if (empty($cleanName)) {
                                $cleanName = $mediaType === 'image' ? 'image.jpg' : 'video.mp4';
                            }
                            $newFileName = time() . '_' . $index . '_' . $cleanName;
                            $targetPath = $mediaUploadDir . $newFileName;
                            
                            if (move_uploaded_file($_FILES['new_media_file']['tmp_name'][$index], $targetPath)) {
                                $caption = isset($_POST['new_media_caption'][$index]) ? mysqli_real_escape_string($conn, $_POST['new_media_caption'][$index]) : '';
                                $mediaTypeEscaped = mysqli_real_escape_string($conn, $mediaType);
                                
                                $orderResult = mysqli_query($conn, "SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM event_media WHERE event_id = $eventId");
                                $orderRow = mysqli_fetch_assoc($orderResult);
                                $order = intval($orderRow['next_order']);
                                
                                mysqli_query($conn, "INSERT INTO event_media (event_id, media_type, file_url, caption, display_order) 
                                                    VALUES ($eventId, '$mediaTypeEscaped', '$newFileName', '$caption', $order)");
                            }
                        }
                    }
                }
            }

            $success = "Event succesvol opgeslagen!";
            // Reload event data after save
            if ($isEdit) {
                $result = mysqli_query($conn, "SELECT * FROM timeline_events WHERE id = $eventId");
                if ($result && mysqli_num_rows($result) > 0) {
                    $event = mysqli_fetch_assoc($result);
                    $yearValue = $event['year'];
                    if (preg_match('/^(\d{4})/', $yearValue, $matches)) {
                        $yearValue = $matches[1];
                    }
                    $event['jaar'] = $yearValue;
                    $event['titel'] = $event['title'];
                    $event['text'] = $event['description'];
                    $event['puzzle'] = $event['has_puzzle'];
                    $event['puzzle_image'] = $event['puzzle_image_url'] ?? '';
                    $event['context'] = $event['historical_context'] ?? '';
                    $event['actief'] = $event['is_active'];
                    $event['category'] = $event['category'] ?? 'museum';
                    $event['has_key_moments'] = $event['has_key_moments'] ?? 0;
                    
                    $hasPuzzle = ($event['puzzle'] == 1 || $event['puzzle'] === true || $event['puzzle'] === '1');
                    $hasPuzzleImage = !empty($event['puzzle_image']) && $event['puzzle_image'] !== '';
                    
                    if ($hasPuzzle && $hasPuzzleImage) {
                        $event['game_type'] = 'puzzle';
                    } elseif ($hasPuzzle) {
                        $event['game_type'] = 'memory';
                    } else {
                        $event['game_type'] = 'none';
                    }
                    
                    // Reload event media
                    $eventMedia = [];
                    $mediaResult = mysqli_query($conn, "SELECT * FROM event_media WHERE event_id = $eventId ORDER BY display_order ASC");
                    if ($mediaResult) {
                        while ($media = mysqli_fetch_assoc($mediaResult)) {
                            $eventMedia[] = $media;
                        }
                    }
                    
                    // Reload event sections
                    $eventSections = [];
                    $sectionsResult = mysqli_query($conn, "SELECT * FROM event_sections WHERE event_id = $eventId ORDER BY section_order ASC");
                    if ($sectionsResult) {
                        while ($section = mysqli_fetch_assoc($sectionsResult)) {
                            $eventSections[] = $section;
                        }
                    }
                    
                    // Reload key moments
                    $eventKeyMoments = [];
                    $keyMomentsResult = mysqli_query($conn, "SELECT id, event_id, year, title, short_description as description, display_order FROM event_key_moments WHERE event_id = $eventId ORDER BY display_order ASC, year ASC");
                    if ($keyMomentsResult) {
                        while ($moment = mysqli_fetch_assoc($keyMomentsResult)) {
                            $eventKeyMoments[] = $moment;
                        }
                    }
                }
            } else {
                // Redirect to edit page for new event
                header("Location: edit_add.php?id=$eventId&success=1");
                exit;
            }
        } else {
            $error = "Databasefout: " . mysqli_error($conn);
        }
    }
}

// Helper function to get category color
function getCategoryColor($category) {
    $colors = [
        'museum' => '#a35514',
        'landbouw' => '#22c55e',
        'maatschappelijk' => '#c9a300'
    ];
    return $colors[$category] ?? $colors['museum'];
}

// Helper function to get category label
function getCategoryLabel($category) {
    $labels = [
        'museum' => 'Museum',
        'landbouw' => 'Landbouw',
        'maatschappelijk' => 'Maatschappelijk'
    ];
    return $labels[$category] ?? 'Museum';
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $isEdit ? 'Bewerk' : 'Nieuw' ?> Event - Admin Panel</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
            color: #1a1a1a;
        }
        
        .admin-container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 30px 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
        }
        
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #fff;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            color: #4b5563;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .back-btn:hover {
            border-color: #d1d5db;
            background: #f9fafb;
        }
        
        .alert {
            padding: 16px 20px;
            border-radius: 10px;
            margin-bottom: 24px;
            font-weight: 500;
        }
        
        .alert-error {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            color: #991b1b;
        }
        
        .alert-success {
            background: #d1fae5;
            border: 1px solid #86efac;
            color: #065f46;
        }
        
        .main-layout {
            display: block;
        }
        
        form.form-panel {
            display: grid;
            grid-template-columns: repeat(2, 1fr) 450px;
            gap: 24px;
            align-items: start;
            width: 100%;
        }
        
        .form-section.with-preview {
            grid-column: 2;
        }
        
        .preview-panel {
            grid-column: 3;
            grid-row: 1 / span 10;
            position: sticky;
            top: 30px;
            height: fit-content;
            max-height: calc(100vh - 60px);
            overflow-y: auto;
        }
        
        @media (max-width: 1600px) {
            form.form-panel {
                grid-template-columns: repeat(2, 1fr);
            }
            .preview-panel {
                grid-column: 1 / -1;
                grid-row: auto;
                position: relative;
                top: 0;
                max-height: none;
            }
        }
        
        @media (max-width: 1400px) {
            form.form-panel {
                grid-template-columns: 1fr;
            }
        }
        
        .form-section {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
        }
        
        .form-section.full-width {
            grid-column: 1 / -1;
        }

        .form-section h3 {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 20px 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .form-section .form-group {
            margin-bottom: 20px;
        }
        
        .form-section .form-group:last-child {
            margin-bottom: 0;
        }
        
        .tabs {
            display: none;
        }
        
        .tab-content {
            display: block;
            padding: 0;
        }
        
        .info-box {
            display: none;
        }
        
        .preview-panel {
            position: sticky;
            top: 30px;
            height: fit-content;
        }
        
        .preview-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 24px;
            margin-bottom: 20px;
        }
        
        .preview-card h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        
        .event-card-preview {
            width: 100%;
            background: #f3f2e9;
            border-radius: 12px;
            overflow: hidden;
            border-top: 4px solid;
            min-height: 400px;
            position: relative;
        }
        
        .event-card-preview .game-badge {
            position: absolute;
            top: 0;
            right: 0;
            background: #c9a300;
            color: white;
            padding: 8px 16px;
            border-radius: 0 0 0 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 10;
        }
        
        .event-card-preview .card-content {
            padding: 24px;
        }
        
        .event-card-preview .category-label {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }
        
        .event-card-preview .year {
            font-size: 48px;
            font-weight: 700;
            color: #c9a300;
            margin-bottom: 8px;
            line-height: 1;
        }
        
        .event-card-preview .title {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 12px;
            line-height: 1.3;
        }
        
        .event-card-preview .description {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            max-height: 200px;
            overflow: hidden;
        }
        
        .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .info-box p {
            font-size: 14px;
            color: #1e40af;
            line-height: 1.6;
            margin: 0;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        .form-group:last-child {
            margin-bottom: 0;
        }
        
        label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .label-hint {
            font-size: 12px;
            font-weight: 400;
            color: #6b7280;
            margin-left: 4px;
        }
        
        .where-used {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 500;
            color: #6b7280;
            background: #f3f4f6;
            padding: 2px 8px;
            border-radius: 4px;
            margin-left: 8px;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        select {
            width: 100%;
            padding: 12px 16px;
            background: #fff;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            color: #1a1a1a;
            font-size: 15px;
            font-family: inherit;
            transition: all 0.2s;
        }
        
        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        select {
            cursor: pointer;
        }
        
        .game-type-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }
        
        .game-type-option {
            position: relative;
            cursor: pointer;
        }
        
        .game-type-option input {
            position: absolute;
            opacity: 0;
        }
        
        .game-type-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px 16px;
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            transition: all 0.2s;
        }
        
        .game-type-card:hover {
            border-color: #d1d5db;
            background: #f3f4f6;
        }
        
        .game-type-option input:checked + .game-type-card {
            border-color: #3b82f6;
            background: #eff6ff;
        }
        
        .game-type-card .label {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
        }
        
        .game-type-card .desc {
            font-size: 11px;
            color: #6b7280;
            text-align: center;
        }
        
        .puzzle-upload-area {
            display: none;
            margin-top: 20px;
            padding: 24px;
            background: #eff6ff;
            border: 2px dashed #3b82f6;
            border-radius: 10px;
            text-align: center;
        }
        
        .puzzle-upload-area.active {
            display: block;
        }
        
        .upload-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #3b82f6;
            border: none;
            border-radius: 8px;
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .upload-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
        }
        
        .current-file {
            margin-top: 16px;
            padding: 12px 16px;
            background: #d1fae5;
            border: 1px solid #86efac;
            border-radius: 8px;
            color: #065f46;
            font-size: 13px;
        }
        
        .memory-info {
            display: none;
            margin-top: 20px;
            padding: 20px;
            background: #d1fae5;
            border: 1px solid #86efac;
            border-radius: 10px;
        }
        
        .memory-info.active {
            display: block;
        }
        
        .memory-info p {
            color: #065f46;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .checkbox-group:hover {
            background: #f3f4f6;
        }

        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: #3b82f6;
            cursor: pointer;
        }
        
        .checkbox-group span {
            font-size: 14px;
            color: #374151;
        }
        
        .section-item {
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 16px;
            border: 2px solid #e5e7eb;
            position: relative;
            cursor: move;
            transition: all 0.2s;
        }
        
        .section-item:hover {
            border-color: #3b82f6;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
        
        .section-item.sortable-ghost {
            opacity: 0.4;
            background: #f3f4f6;
        }
        
        .section-item.sortable-drag {
            opacity: 0.8;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .drag-handle {
            position: absolute;
            left: 4px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            color: #6b7280;
            background: #f3f4f6;
            border-radius: 6px;
            transition: all 0.2s;
            user-select: none;
            z-index: 10;
        }
        
        .drag-handle:active {
            cursor: grabbing;
            background: #e5e7eb;
        }
        
        .section-item:hover .drag-handle {
            color: #3b82f6;
            background: #eff6ff;
        }
        
        .drag-handle::before {
            content: "☰";
            font-size: 20px;
            line-height: 1;
            font-weight: bold;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            padding-left: 44px;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .section-header h4 {
            font-size: 14px;
            color: #3b82f6;
            font-weight: 600;
        }
        
        .remove-btn {
            padding: 8px 16px;
            background: #fee2e2;
            border: 1px solid #fca5a5;
            border-radius: 6px;
            color: #991b1b;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .remove-btn:hover {
            background: #fecaca;
        }
        
        .add-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: #eff6ff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            color: #3b82f6;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .add-btn:hover {
            background: #dbeafe;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        
        .submit-section {
            position: sticky;
            bottom: 0;
            background: #fff;
            margin-top: 32px;
            padding: 20px 0;
            border-top: 2px solid #e5e7eb;
            display: flex;
            gap: 16px;
            justify-content: flex-end;
            z-index: 100;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
            justify-content: flex-end;
        }
        
        .btn {
            padding: 14px 28px;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: #3b82f6;
            color: #fff;
        }
        
        .btn-primary:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .btn-secondary {
            background: #fff;
            color: #4b5563;
            border: 2px solid #e5e7eb;
        }
        
        .btn-secondary:hover {
            background: #f9fafb;
            border-color: #d1d5db;
        }
        
        @media (max-width: 600px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            .game-type-grid {
                grid-template-columns: 1fr;
            }
            .tabs {
                overflow-x: auto;
            }
        }
    </style>
    <!-- SortableJS for drag and drop -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
</head>
<body>
    <div class="admin-container">
        <div class="header">
            <h1><?= $isEdit ? 'Bewerk Event' : 'Nieuw Event' ?></h1>
            <a href="index.php" class="back-btn">← Terug</a>
        </div>
        
        <?php if (!empty($error)): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <?php if (!empty($success) || isset($_GET['success'])): ?>
            <div class="alert alert-success">Event succesvol opgeslagen!</div>
        <?php endif; ?>
        
        <div class="main-layout">
            <form method="POST" enctype="multipart/form-data" id="eventForm" class="form-panel">
                    <!-- Section: Basis -->
                <div class="form-section">
                        <h3>Basis</h3>

                        <div class="form-group">
                            <label>
                                Jaar <span class="label-hint">(bijv. 1950 of 1900-1910)</span>
                                <span class="where-used">Op kaart</span>
                            </label>
                            <input type="text" name="jaar" id="preview-jaar" value="<?= htmlspecialchars($event['jaar']) ?>" required placeholder="1950 of 1900-1910" pattern="^\d{4}(-\d{4})?$" oninput="updatePreview()">
                            <small style="color: #6b7280; font-size: 12px; display: block; margin-top: 4px;">
                                Voer een enkel jaar in (bijv. 1950) of een bereik (bijv. 1900-1910)
                            </small>
                </div>

                        <div class="form-group">
                            <label>
                                Titel <span class="label-hint">(kort en duidelijk)</span>
                                <span class="where-used">Op kaart</span>
                            </label>
                            <input type="text" name="titel" id="preview-titel" value="<?= htmlspecialchars($event['titel']) ?>" required placeholder="bijv. Eerste tractor in Friesland" oninput="updatePreview()">
                </div>

                        <div class="form-group">
                            <label>
                                Beschrijving <span class="label-hint">(korte samenvatting)</span>
                                <span class="where-used">Op kaart</span>
                            </label>
                            <textarea name="text" id="preview-text" required placeholder="Korte beschrijving van het event..." oninput="updatePreview()"><?= htmlspecialchars($event['text']) ?></textarea>
                </div>

                        <div class="form-group">
                            <label>
                                Categorie
                                <span class="where-used">Op kaart</span>
                            </label>
                            <select name="category" id="preview-category" onchange="updatePreview()">
                                <option value="museum" <?= $event['category'] === 'museum' ? 'selected' : '' ?>>Museum</option>
                                <option value="landbouw" <?= $event['category'] === 'landbouw' ? 'selected' : '' ?>>Landbouw</option>
                                <option value="maatschappelijk" <?= $event['category'] === 'maatschappelijk' ? 'selected' : '' ?>>Maatschappelijk</option>
                    </select>
                </div>

                        <div class="form-group">
                            <label class="checkbox-group">
                                <input type="checkbox" name="actief" <?= $event['actief'] ? 'checked' : '' ?>>
                                <span>Actief (zichtbaar op de timeline)</span>
                            </label>
                    </div>
                    </div>

                    <!-- Section: Inhoud -->
                <div class="form-section with-preview">
                        <h3>Inhoud</h3>

                        <div class="form-group">
                            <label>
                                Historische Context <span class="label-hint">(achtergrond informatie)</span>
                                <span class="where-used">In modal</span>
                            </label>
                            <textarea name="context" id="preview-context" placeholder="Optionele historische context en achtergrond informatie..." oninput="updatePreview()"><?= htmlspecialchars($event['context']) ?></textarea>
                    </div>
                        
                        <div class="form-group">
                            <label>
                                Extra Secties
                                <small style="color: #6b7280; font-size: 12px; font-weight: normal; margin-left: 8px;">
                                    (Sleep om volgorde te wijzigen)
                                </small>
                            </label>
                            <div id="sectionsList">
                                <?php 
                                if (!empty($eventSections)):
                                    foreach ($eventSections as $index => $section): 
                                ?>
                                <div class="section-item" data-section-index="<?= $index ?>">
                                    <div class="drag-handle"></div>
                                    <div class="section-header">
                                        <h4>Sectie <?= $index + 1 ?></h4>
                                        <button type="button" class="remove-btn" onclick="removeSection(this)">Verwijderen</button>
                            </div>
                                    <div class="form-group">
                                        <label>Titel</label>
                                        <input type="text" name="sections[<?= $index ?>][title]" value="<?= htmlspecialchars($section['section_title']) ?>" placeholder="Sectie titel" oninput="updatePreview()">
                                        </div>
                                    <div class="form-group">
                                        <label>Inhoud</label>
                                        <textarea name="sections[<?= $index ?>][content]" placeholder="Sectie inhoud..." oninput="updatePreview()"><?= htmlspecialchars($section['section_content']) ?></textarea>
                                        </div>
                                    <input type="hidden" name="sections[<?= $index ?>][order]" value="<?= $index + 1 ?>">
                                    <label class="checkbox-group" style="margin-top: 12px;">
                                        <input type="checkbox" name="sections[<?= $index ?>][has_border]" <?= ($section['has_border'] ?? 0) ? 'checked' : '' ?> onchange="updatePreview()">
                                        <span>Met rand</span>
                                    </label>
                                        </div>
                                <?php 
                                    endforeach;
                                endif; 
                                ?>
                                    </div>
                            <button type="button" class="add-btn" onclick="addSection()">+ Sectie toevoegen</button>
                                        </div>
                    </div>
                    
                    <!-- Preview Panel -->
                    <div class="preview-panel">
                        <div class="preview-card">
                            <h3>Voorvertoning - Kaart</h3>
                            <div class="event-card-preview" id="eventPreview">
                                <div class="game-badge" id="preview-game-badge" style="display: none;">Puzzle</div>
                                <div class="card-content">
                                    <div class="category-label" id="preview-category-label" style="background: rgba(163, 85, 20, 0.15); color: #a35514;">Museum</div>
                                    <div class="year" id="preview-year">1950</div>
                                    <div class="title" id="preview-title">Event Titel</div>
                                    <div class="description" id="preview-description">Beschrijving van het event verschijnt hier...</div>
                                </div>
                            </div>
                        </div>
                
                        <div class="preview-card" id="modalPreviewCard">
                            <h3>Voorvertoning - Modal</h3>
                            <div style="background: #fff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; max-height: 80vh; overflow-y: auto;">
                                <!-- Year Badge -->
                                <div style="display: inline-flex; align-items: center; padding: 8px 20px; border-radius: 9999px; background: rgba(201, 163, 0, 0.2); border: 1px solid rgba(201, 163, 0, 0.3); margin-bottom: 24px;">
                                    <span id="preview-modal-year" style="font-size: 18px; font-weight: bold; color: #c9a300; letter-spacing: 0.05em;">1950</span>
                                </div>
                                
                                <!-- Title -->
                                <h1 id="preview-modal-title" style="font-size: 32px; font-weight: bold; margin-bottom: 24px; color: #c9a300; line-height: 1.2;">Event Titel</h1>
                                
                                <!-- Description -->
                                <div id="preview-modal-description-wrapper" style="margin-bottom: 32px; display: none;">
                                    <p id="preview-modal-description" style="font-size: 18px; color: #657575; line-height: 1.7; font-weight: 300;">
                                        Beschrijving van het event verschijnt hier...
                                    </p>
                                </div>
                                
                                <!-- Historical Context -->
                                <div id="preview-modal-context-wrapper" style="margin-bottom: 32px; display: none;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                                        <span style="font-size: 20px;">🕐</span>
                                        <h3 style="font-size: 20px; font-weight: bold; color: #440f0f;">Historische Context</h3>
                                    </div>
                                    <div id="preview-modal-context" style="background: #f3f2e9; border-radius: 16px; padding: 24px; border: 1px solid rgba(167, 184, 180, 0.4);">
                                        <p style="font-size: 16px; color: #657575; line-height: 1.7; font-weight: 300; margin: 0;">
                                            Historische context verschijnt hier...
                                        </p>
                                    </div>
                                </div>
                                
                                <!-- Key Moments -->
                                <div id="preview-modal-moments-wrapper" style="margin-bottom: 32px; display: none;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                                        <span style="font-size: 20px;">🕐</span>
                                        <h3 style="font-size: 20px; font-weight: bold; color: #440f0f;">Belangrijke momenten</h3>
                                    </div>
                                    <div id="preview-modal-moments" style="background: #f9fafb; border-radius: 8px; padding: 16px; min-height: 60px;">
                                        <p style="font-size: 14px; color: #6b7280; font-style: italic; margin: 0;">Geen momenten toegevoegd</p>
                                    </div>
                                </div>
                                
                                <!-- Sections -->
                                <div id="preview-modal-sections" style="space-y: 16px;">
                                    <!-- Sections will be dynamically added here -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Section: Media -->
                <div class="form-section">
                        <h3>Media</h3>
                        <div class="form-group">
                            <label>Nieuwe Media Toevoegen</label>
                            <div id="newMediaList"></div>
                            <button type="button" class="add-btn" onclick="addMediaUpload()">+ Media toevoegen</button>
                    </div>

                        <div class="form-group" style="margin-top: 30px;">
                            <label>Bestaande Media</label>
                            <div id="mediaList">
                    <?php if (!empty($eventMedia)): ?>
                                    <?php foreach ($eventMedia as $index => $media): ?>
                                        <div class="section-item" data-media-index="<?= $index ?>">
                                            <div class="section-header">
                                                <h4><?= $media['media_type'] === 'image' ? 'Foto' : 'Video' ?> <?= $index + 1 ?></h4>
                                                <label class="checkbox-group" style="margin: 0;">
                                                    <input type="checkbox" name="delete_media[]" value="<?= $media['id'] ?>">
                                                    <span style="color: #991b1b; font-size: 12px;">Verwijderen</span>
                                                </label>
                    </div>
                                            <div class="form-group">
                                                <label>Bestand: <strong><?= htmlspecialchars($media['file_url']) ?></strong></label>
                                                <input type="hidden" name="existing_media[<?= $index ?>][id]" value="<?= $media['id'] ?>">
                                    </div>
                                            <div class="form-group">
                                                <label>Bijschrift (optioneel)</label>
                                                <input type="text" name="existing_media[<?= $index ?>][caption]" value="<?= htmlspecialchars($media['caption'] ?? '') ?>" placeholder="Bijschrift voor deze media">
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                                    <p style="color: #6b7280; font-style: italic;">Geen media toegevoegd.</p>
                    <?php endif; ?>
                    </div>
                    </div>
                    
                    <!-- Section: Belangrijke Momenten -->
                    <div class="form-section">
                        <h3>Belangrijke Momenten</h3>
                        <div class="form-group">
                            <label class="checkbox-group">
                                <input type="checkbox" name="has_key_moments" id="hasKeyMoments" <?= $event['has_key_moments'] ? 'checked' : '' ?> onchange="toggleKeyMoments()">
                                <span>Heeft belangrijke momenten</span>
                            </label>
                        </div>
                        
                        <div id="keyMomentsSection" style="<?= $event['has_key_moments'] ? '' : 'display:none' ?>">
                            <small style="color: #6b7280; font-size: 12px; display: block; margin-bottom: 12px;">
                                Sleep momenten om volgorde te wijzigen (max 5)
                            </small>
                            <div id="keyMomentsList">
                                <?php 
                                $moments = !empty($eventKeyMoments) ? $eventKeyMoments : [['year' => '', 'title' => '', 'description' => '']];
                                foreach ($moments as $index => $moment): 
                                ?>
                                <div class="section-item" data-moment-index="<?= $index ?>">
                                    <div class="drag-handle"></div>
                                    <div class="section-header">
                                        <h4>Moment <?= $index + 1 ?></h4>
                                        <?php if ($index > 0): ?>
                                        <button type="button" class="remove-btn" onclick="removeMoment(this)">Verwijderen</button>
                                        <?php endif; ?>
                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Jaar</label>
                                            <input type="number" name="key_moments[<?= $index ?>][year]" value="<?= htmlspecialchars($moment['year']) ?>" min="1000" max="9999" placeholder="bijv. 1955" oninput="updatePreview()">
                </div>
                                        <div class="form-group">
                                            <label>Titel</label>
                                            <input type="text" name="key_moments[<?= $index ?>][title]" value="<?= htmlspecialchars($moment['title']) ?>" placeholder="Titel van het moment" oninput="updatePreview()">
            </div>
                                        </div>
                                    <div class="form-group">
                                        <label>Beschrijving (optioneel)</label>
                                        <input type="text" name="key_moments[<?= $index ?>][description]" value="<?= htmlspecialchars($moment['description'] ?? '') ?>" placeholder="Korte beschrijving" oninput="updatePreview()">
                                        </div>
                                        </div>
                            <?php endforeach; ?>
                                        </div>
                            <button type="button" class="add-btn" onclick="addMoment()">+ Moment toevoegen</button>
                                    </div>
                                        </div>
                    
                    <!-- Section: Spel -->
                    <div class="form-section">
                        <h3>Spel</h3>
                        <div class="form-group">
                            <label>Kies speltype</label>
                            <div class="game-type-grid">
                                <label class="game-type-option">
                                    <input type="radio" name="game_type" value="none" <?= $event['game_type'] === 'none' ? 'checked' : '' ?> onchange="toggleGameOptions()">
                                    <div class="game-type-card">
                                        <span class="label">Geen spel</span>
                                        <span class="desc">Geen interactief spel</span>
                                        </div>
                                </label>
                                <label class="game-type-option">
                                    <input type="radio" name="game_type" value="puzzle" <?= $event['game_type'] === 'puzzle' ? 'checked' : '' ?> onchange="toggleGameOptions()">
                                    <div class="game-type-card">
                                        <span class="label">Puzzle Spel</span>
                                        <span class="desc">Schuifpuzzel met afbeelding</span>
                                    </div>
                                </label>
                                <label class="game-type-option">
                                    <input type="radio" name="game_type" value="memory" <?= $event['game_type'] === 'memory' ? 'checked' : '' ?> onchange="toggleGameOptions()">
                                    <div class="game-type-card">
                                        <span class="label">Memory Spel</span>
                                        <span class="desc">Vind de paren</span>
                                </div>
                                </label>
                    </div>
                </div>

                        <div class="puzzle-upload-area" id="puzzleUploadSection">
                            <input type="file" name="puzzle_image" id="puzzleFileUpload" accept="image/*" style="display:none" onchange="updateFileName(this)">
                            <button type="button" class="upload-btn" onclick="document.getElementById('puzzleFileUpload').click()">
                                Selecteer Afbeelding
                            </button>
                            <p style="margin-top: 12px; color: #1e40af; font-size: 13px;">
                                Upload een afbeelding die in stukjes wordt verdeeld voor de puzzle<br>
                                <small>Ondersteunde formaten: JPEG, PNG, GIF, WebP</small>
                            </p>
                            <div id="selectedFileName" style="margin-top: 12px; color: #3b82f6; font-weight: 500; display: none;"></div>
                            <?php if (!empty($event['puzzle_image'])): ?>
                                <div class="current-file">
                                    Huidig bestand: <strong><?= htmlspecialchars($event['puzzle_image']) ?></strong>
                                        </div>
                        <?php endif; ?>
                                        </div>
                        
                        <div class="memory-info" id="memoryInfoSection">
                            <p>Het Memory spel gebruikt standaard afbeeldingen met landbouw thema (dieren, tractoren, etc.).<br>
                            <small style="color: #065f46;">Geen afbeelding upload nodig voor dit speltype.</small></p>
                                    </div>
                                    </div>
                    
                    <!-- Submit Section -->
                    <div class="form-section full-width">
                        <div class="submit-section">
                            <a href="index.php" class="btn btn-secondary">Annuleren</a>
                            <button type="submit" class="btn btn-primary">
                                <?= $isEdit ? 'Wijzigingen Opslaan' : 'Event Toevoegen' ?>
                            </button>
                                    </div>
                                </div>
            </form>
        </div>
    </div>

    <script>
        let sectionIndex = <?= !empty($eventSections) ? count($eventSections) : 0 ?>;
        let momentIndex = <?= !empty($eventKeyMoments) ? count($eventKeyMoments) : 1 ?>;
        
        const categoryColors = {
            'museum': '#a35514',
            'landbouw': '#22c55e',
            'maatschappelijk': '#c9a300'
        };
        
        const categoryLabels = {
            'museum': 'Museum',
            'landbouw': 'Landbouw',
            'maatschappelijk': 'Maatschappelijk'
        };
        
        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            const tabContent = document.getElementById('tab-' + tabName);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Find and activate the corresponding tab button
            const tabs = document.querySelectorAll('.tab');
            const tabLabels = {
                'basic': 'Basis',
                'content': 'Inhoud',
                'media': 'Media',
                'game': 'Spel'
            };
            const targetLabel = tabLabels[tabName];
            tabs.forEach(tab => {
                if (tab.textContent.includes(targetLabel)) {
                    tab.classList.add('active');
                }
            });
            
            // Update preview visibility
            updatePreview();
        }
        
        let mediaUploadIndex = 0;
        
        function addMediaUpload() {
            const list = document.getElementById('newMediaList');
            const html = `
                <div class="section-item" data-new-media-index="${mediaUploadIndex}">
                    <div class="section-header">
                        <h4>Nieuw Media ${mediaUploadIndex + 1}</h4>
                        <button type="button" class="remove-btn" onclick="removeNewMedia(this)">Verwijderen</button>
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select name="new_media_type[${mediaUploadIndex}]" required>
                            <option value="image">Foto</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Bestand</label>
                        <input type="file" name="new_media_file[]" accept="image/*,video/*" required>
                        <small style="color: #6b7280; font-size: 12px; display: block; margin-top: 4px;">
                            Foto's: JPEG, PNG, GIF, WebP | Video's: MP4, WebM, OGG
                        </small>
                    </div>
                    <div class="form-group">
                        <label>Bijschrift (optioneel)</label>
                        <input type="text" name="new_media_caption[${mediaUploadIndex}]" placeholder="Bijschrift voor deze media">
                </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', html);
            mediaUploadIndex++;
        }
        
        function removeNewMedia(btn) {
            btn.closest('.section-item').remove();
        }
        
        function toggleGameOptions() {
            const gameType = document.querySelector('input[name="game_type"]:checked')?.value || 'none';
            const puzzleSection = document.getElementById('puzzleUploadSection');
            const memorySection = document.getElementById('memoryInfoSection');
            const gameBadge = document.getElementById('preview-game-badge');
            
            puzzleSection.classList.remove('active');
            memorySection.classList.remove('active');
            gameBadge.style.display = 'none';
            
            if (gameType === 'puzzle') {
                puzzleSection.classList.add('active');
                gameBadge.textContent = 'Puzzle';
                gameBadge.style.display = 'block';
                gameBadge.style.background = '#c9a300';
            } else if (gameType === 'memory') {
                memorySection.classList.add('active');
                gameBadge.textContent = 'Memory';
                gameBadge.style.display = 'block';
                gameBadge.style.background = '#22c55e';
            }
        }
        
        function formatYearForDisplay(yearString) {
            if (!yearString) return '1950';
            
            // If it's already a range (e.g., "1900-1910"), format it with spaces
            if (yearString.includes('-')) {
                return yearString.replace('-', ' - ');
            }
            
            // If it's a single year, show it as is (or add range if needed)
            return yearString;
        }
        
        function updatePreview() {
            const jaar = document.getElementById('preview-jaar')?.value || '1950';
            const titel = document.getElementById('preview-titel')?.value || 'Event Titel';
            const text = document.getElementById('preview-text')?.value || 'Beschrijving van het event verschijnt hier...';
            const category = document.getElementById('preview-category')?.value || 'museum';
            const context = document.getElementById('preview-context')?.value || '';
            
            // Format year for display (add spaces around dash if it's a range)
            const formattedYear = formatYearForDisplay(jaar);
            
            // Update card preview
            document.getElementById('preview-year').textContent = formattedYear;
            document.getElementById('preview-title').textContent = titel || 'Event Titel';
            document.getElementById('preview-description').textContent = text || 'Beschrijving van het event verschijnt hier...';
            
            const categoryLabel = document.getElementById('preview-category-label');
            categoryLabel.textContent = categoryLabels[category] || 'Museum';
            categoryLabel.style.background = categoryColors[category] ? `rgba(${hexToRgb(categoryColors[category])}, 0.15)` : 'rgba(163, 85, 20, 0.15)';
            categoryLabel.style.color = categoryColors[category] || '#a35514';
            
            const cardPreview = document.getElementById('eventPreview');
            cardPreview.style.borderTopColor = categoryColors[category] || '#a35514';
            
            // Update modal preview
            document.getElementById('preview-modal-year').textContent = formattedYear;
            document.getElementById('preview-modal-title').textContent = titel || 'Event Titel';
            
            // Description
            const descWrapper = document.getElementById('preview-modal-description-wrapper');
            const descElement = document.getElementById('preview-modal-description');
            if (text && text.trim() !== '' && text !== 'Beschrijving van het event verschijnt hier...') {
                descElement.textContent = text;
                descWrapper.style.display = 'block';
                } else {
                descWrapper.style.display = 'none';
            }
            
            // Historical Context
            const contextWrapper = document.getElementById('preview-modal-context-wrapper');
            const contextElement = document.getElementById('preview-modal-context');
            if (context && context.trim() !== '') {
                contextElement.querySelector('p').textContent = context;
                contextWrapper.style.display = 'block';
            } else {
                contextWrapper.style.display = 'none';
            }
            
            // Key Moments
            updatePreviewMoments();
            
            // Sections
            updatePreviewSections();
            
            // Always show modal preview
            const modalPreviewCard = document.getElementById('modalPreviewCard');
            if (modalPreviewCard) {
                modalPreviewCard.style.display = 'block';
            }
        }
        
        function updatePreviewMoments() {
            const momentsWrapper = document.getElementById('preview-modal-moments-wrapper');
            const momentsContainer = document.getElementById('preview-modal-moments');
            const moments = document.querySelectorAll('#keyMomentsList .section-item');
            
            if (moments.length === 0) {
                momentsWrapper.style.display = 'none';
                return;
            }
            
            let hasContent = false;
            let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
            
            moments.forEach((moment, index) => {
                const year = moment.querySelector('input[name*="[year]"]')?.value || '';
                const title = moment.querySelector('input[name*="[title]"]')?.value || '';
                const desc = moment.querySelector('input[name*="[description]"]')?.value || '';
                
                if (year || title) {
                    hasContent = true;
                    html += `
                        <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid #c9a300;">
                            <div style="display: flex; gap: 12px; align-items: baseline; margin-bottom: 4px;">
                                ${year ? `<span style="font-weight: bold; color: #c9a300; font-size: 16px;">${year}</span>` : ''}
                                ${title ? `<span style="font-weight: 600; color: #440f0f; font-size: 15px;">${title}</span>` : ''}
                    </div>
                            ${desc ? `<p style="font-size: 14px; color: #657575; margin: 4px 0 0 0; line-height: 1.5;">${desc}</p>` : ''}
                </div>
            `;
                }
            });
            
            html += '</div>';
            
            if (hasContent) {
                momentsContainer.innerHTML = html;
                momentsWrapper.style.display = 'block';
            } else {
                momentsWrapper.style.display = 'none';
            }
        }
        
        function updatePreviewSections() {
            const sectionsContainer = document.getElementById('preview-modal-sections');
            const sections = document.querySelectorAll('#sectionsList .section-item');
            
            if (sections.length === 0) {
                sectionsContainer.innerHTML = '';
                return;
            }
            
            let html = '';
            
            sections.forEach((section, index) => {
                const title = section.querySelector('input[name*="[title]"]')?.value || '';
                const content = section.querySelector('textarea[name*="[content]"]')?.value || '';
                const hasBorder = section.querySelector('input[name*="[has_border]"]')?.checked || false;
                
                if (!title && !content) return;
                
                if (hasBorder) {
                    html += `
                        <div style="background: #f3f2e9; border-radius: 16px; padding: 24px; border: 1px solid rgba(167, 184, 180, 0.4); margin-bottom: 24px;">
                            ${title ? `<h3 style="font-size: 20px; font-weight: bold; color: #c9a300; margin-bottom: 12px; margin-top: 0;">${escapeHtml(title)}</h3>` : ''}
                            ${content ? `<p style="font-size: 16px; color: #657575; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(content)}</p>` : ''}
                        </div>
                    `;
                } else {
                    html += `
                        <div style="padding: 16px 0; border-bottom: 1px solid rgba(167, 184, 180, 0.2); margin-bottom: 16px;">
                            ${title ? `<h4 style="font-size: 18px; font-weight: 600; color: #440f0f; margin-bottom: 8px; margin-top: 0;">${escapeHtml(title)}</h4>` : ''}
                            ${content ? `<p style="font-size: 16px; color: #657575; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(content)}</p>` : ''}
                        </div>
                    `;
                }
            });
            
            sectionsContainer.innerHTML = html;
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
                '163, 85, 20';
        }
        
        function updateFileName(input) {
            const fileNameDiv = document.getElementById('selectedFileName');
            if (input.files && input.files[0]) {
                fileNameDiv.textContent = 'Geselecteerd: ' + input.files[0].name;
                fileNameDiv.style.display = 'block';
            } else {
                fileNameDiv.style.display = 'none';
            }
        }
        
        function toggleKeyMoments() {
            const section = document.getElementById('keyMomentsSection');
            const checkbox = document.getElementById('hasKeyMoments');
            section.style.display = checkbox.checked ? 'block' : 'none';
        }
        
        function addSection() {
            const list = document.getElementById('sectionsList');
            const html = `
                <div class="section-item" data-section-index="${sectionIndex}">
                    <div class="drag-handle"></div>
                    <div class="section-header">
                        <h4>Sectie ${sectionIndex + 1}</h4>
                        <button type="button" class="remove-btn" onclick="removeSection(this)">Verwijderen</button>
                    </div>
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" name="sections[${sectionIndex}][title]" placeholder="Sectie titel" oninput="updatePreview()">
                    </div>
                    <div class="form-group">
                        <label>Inhoud</label>
                        <textarea name="sections[${sectionIndex}][content]" placeholder="Sectie inhoud..." oninput="updatePreview()"></textarea>
                    </div>
                    <input type="hidden" name="sections[${sectionIndex}][order]" value="${sectionIndex + 1}">
                    <label class="checkbox-group" style="margin-top: 12px;">
                        <input type="checkbox" name="sections[${sectionIndex}][has_border]" onchange="updatePreview()">
                        <span>Met rand</span>
                    </label>
                    </div>
            `;
            list.insertAdjacentHTML('beforeend', html);
            sectionIndex++;
            updateSectionIndices();
            initializeSortable();
            updatePreview();
        }
        
        function removeSection(btn) {
            btn.closest('.section-item').remove();
            updateSectionIndices();
            initializeSortable();
            updatePreview();
        }
        
        function addMoment() {
            if (momentIndex >= 5) {
                alert('Maximaal 5 momenten toegestaan');
                return;
            }
            const list = document.getElementById('keyMomentsList');
            const html = `
                <div class="section-item" data-moment-index="${momentIndex}">
                    <div class="drag-handle"></div>
                    <div class="section-header">
                        <h4>Moment ${momentIndex + 1}</h4>
                        <button type="button" class="remove-btn" onclick="removeMoment(this)">Verwijderen</button>
                </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Jaar</label>
                            <input type="number" name="key_moments[${momentIndex}][year]" min="1000" max="9999" placeholder="bijv. 1955" oninput="updatePreview()">
                    </div>
                        <div class="form-group">
                            <label>Titel</label>
                            <input type="text" name="key_moments[${momentIndex}][title]" placeholder="Titel van het moment" oninput="updatePreview()">
                    </div>
                    </div>
                    <div class="form-group">
                        <label>Beschrijving (optioneel)</label>
                        <input type="text" name="key_moments[${momentIndex}][description]" placeholder="Korte beschrijving" oninput="updatePreview()">
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', html);
            momentIndex++;
            updateMomentIndices();
            initializeSortable();
            updatePreview();
        }
        
        function removeMoment(btn) {
            btn.closest('.section-item').remove();
            momentIndex--;
            updateMomentIndices();
            initializeSortable();
            updatePreview();
        }
        
        
        // Store Sortable instances
        let sectionsSortable = null;
        let momentsSortable = null;
        
        // Initialize SortableJS for drag and drop
        function initializeSortable() {
            // Sortable for sections
            const sectionsList = document.getElementById('sectionsList');
            if (sectionsList) {
                // Destroy existing instance if it exists
                if (sectionsSortable) {
                    sectionsSortable.destroy();
                }
                sectionsSortable = new Sortable(sectionsList, {
                    handle: '.drag-handle',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onEnd: function(evt) {
                        updateSectionIndices();
                        updatePreview();
                    }
                });
            }
            
            // Sortable for key moments
            const keyMomentsList = document.getElementById('keyMomentsList');
            if (keyMomentsList) {
                // Destroy existing instance if it exists
                if (momentsSortable) {
                    momentsSortable.destroy();
                }
                momentsSortable = new Sortable(keyMomentsList, {
                    handle: '.drag-handle',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onEnd: function(evt) {
                        updateMomentIndices();
                        updatePreview();
                    }
                });
            }
        }
        
        // Update section indices after drag and drop
        function updateSectionIndices() {
            const sections = document.querySelectorAll('#sectionsList .section-item');
            sections.forEach((section, index) => {
                section.setAttribute('data-section-index', index);
                const header = section.querySelector('.section-header h4');
                if (header) {
                    header.textContent = `Sectie ${index + 1}`;
                }
                
                // Update input names
                const titleInput = section.querySelector('input[name*="[title]"]');
                const contentTextarea = section.querySelector('textarea[name*="[content]"]');
                const orderInput = section.querySelector('input[name*="[order]"]');
                const borderCheckbox = section.querySelector('input[name*="[has_border]"]');
                
                if (titleInput) titleInput.name = `sections[${index}][title]`;
                if (contentTextarea) contentTextarea.name = `sections[${index}][content]`;
                if (orderInput) {
                    orderInput.name = `sections[${index}][order]`;
                    orderInput.value = index + 1;
                }
                if (borderCheckbox) borderCheckbox.name = `sections[${index}][has_border]`;
            });
        }
        
        // Update moment indices after drag and drop
        function updateMomentIndices() {
            const moments = document.querySelectorAll('#keyMomentsList .section-item');
            moments.forEach((moment, index) => {
                moment.setAttribute('data-moment-index', index);
                const header = moment.querySelector('.section-header h4');
                if (header) {
                    header.textContent = `Moment ${index + 1}`;
                }
                
                // Update input names
                const yearInput = moment.querySelector('input[name*="[year]"]');
                const titleInput = moment.querySelector('input[name*="[title]"]');
                const descInput = moment.querySelector('input[name*="[description]"]');
                
                if (yearInput) yearInput.name = `key_moments[${index}][year]`;
                if (titleInput) titleInput.name = `key_moments[${index}][title]`;
                if (descInput) descInput.name = `key_moments[${index}][description]`;
            });
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            toggleGameOptions();
            toggleKeyMoments();
            updatePreview();
            initializeSortable();
            
            // Update preview on any input change
            document.querySelectorAll('input, textarea, select').forEach(input => {
                if (input.id && (input.id.startsWith('preview-') || input.id === 'preview-text' || input.id === 'preview-context')) {
                    input.addEventListener('input', updatePreview);
                    input.addEventListener('change', updatePreview);
                }
            });
            
            // Also watch for changes in sections and moments that are added dynamically
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // Element node
                                const inputs = node.querySelectorAll && node.querySelectorAll('input, textarea');
                                if (inputs) {
                                    inputs.forEach(input => {
                                        if (!input.oninput) {
                                            input.addEventListener('input', updatePreview);
                                            input.addEventListener('change', updatePreview);
                                        }
                                    });
                                }
                            }
                        });
                }
            });
        });

            observer.observe(document.getElementById('sectionsList'), { childList: true, subtree: true });
            observer.observe(document.getElementById('keyMomentsList'), { childList: true, subtree: true });
            
            // Add listeners to existing sections and moments
            document.querySelectorAll('#sectionsList input, #sectionsList textarea').forEach(input => {
                input.addEventListener('input', updatePreview);
                input.addEventListener('change', updatePreview);
            });
            
            document.querySelectorAll('#keyMomentsList input').forEach(input => {
                input.addEventListener('input', updatePreview);
                input.addEventListener('change', updatePreview);
            });
            
            // Watch for tab changes to update preview visibility
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    setTimeout(updatePreview, 100);
                });
            });
        });
    </script>
</body>
</html>

