-- Create the contacts table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL UNIQUE,
    contact_name TEXT NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create the messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Index to speed up querying most recent message per contact
CREATE INDEX idx_messages_contact_created_desc
    ON messages (contact_id, created_at DESC);

-- -- Index to help sort messages by timestamp in general
CREATE INDEX idx_messages_created_at_desc
    ON messages (created_at DESC);

-- Auto-update contacts.updated_at on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert 100,000 dummy contacts with unique phone numbers
-- Insert first 100,000 sequential phone numbers: 9000000000 to 9000099999
-- Create temporary table for names
CREATE TEMP TABLE temp_names (name TEXT);

-- Load names from CSV
COPY temp_names(name)
FROM '/var/lib/postgresql/mock_names.csv'
WITH (FORMAT CSV);

-- Create numbered names table
CREATE TEMP TABLE numbered_names AS
SELECT name, row_number() OVER (ORDER BY name) as rn
FROM (SELECT DISTINCT name FROM temp_names) t;

-- Insert contacts with names
INSERT INTO contacts (phone_number, contact_name)
SELECT 
    '9' || LPAD((i)::text, 9, '0'),
    (SELECT name FROM numbered_names WHERE rn = 1 + (i % (SELECT COUNT(*) FROM numbered_names)))
FROM generate_series(0, 99999) AS s(i)
ON CONFLICT (phone_number) DO NOTHING;

-- Top-up logic with names
INSERT INTO contacts (phone_number, contact_name)
SELECT 
    '9' || LPAD((i)::text, 9, '0'),
    (SELECT name FROM numbered_names WHERE rn = 1 + (i % (SELECT COUNT(*) FROM numbered_names)))
FROM generate_series(100000, 299999) AS s(i)
WHERE NOT EXISTS (
    SELECT 1 FROM contacts WHERE phone_number = '9' || LPAD((i)::text, 9, '0')
)
LIMIT (100000 - (SELECT COUNT(*) FROM contacts));

-- Clean up
DROP TABLE temp_names;
DROP TABLE numbered_names;