-- Create memory_scores table for storing memory game results
-- Max 10 scores, unique names, sorted by moves (lower is better)

CREATE TABLE IF NOT EXISTS memory_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(10) NOT NULL UNIQUE,
    moves INT NOT NULL,
    time_seconds INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_moves (moves ASC),
    INDEX idx_time (time_seconds ASC),
    INDEX idx_completed (completed_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

