-- Add game_type column to timeline_events table
-- game_type: 'none', 'puzzle', 'memory'

ALTER TABLE timeline_events 
ADD COLUMN game_type VARCHAR(20) DEFAULT 'none' AFTER has_puzzle;

-- Update existing events based on has_puzzle and puzzle_image_url
-- If has_puzzle = 1 and puzzle_image_url exists -> puzzle
-- If has_puzzle = 1 and puzzle_image_url is empty -> memory
-- Otherwise -> none

UPDATE timeline_events 
SET game_type = CASE 
    WHEN has_puzzle = 1 AND puzzle_image_url IS NOT NULL AND puzzle_image_url != '' THEN 'puzzle'
    WHEN has_puzzle = 1 THEN 'memory'
    ELSE 'none'
END;

-- Show results
SELECT id, title, has_puzzle, puzzle_image_url, game_type FROM timeline_events;

