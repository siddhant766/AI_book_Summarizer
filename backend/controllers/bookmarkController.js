const SavedSummary = require('../models/SavedSummary');

/**
 * @desc    Save a book summary (Add Bookmark)
 * @route   POST /api/bookmarks
 * @access  Private
 */
const addBookmark = async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    // Check if bookmark already exists
    const existingBookmark = await SavedSummary.findOne({
      userId: req.user._id,
      bookId: bookId
    });

    if (existingBookmark) {
      return res.status(400).json({ success: false, message: 'Book summary already saved' });
    }

    const bookmark = await SavedSummary.create({
      userId: req.user._id,
      bookId: bookId
    });

    return res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    console.error('Add bookmark error:', error.message);
    return res.status(500).json({ success: false, message: 'Error bookmarking summary' });
  }
};

/**
 * @desc    Remove a saved summary (Delete Bookmark)
 * @route   DELETE /api/bookmarks/:id
 * @access  Private
 */
const removeBookmark = async (req, res) => {
  try {
    const bookId = req.params.id;

    const bookmark = await SavedSummary.findOneAndDelete({
      userId: req.user._id,
      bookId: bookId
    });

    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    return res.json({ success: true, message: 'Book summary removed from saved list' });
  } catch (error) {
    console.error('Remove bookmark error:', error.message);
    return res.status(500).json({ success: false, message: 'Error removing bookmark' });
  }
};

/**
 * @desc    Get user's saved book summaries
 * @route   GET /api/bookmarks
 * @access  Private
 */
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await SavedSummary.find({ userId: req.user._id })
      .populate('bookId')
      .sort({ savedAt: -1 });

    // Filter out any bookmarks where the referenced book no longer exists
    const validBookmarks = bookmarks.filter(b => b.bookId !== null);

    return res.json({
      success: true,
      count: validBookmarks.length,
      data: validBookmarks.map(b => b.bookId)
    });
  } catch (error) {
    console.error('Get bookmarks error:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching bookmarks' });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks
};
