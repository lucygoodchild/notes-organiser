const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { analyzeText } = require('../services/aiService');

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a note
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Optional: AI analysis
    let aiData = {};
    try {
      aiData = await analyzeText(content);
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      // Continue even if AI analysis fails
    }
    
    const note = new Note({
      title,
      content,
      category: category || aiData.suggestedCategory || 'Other',
      sentiment: aiData.sentiment || '',
      summary: aiData.summary || ''
    });
    
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Optional: AI analysis on content change
    let aiData = {};
    if (content) {
      try {
        aiData = await analyzeText(content);
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
      }
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(content && {
          sentiment: aiData.sentiment || req.body.sentiment,
          summary: aiData.summary || req.body.summary
        }),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search notes
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const notes = await Note.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;