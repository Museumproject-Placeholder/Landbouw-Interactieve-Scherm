<?php
/**
 * Puzzle Scores API
 * 
 * GET - Get top 10 scores (optionally filtered by difficulty)
 * POST - Add new score (with difficulty)
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// GET - Fetch top 10 scores
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : null;
        
        if ($difficulty && in_array($difficulty, ['easy', 'hard'])) {
            $stmt = $db->prepare("SELECT player_name, moves, difficulty, completed_at FROM puzzle_scores WHERE difficulty = ? ORDER BY moves ASC, completed_at ASC LIMIT 10");
            $stmt->execute([$difficulty]);
        } else {
            $stmt = $db->prepare("SELECT player_name, moves, difficulty, completed_at FROM puzzle_scores ORDER BY moves ASC, completed_at ASC LIMIT 10");
            $stmt->execute();
        }
        
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'scores' => $scores
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch scores: ' . $e->getMessage()]);
    }
    exit;
}

// POST - Add new score
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $playerName = trim($input['player_name'] ?? '');
    $moves = intval($input['moves'] ?? 0);
    $difficulty = $input['difficulty'] ?? 'easy';
    
    // Validate difficulty
    if (!in_array($difficulty, ['easy', 'hard'])) {
        $difficulty = 'easy';
    }
    
    // Validation
    if (empty($playerName)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Player name is required']);
        exit;
    }
    
    if (strlen($playerName) > 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Player name must be max 10 characters']);
        exit;
    }
    
    // Only allow alphanumeric and basic characters
    if (!preg_match('/^[a-zA-Z0-9_\- ]+$/', $playerName)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Player name can only contain letters, numbers, spaces, _ and -']);
        exit;
    }
    
    if ($moves < 1) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid moves count']);
        exit;
    }
    
    try {
        // Check if name already exists for this difficulty
        $checkStmt = $db->prepare("SELECT id FROM puzzle_scores WHERE player_name = ? AND difficulty = ?");
        $checkStmt->execute([$playerName, $difficulty]);
        if ($checkStmt->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Deze naam is al in gebruik voor dit niveau. Kies een andere naam.']);
            exit;
        }
        
        // Count current scores for this difficulty
        $countStmt = $db->prepare("SELECT COUNT(*) as count FROM puzzle_scores WHERE difficulty = ?");
        $countStmt->execute([$difficulty]);
        $count = $countStmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // If 10 or more scores, check if new score is better than worst
        if ($count >= 10) {
            // Get worst score for this difficulty
            $worstStmt = $db->prepare("SELECT id, moves FROM puzzle_scores WHERE difficulty = ? ORDER BY moves DESC, completed_at ASC LIMIT 1");
            $worstStmt->execute([$difficulty]);
            $worst = $worstStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($moves >= $worst['moves']) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Je score is niet in de top 10. Beste score om te verslaan: ' . $worst['moves'] . ' zetten.'
                ]);
                exit;
            }
            
            // Delete worst score to make room
            $deleteStmt = $db->prepare("DELETE FROM puzzle_scores WHERE id = ?");
            $deleteStmt->execute([$worst['id']]);
        }
        
        // Insert new score
        $insertStmt = $db->prepare("INSERT INTO puzzle_scores (player_name, moves, difficulty) VALUES (?, ?, ?)");
        $insertStmt->execute([$playerName, $moves, $difficulty]);
        
        // Get updated leaderboard for this difficulty
        $stmt = $db->prepare("SELECT player_name, moves, difficulty, completed_at FROM puzzle_scores WHERE difficulty = ? ORDER BY moves ASC, completed_at ASC LIMIT 10");
        $stmt->execute([$difficulty]);
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Find player's rank
        $rank = 1;
        foreach ($scores as $index => $score) {
            if ($score['player_name'] === $playerName) {
                $rank = $index + 1;
                break;
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Score opgeslagen! Je staat op #' . $rank . '!',
            'rank' => $rank,
            'scores' => $scores
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save score: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
