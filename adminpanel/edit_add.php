<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1); // Show errors for debugging
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
    'icon' => '🌾',
    'gradient' => '',
    'museum_gradient' => '',
    'stage' => '1',
    'puzzle' => 0,
    'puzzle_image' => '',
    'game_type' => 'none',
    'detailed_modal' => 0,
    'context' => '',
    'volgorde' => '1',
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
        // Map database columns to form fields
        $yearValue = $event['year'];
        if (preg_match('/^(\d{4})/', $yearValue, $matches)) {
            $yearValue = $matches[1];
        }
        $event['jaar'] = $yearValue;
        $event['titel'] = $event['title'];
        $event['text'] = $event['description'];
        $event['puzzle'] = $event['has_puzzle'];
        $event['puzzle_image'] = $event['puzzle_image_url'] ?? '';
        $event['detailed_modal'] = $event['use_detailed_modal'];
        $event['context'] = $event['historical_context'] ?? '';
        $event['volgorde'] = $event['sort_order'];
        $event['actief'] = $event['is_active'];
        $event['category'] = $event['category'] ?? 'museum';
        $event['has_key_moments'] = $event['has_key_moments'] ?? 0;
        
        // Determine game_type from existing data (has_puzzle + puzzle_image)
        // Always calculate based on actual data, don't trust stored game_type
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
        $keyMomentsResult = mysqli_query($conn, "SELECT * FROM event_key_moments WHERE event_id = $id ORDER BY display_order ASC, year ASC");
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
    $icon = mysqli_real_escape_string($conn, $_POST['icon'] ?? '🌾');
    $gradient = mysqli_real_escape_string($conn, $_POST['gradient'] ?? '');
    $museum_gradient = mysqli_real_escape_string($conn, $_POST['museum_gradient'] ?? '');
    $stage = intval($_POST['stage'] ?? 1);
    $detailed_modal = isset($_POST['detailed_modal']) ? 1 : 0;
    $context = mysqli_real_escape_string($conn, $_POST['context'] ?? '');
    $volgorde = intval($_POST['volgorde'] ?? 1);
    $actief = isset($_POST['actief']) ? 1 : 0;
    $category = mysqli_real_escape_string($conn, $_POST['category'] ?? 'museum');
    $has_key_moments = isset($_POST['has_key_moments']) ? 1 : 0;
    
    // Handle game type selection
    $game_type = $_POST['game_type'] ?? 'none';
    $puzzle = ($game_type === 'puzzle' || $game_type === 'memory') ? 1 : 0;
    
    // Handle puzzle image upload
    $puzzle_image = $event['puzzle_image'] ?? '';
    
    if ($game_type === 'puzzle') {
        // Check if a new file is being uploaded
        if (isset($_FILES['puzzle_image']) && $_FILES['puzzle_image']['error'] === UPLOAD_ERR_OK && $_FILES['puzzle_image']['size'] > 0) {
            // Use absolute path for uploads directory
            $uploadDir = __DIR__ . '/uploads/';
            
            // Create directory if it doesn't exist
            if (!file_exists($uploadDir)) {
                if (!@mkdir($uploadDir, 0755, true)) {
                    $error = "Kan uploads map niet aanmaken. Controleer de serverrechten.";
                }
            }
            
            // Check if directory is writable
            if (empty($error) && !is_writable($uploadDir)) {
                $error = "Uploads map is niet schrijfbaar. Controleer de bestandsrechten (chmod 755 of 777).";
            }
            
            if (empty($error)) {
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                $fileType = $_FILES['puzzle_image']['type'];
                
                if (!in_array($fileType, $allowedTypes)) {
                    $error = "Alleen afbeeldingen zijn toegestaan (JPEG, PNG, GIF, WebP). Ontvangen type: " . htmlspecialchars($fileType);
                } else {
                    // Clean filename
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
        // If no new file uploaded, keep existing puzzle_image (already set above)
    } else {
        // Clear puzzle image if not puzzle game
        $puzzle_image = '';
    }

    // Validate year
    if (!preg_match('/^\d{1,4}$/', $jaar) || intval($jaar) < 0 || intval($jaar) > 9999) {
        $error = "Jaar moet een getal zijn tussen 0 en 9999";
    }

    // Validate required fields
    if (empty($error)) {
        $missing = [];
        if (empty($jaar)) $missing[] = "Jaar";
        if (empty($titel)) $missing[] = "Titel";
        if (empty($text)) $missing[] = "Beschrijving";
        if (!isset($_POST['volgorde']) || $_POST['volgorde'] === '') $missing[] = "Volgorde";
        
        if (!empty($missing)) {
            $error = "Vul alle verplichte velden in: " . implode(", ", $missing);
        }
    }

    if (empty($error)) {
        if ($isEdit) {
            $query = "UPDATE timeline_events SET 
                year='$jaar', title='$titel', description='$text',
                icon='$icon', gradient='$gradient', museum_gradient='$museum_gradient',
                stage='$stage', has_puzzle='$puzzle', puzzle_image_url='$puzzle_image',
                use_detailed_modal='$detailed_modal', historical_context='$context',
                sort_order='$volgorde', is_active='$actief', category='$category',
                has_key_moments='$has_key_moments'
                WHERE id=$id";
        } else {
            $query = "INSERT INTO timeline_events (year, title, description, icon, gradient, museum_gradient, stage, has_puzzle, puzzle_image_url, use_detailed_modal, historical_context, sort_order, is_active, category, has_key_moments)
                VALUES ('$jaar','$titel','$text','$icon','$gradient','$museum_gradient','$stage','$puzzle','$puzzle_image','$detailed_modal','$context','$volgorde','$actief','$category','$has_key_moments')";
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
                        mysqli_query($conn, "INSERT INTO event_key_moments (event_id, year, title, description, display_order) 
                                            VALUES ($eventId, $momentYear, '$momentTitle', '$momentDesc', $displayOrder)");
                        $momentCount++;
                    }
                }
            }

            header("Location: index.php?success=1");
            exit;
        } else {
            $error = "Databasefout: " . mysqli_error($conn);
        }
    }
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
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #e8e8e8;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .back-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        
        .alert {
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-weight: 500;
        }
        
        .alert-error {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
        }
        
        .alert-success {
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.4);
            color: #86efac;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
        }
        
        @media (max-width: 900px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .card {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 24px;
        }
        
        .card-full {
            grid-column: 1 / -1;
        }
        
        .card-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #fff;
        }
        
        .card-title .icon {
            font-size: 24px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group:last-child {
            margin-bottom: 0;
        }
        
        label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #a0a0a0;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        input[type="text"],
        input[type="number"],
        textarea,
        select {
            width: 100%;
            padding: 14px 16px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            color: #fff;
            font-size: 15px;
            font-family: inherit;
            transition: all 0.3s;
        }
        
        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: #00d9ff;
            box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
        }
        
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        select {
            cursor: pointer;
        }
        
        option {
            background: #1a1a2e;
            color: #fff;
        }
        
        /* Game Type Selection */
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
            width: 0;
            height: 0;
        }
        
        .game-type-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px 16px;
            background: rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            transition: all 0.3s;
        }
        
        .game-type-card:hover {
            border-color: rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.05);
        }
        
        .game-type-option input:checked + .game-type-card {
            border-color: #00d9ff;
            background: rgba(0, 217, 255, 0.1);
        }
        
        .game-type-card .emoji {
            font-size: 32px;
        }
        
        .game-type-card .label {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
        }
        
        .game-type-card .desc {
            font-size: 11px;
            color: #888;
            text-align: center;
        }
        
        /* Puzzle Upload */
        .puzzle-upload-area {
            display: none;
            margin-top: 20px;
            padding: 24px;
            background: rgba(0, 217, 255, 0.05);
            border: 2px dashed rgba(0, 217, 255, 0.3);
            border-radius: 12px;
            text-align: center;
            transition: all 0.3s;
        }
        
        .puzzle-upload-area.active {
            display: block;
        }
        
        .puzzle-upload-area:hover {
            border-color: #00d9ff;
            background: rgba(0, 217, 255, 0.1);
        }
        
        .upload-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #00d9ff, #00ff88);
            border: none;
            border-radius: 8px;
            color: #000;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .upload-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3);
        }
        
        .current-file {
            margin-top: 16px;
            padding: 12px 16px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 8px;
            color: #86efac;
            font-size: 13px;
        }
        
        /* Memory Info */
        .memory-info {
            display: none;
            margin-top: 20px;
            padding: 20px;
            background: rgba(34, 197, 94, 0.05);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
        }
        
        .memory-info.active {
            display: block;
        }
        
        .memory-info p {
            color: #86efac;
            font-size: 14px;
            line-height: 1.6;
        }
        
        /* Checkbox */
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .checkbox-group:hover {
            background: rgba(0,0,0,0.3);
        }
        
        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: #00d9ff;
            cursor: pointer;
        }
        
        .checkbox-group span {
            font-size: 14px;
            color: #e8e8e8;
        }
        
        /* Submit Button */
        .submit-section {
            margin-top: 32px;
            display: flex;
            gap: 16px;
            justify-content: flex-end;
        }
        
        .btn {
            padding: 16px 32px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #00d9ff, #00ff88);
            color: #000;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4);
        }
        
        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255,255,255,0.2);
        }
        
        /* Sections */
        .section-item {
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .section-header h4 {
            font-size: 14px;
            color: #00d9ff;
        }
        
        .remove-btn {
            padding: 8px 16px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-radius: 8px;
            color: #fca5a5;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .remove-btn:hover {
            background: rgba(239, 68, 68, 0.3);
        }
        
        .add-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: rgba(0, 217, 255, 0.1);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 8px;
            color: #00d9ff;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .add-btn:hover {
            background: rgba(0, 217, 255, 0.2);
        }
        
        /* Small text */
        .help-text {
            font-size: 12px;
            color: #666;
            margin-top: 6px;
        }
        
        /* Row layout */
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        
        @media (max-width: 600px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            .game-type-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><?= $isEdit ? '✏️ Bewerk Event' : '➕ Nieuw Event' ?></h1>
            <a href="index.php" class="back-btn">← Terug naar overzicht</a>
        </div>
        
        <?php if (!empty($error)): ?>
            <div class="alert alert-error">⚠️ <?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        
        <?php if (!empty($success)): ?>
            <div class="alert alert-success">✅ <?= htmlspecialchars($success) ?></div>
        <?php endif; ?>
        
        <form method="POST" enctype="multipart/form-data">
            <div class="form-grid">
                
                <!-- Basic Info Card -->
                <div class="card">
                    <div class="card-title">
                        <span class="icon">📝</span>
                        Basis Informatie
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Jaar *</label>
                            <input type="number" name="jaar" value="<?= htmlspecialchars($event['jaar']) ?>" min="0" max="9999" required placeholder="bijv. 1950">
                        </div>
                        <div class="form-group">
                            <label>Volgorde *</label>
                            <input type="number" name="volgorde" value="<?= htmlspecialchars($event['volgorde']) ?>" min="0" required placeholder="1">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Titel *</label>
                        <input type="text" name="titel" value="<?= htmlspecialchars($event['titel']) ?>" required placeholder="Event titel">
                    </div>
                    
                    <div class="form-group">
                        <label>Beschrijving *</label>
                        <textarea name="text" required placeholder="Beschrijving van het event..."><?= htmlspecialchars($event['text']) ?></textarea>
                    </div>
                </div>
                
                <!-- Category & Settings Card -->
                <div class="card">
                    <div class="card-title">
                        <span class="icon">⚙️</span>
                        Categorie & Instellingen
                    </div>
                    
                    <div class="form-group">
                        <label>Categorie *</label>
                        <select name="category" required>
                            <option value="museum" <?= $event['category'] === 'museum' ? 'selected' : '' ?>>🏛️ Museum</option>
                            <option value="landbouw" <?= $event['category'] === 'landbouw' ? 'selected' : '' ?>>🌾 Landbouw</option>
                            <option value="maatschappelijk" <?= $event['category'] === 'maatschappelijk' ? 'selected' : '' ?>>👥 Maatschappelijk</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Icon (Emoji)</label>
                            <input type="text" name="icon" value="<?= htmlspecialchars($event['icon']) ?>" placeholder="🌾">
                        </div>
                        <div class="form-group">
                            <label>Stage</label>
                            <select name="stage">
                                <?php for ($i = 1; $i <= 3; $i++): ?>
                                    <option value="<?= $i ?>" <?= $event['stage'] == $i ? 'selected' : '' ?>><?= $i ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-group">
                            <input type="checkbox" name="actief" <?= $event['actief'] ? 'checked' : '' ?>>
                            <span>Actief (zichtbaar op de timeline)</span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-group">
                            <input type="checkbox" name="detailed_modal" <?= $event['detailed_modal'] ? 'checked' : '' ?>>
                            <span>Gebruik detailed modal</span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-group">
                            <input type="checkbox" name="has_key_moments" id="hasKeyMoments" <?= $event['has_key_moments'] ? 'checked' : '' ?> onchange="toggleKeyMoments()">
                            <span>Heeft belangrijke momenten</span>
                        </label>
                    </div>
                </div>
                
                <!-- Game Selection Card -->
                <div class="card card-full">
                    <div class="card-title">
                        <span class="icon">🎮</span>
                        Spel voor Kinderen
                    </div>
                    
                    <label>Kies speltype</label>
                    <div class="game-type-grid">
                        <label class="game-type-option">
                            <input type="radio" name="game_type" value="none" <?= $event['game_type'] === 'none' ? 'checked' : '' ?> onchange="toggleGameOptions()">
                            <div class="game-type-card">
                                <span class="emoji">❌</span>
                                <span class="label">Geen spel</span>
                                <span class="desc">Geen interactief spel</span>
                            </div>
                        </label>
                        <label class="game-type-option">
                            <input type="radio" name="game_type" value="puzzle" <?= $event['game_type'] === 'puzzle' ? 'checked' : '' ?> onchange="toggleGameOptions()">
                            <div class="game-type-card">
                                <span class="emoji">🧩</span>
                                <span class="label">Puzzle Spel</span>
                                <span class="desc">Schuifpuzzel met afbeelding</span>
                            </div>
                        </label>
                        <label class="game-type-option">
                            <input type="radio" name="game_type" value="memory" <?= $event['game_type'] === 'memory' ? 'checked' : '' ?> onchange="toggleGameOptions()">
                            <div class="game-type-card">
                                <span class="emoji">🧠</span>
                                <span class="label">Memory Spel</span>
                                <span class="desc">Vind de paren</span>
                            </div>
                        </label>
                    </div>
                    
                    <!-- Puzzle Upload Area -->
                    <div class="puzzle-upload-area" id="puzzleUploadSection">
                        <input type="file" name="puzzle_image" id="puzzleFileUpload" accept="image/*" style="display:none" onchange="updateFileName(this)">
                        <button type="button" class="upload-btn" onclick="document.getElementById('puzzleFileUpload').click()">
                            📁 Selecteer Afbeelding
                        </button>
                        <p class="help-text" style="margin-top: 12px; color: #888;">
                            Upload een afbeelding die in stukjes wordt verdeeld voor de puzzle<br>
                            <small>Ondersteunde formaten: JPEG, PNG, GIF, WebP</small>
                        </p>
                        <div id="selectedFileName" style="margin-top: 12px; color: #00d9ff; font-weight: 500; display: none;"></div>
                        <?php if (!empty($event['puzzle_image'])): ?>
                            <div class="current-file">
                                ✅ Huidig bestand: <strong><?= htmlspecialchars($event['puzzle_image']) ?></strong>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Memory Info -->
                    <div class="memory-info" id="memoryInfoSection">
                        <p>🧠 Het Memory spel gebruikt standaard afbeeldingen met landbouw thema (dieren, tractoren, etc.).<br>
                        <small style="color: #666;">Geen afbeelding upload nodig voor dit speltype.</small></p>
                    </div>
                </div>
                
                <!-- Historical Context -->
                <div class="card card-full">
                    <div class="card-title">
                        <span class="icon">📜</span>
                        Historische Context
                    </div>
                    <div class="form-group">
                        <label>Achtergrond informatie</label>
                        <textarea name="context" placeholder="Optionele historische context..."><?= htmlspecialchars($event['context']) ?></textarea>
                    </div>
                </div>
                
                <!-- Key Moments -->
                <div class="card card-full" id="keyMomentsSection" style="<?= $event['has_key_moments'] ? '' : 'display:none' ?>">
                    <div class="card-title">
                        <span class="icon">⏰</span>
                        Belangrijke Momenten (max 5)
                    </div>
                    
                    <div id="keyMomentsList">
                        <?php 
                        $moments = !empty($eventKeyMoments) ? $eventKeyMoments : [['year' => '', 'title' => '', 'description' => '']];
                        foreach ($moments as $index => $moment): 
                        ?>
                        <div class="section-item" data-moment-index="<?= $index ?>">
                            <div class="section-header">
                                <h4>Moment <?= $index + 1 ?></h4>
                                <?php if ($index > 0): ?>
                                <button type="button" class="remove-btn" onclick="removeMoment(this)">Verwijderen</button>
                                <?php endif; ?>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Jaar</label>
                                    <input type="number" name="key_moments[<?= $index ?>][year]" value="<?= htmlspecialchars($moment['year']) ?>" min="1000" max="9999" placeholder="bijv. 1955">
                                </div>
                                <div class="form-group">
                                    <label>Titel</label>
                                    <input type="text" name="key_moments[<?= $index ?>][title]" value="<?= htmlspecialchars($moment['title']) ?>" placeholder="Titel van het moment">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Beschrijving (optioneel)</label>
                                <input type="text" name="key_moments[<?= $index ?>][description]" value="<?= htmlspecialchars($moment['description'] ?? '') ?>" placeholder="Korte beschrijving">
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    
                    <button type="button" class="add-btn" onclick="addMoment()">+ Moment toevoegen</button>
                </div>
                
                <!-- Sections -->
                <div class="card card-full">
                    <div class="card-title">
                        <span class="icon">📑</span>
                        Extra Secties
                    </div>
                    
                    <div id="sectionsList">
                        <?php 
                        if (!empty($eventSections)):
                            foreach ($eventSections as $index => $section): 
                        ?>
                        <div class="section-item" data-section-index="<?= $index ?>">
                            <div class="section-header">
                                <h4>Sectie <?= $index + 1 ?></h4>
                                <button type="button" class="remove-btn" onclick="removeSection(this)">Verwijderen</button>
                            </div>
                            <div class="form-group">
                                <label>Titel</label>
                                <input type="text" name="sections[<?= $index ?>][title]" value="<?= htmlspecialchars($section['section_title']) ?>" placeholder="Sectie titel">
                            </div>
                            <div class="form-group">
                                <label>Inhoud</label>
                                <textarea name="sections[<?= $index ?>][content]" placeholder="Sectie inhoud..."><?= htmlspecialchars($section['section_content']) ?></textarea>
                            </div>
                            <input type="hidden" name="sections[<?= $index ?>][order]" value="<?= $index + 1 ?>">
                            <label class="checkbox-group" style="margin-top: 12px;">
                                <input type="checkbox" name="sections[<?= $index ?>][has_border]" <?= ($section['has_border'] ?? 0) ? 'checked' : '' ?>>
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
            
            <!-- Submit -->
            <div class="submit-section">
                <a href="index.php" class="btn btn-secondary">Annuleren</a>
                <button type="submit" class="btn btn-primary">
                    <?= $isEdit ? '💾 Wijzigingen Opslaan' : '➕ Event Toevoegen' ?>
                </button>
            </div>
        </form>
    </div>
    
    <script>
        let sectionIndex = <?= !empty($eventSections) ? count($eventSections) : 0 ?>;
        let momentIndex = <?= !empty($eventKeyMoments) ? count($eventKeyMoments) : 1 ?>;
        
        function toggleGameOptions() {
            const gameType = document.querySelector('input[name="game_type"]:checked')?.value || 'none';
            const puzzleSection = document.getElementById('puzzleUploadSection');
            const memorySection = document.getElementById('memoryInfoSection');
            
            puzzleSection.classList.remove('active');
            memorySection.classList.remove('active');
            
            if (gameType === 'puzzle') {
                puzzleSection.classList.add('active');
            } else if (gameType === 'memory') {
                memorySection.classList.add('active');
            }
        }
        
        function updateFileName(input) {
            const fileNameDiv = document.getElementById('selectedFileName');
            if (input.files && input.files[0]) {
                fileNameDiv.textContent = '📎 Geselecteerd: ' + input.files[0].name;
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
                    <div class="section-header">
                        <h4>Sectie ${sectionIndex + 1}</h4>
                        <button type="button" class="remove-btn" onclick="removeSection(this)">Verwijderen</button>
                    </div>
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" name="sections[${sectionIndex}][title]" placeholder="Sectie titel">
                    </div>
                    <div class="form-group">
                        <label>Inhoud</label>
                        <textarea name="sections[${sectionIndex}][content]" placeholder="Sectie inhoud..."></textarea>
                    </div>
                    <input type="hidden" name="sections[${sectionIndex}][order]" value="${sectionIndex + 1}">
                    <label class="checkbox-group" style="margin-top: 12px;">
                        <input type="checkbox" name="sections[${sectionIndex}][has_border]">
                        <span>Met rand</span>
                    </label>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', html);
            sectionIndex++;
        }
        
        function removeSection(btn) {
            btn.closest('.section-item').remove();
        }
        
        function addMoment() {
            if (momentIndex >= 5) {
                alert('Maximaal 5 momenten toegestaan');
                return;
            }
            const list = document.getElementById('keyMomentsList');
            const html = `
                <div class="section-item" data-moment-index="${momentIndex}">
                    <div class="section-header">
                        <h4>Moment ${momentIndex + 1}</h4>
                        <button type="button" class="remove-btn" onclick="removeMoment(this)">Verwijderen</button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Jaar</label>
                            <input type="number" name="key_moments[${momentIndex}][year]" min="1000" max="9999" placeholder="bijv. 1955">
                        </div>
                        <div class="form-group">
                            <label>Titel</label>
                            <input type="text" name="key_moments[${momentIndex}][title]" placeholder="Titel van het moment">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Beschrijving (optioneel)</label>
                        <input type="text" name="key_moments[${momentIndex}][description]" placeholder="Korte beschrijving">
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', html);
            momentIndex++;
        }
        
        function removeMoment(btn) {
            btn.closest('.section-item').remove();
            momentIndex--;
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            toggleGameOptions();
            toggleKeyMoments();
        });
    </script>
</body>
</html>
