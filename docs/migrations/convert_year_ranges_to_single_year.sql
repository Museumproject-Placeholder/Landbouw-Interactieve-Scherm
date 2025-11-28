-- Migration: Convert year ranges to single years
-- This migration converts existing year ranges (e.g., "1930-1956") to single years
-- by taking the first year from the range

-- Step 1: Update existing records with ranges to single years
-- This extracts the first 4-digit year from the year field
UPDATE timeline_events 
SET year = SUBSTRING_INDEX(year, '-', 1)
WHERE year LIKE '%-%';

-- Step 2: Clean up any remaining non-numeric characters (keep only first 4 digits)
UPDATE timeline_events 
SET year = SUBSTRING(year, 1, 4)
WHERE LENGTH(year) > 4 OR year REGEXP '[^0-9]';

-- Step 3: Validate all years are 4 digits (optional check)
-- This query will show any records that still don't have valid 4-digit years
SELECT id, year, title 
FROM timeline_events 
WHERE year NOT REGEXP '^[0-9]{4}$';

-- Note: After running this migration, you may want to:
-- 1. Review the results of the validation query above
-- 2. Manually fix any records that don't have valid years
-- 3. Consider adding a CHECK constraint or trigger to prevent invalid years in the future

