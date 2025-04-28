const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { parseNaturalLanguageQuery } = require('../services/aiService');

// Process natural language queries
router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    // Parse the query to get structured search parameters
    const queryObj = await parseNaturalLanguageQuery(query);
    
    // Execute the search
    const notes = await Note.find(queryObj).sort({ updatedAt: -1 });
    
    res.json({
      query: query,
      parsedQuery: queryObj,
      results: notes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;