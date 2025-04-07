-- Step 1: Create temporary table for messages
CREATE TEMP TABLE temp_messages (content TEXT);

-- Step 2: Load message content
COPY temp_messages(content) FROM '/var/lib/postgresql/message_content_clean.txt' WITH (FORMAT text);

-- Step 3: Insert messages with deterministic distribution
INSERT INTO messages (contact_id, content, created_at)
WITH 
-- Number all contacts sequentially
numbered_contacts AS (
  SELECT id, row_number() OVER (ORDER BY id) as contact_num
  FROM contacts
),
-- Number all messages sequentially
numbered_messages AS (
  SELECT content, row_number() OVER (ORDER BY content) as message_num
  FROM temp_messages
),
-- Calculate total message count
message_count AS (
  SELECT count(*) as total FROM temp_messages
)
SELECT 
  c.id,
  m.content,
  -- Deterministic timestamp based on contact ID and message content hash
  TIMESTAMP '2020-01-01' + 
    (MOD(hashtext(c.id::text || m.content), 365*3) || ' days')::INTERVAL +
    (MOD(hashtext(m.content), 86400) || ' seconds')::INTERVAL
FROM numbered_contacts c
JOIN numbered_messages m ON m.message_num = MOD(c.contact_num, (SELECT total FROM message_count)) + 1;