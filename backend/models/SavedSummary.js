const mongoose = require('mongoose');

const SavedSummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index so a user cannot save the same book multiple times
SavedSummarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('SavedSummary', SavedSummarySchema);
