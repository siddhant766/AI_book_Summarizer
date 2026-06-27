const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  genre: {
    type: [String],
    default: []
  },
  publicationDate: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  isbn: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'en'
  },
  quickSummary: {
    type: String,
    required: true
  },
  detailedSummary: {
    type: String,
    required: true
  },
  keyTakeaways: {
    type: [String],
    default: []
  },
  lessons: {
    type: [String],
    default: []
  },
  actionItems: {
    type: [String],
    default: []
  },
  mainThemes: {
    type: [String],
    default: []
  },
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  whoShouldRead: {
    type: String,
    default: ''
  },
  characters: {
    type: [CharacterSchema],
    default: []
  },
  readingTimeSaved: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for searching
BookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', BookSchema);
