-- Create puzzle_scores table for storing game results
-- Max 10 scores, unique names, sorted by moves (lower is better)

CREATE TABLE IF NOT EXISTS puzzle_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(10) NOT NULL UNIQUE,
    moves INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_moves (moves ASC),
    INDEX idx_completed (completed_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial test data (optional - remove in production)
-- INSERT INTO puzzle_scores (player_name, moves) VALUES 
--     ('Emma', 12),
--     ('Lucas', 15),
--     ('Sophie', 18),
--     ('Milan', 22),
--     ('Anna', 25);

