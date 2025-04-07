-- Active: 1743940797816@@localhost@5432@contactsdb
-- Enable index scan (default)
SET enable_indexscan = ON;
SET enable_bitmapscan = ON;

EXPLAIN ANALYZE
WITH LastMessages AS (
    SELECT DISTINCT ON (contact_id)
        contact_id, content, created_at
    FROM messages
    ORDER BY contact_id, created_at DESC
)
SELECT 
    c.id, c.phone_number, lm.content, lm.created_at
FROM contacts c
JOIN LastMessages lm ON c.id = lm.contact_id
ORDER BY lm.created_at DESC
LIMIT 5000;