-- Disable index scan
SET enable_indexscan = OFF;
SET enable_bitmapscan = OFF;

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
LIMIT 500;