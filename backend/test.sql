-- Drop existing indexes
DROP INDEX IF EXISTS idx_messages_contact_created_desc;
DROP INDEX IF EXISTS idx_messages_created_at_desc;

EXPLAIN ANALYZE
WITH LastMessages AS (
    SELECT DISTINCT ON (contact_id)
      contact_id,
      content,
      created_at
    FROM messages
    ORDER BY contact_id, created_at DESC
)
SELECT 
  c.id as contact_id,
  c.phone_number,
  lm.content as last_message,
  lm.created_at as last_message_time
FROM contacts c
INNER JOIN LastMessages lm ON c.id = lm.contact_id
ORDER BY lm.created_at DESC
LIMIT 50;

SELECT * FROM contacts;
SELECT * FROM messages;

EXPLAIN ANALYZE WITH LastMessages AS (
        SELECT DISTINCT ON (contact_id)
          contact_id,
          content,
          created_at
        FROM messages
        ORDER BY contact_id, created_at DESC
      )
      SELECT 
        c.id as contact_id,
        c.phone_number,
        lm.content as last_message,
        lm.created_at as last_message_time,
        (SELECT COUNT(*) FROM LastMessages) as total_count
      FROM contacts c
      INNER JOIN LastMessages lm ON c.id = lm.contact_id
      ORDER BY lm.created_at DESC;
EXPLAIN ANALYZE WITH LastMessages AS (
    SELECT DISTINCT ON (contact_id)
        contact_id,
        content,
        created_at
    FROM messages
    ORDER BY contact_id, created_at DESC
)
SELECT 
    c.id AS contact_id,
    c.phone_number,
    lm.content AS last_message_content,
    lm.created_at AS last_message_time
FROM contacts c
JOIN LastMessages lm ON c.id = lm.contact_id 
ORDER BY lm.created_at DESC
LIMIT 50;

RESET enable_indexscan;
RESET enable_bitmapscan;
