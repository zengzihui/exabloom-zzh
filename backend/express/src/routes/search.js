const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const offset = (page - 1) * pageSize;

    const query = `
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
        c.contact_name,
        lm.content as last_message,
        lm.created_at as last_message_time,
        COUNT(*) OVER() as total_count
      FROM contacts c
      INNER JOIN LastMessages lm ON c.id = lm.contact_id
      WHERE ($1::text IS NULL) OR 
            lm.content ILIKE $1 OR
            c.phone_number LIKE $1 OR 
            c.contact_name ILIKE $1
      ORDER BY lm.created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const queryParams = [
      search ? `%${search}%` : null,
      pageSize,
      offset
    ];

    const result = await pool.query(query, queryParams);

    const totalCount = result.rows[0]?.total_count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({
      conversations: result.rows,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: parseInt(totalCount),
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;