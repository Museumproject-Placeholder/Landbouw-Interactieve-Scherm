-- Add difficulty column to puzzle_scores table
-- Run this SQL to update existing table

ALTER TABLE puzzle_scores 
ADD COLUMN difficulty VARCHAR(10) DEFAULT 'easy' AFTER moves;

-- Update index for better performance
CREATE INDEX idx_difficulty ON puzzle_scores(difficulty);

-- If you need to recreate the table from scratch:
-- DROP TABLE IF EXISTS puzzle_scores;
-- CREATE TABLE puzzle_scores (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     player_name VARCHAR(10) NOT NULL,
--     moves INT NOT NULL,
--     difficulty VARCHAR(10) DEFAULT 'easy',
--     completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE KEY unique_name_difficulty (player_name, difficulty),
--     INDEX idx_moves (moves ASC),
--     INDEX idx_difficulty (difficulty),
--     INDEX idx_completed (completed_at DESC)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

