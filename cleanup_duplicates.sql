-- SQL Script to Clean Duplicate Wage Records
-- This script keeps the oldest wage record for each assignment+calculated_date combination
-- and deletes the duplicates

-- Delete duplicate wages, keeping only the one with the lowest ID (oldest)
DELETE w1 FROM wages w1
INNER JOIN wages w2 
WHERE w1.assignment_id = w2.assignment_id 
  AND w1.calculated_date = w2.calculated_date
  AND w1.id > w2.id;

-- Verify the cleanup
SELECT assignment_id, calculated_date, COUNT(*) as count
FROM wages
GROUP BY assignment_id, calculated_date
HAVING count > 1;
