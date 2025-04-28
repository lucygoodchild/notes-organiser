const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
 title: {
  type: String,
  required: true,
  trim: true,
  minlength: 3,
  maxlength: 100
 },
content: {
  type: String,
  required: true,
  minlength: 10
 },
  category: {
    type: String,
    required: true,
    enum: ['Work', 'Personal', 'Ideas', 'Other'],
    default: 'Other'
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative', ''],
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);