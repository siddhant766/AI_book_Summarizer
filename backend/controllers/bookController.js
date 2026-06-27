const Book = require('../models/Book');
const SearchHistory = require('../models/SearchHistory');
const { searchGoogleBooks } = require('../services/googleBooksService');
const { generateBookSummary, chatWithBook, compareBooks } = require('../services/geminiService');

/**
 * @desc    Search books via Google Books
 * @route   GET /api/books/search/:title
 * @access  Private
 */
const searchBooks = async (req, res) => {
  try {
    const query = req.params.title;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    const results = await searchGoogleBooks(query);
    return res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Search books controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Error searching books' });
  }
};

/**
 * @desc    Generate or fetch cached book summary
 * @route   POST /api/books/generate-summary
 * @access  Private
 */
const generateSummary = async (req, res) => {
  try {
    const bookDetails = req.body;
    const { title, author } = bookDetails;

    if (!title || !author) {
      return res.status(400).json({ success: false, message: 'Book title and author are required' });
    }

    // Add search record to user history (even if it's cached, we trace that they searched it)
    await SearchHistory.create({
      userId: req.user._id,
      bookTitle: title,
      author: author
    });

    // Check if the book summary already exists in our database (case-insensitive check on title/author)
    let book = await Book.findOne({
      title: { $regex: new RegExp(`^${title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') },
      author: { $regex: new RegExp(`^${author.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
    });

    if (book) {
      console.log(`Cache hit: Serving existing summary for "${title}"`);
      return res.json({ success: true, source: 'cache', data: book });
    }

    console.log(`Cache miss: Triggering AI Summary for "${title}"`);
    // Run Gemini summary generator service
    const aiSummary = await generateBookSummary(bookDetails);

    // Save newly generated summary to database
    book = await Book.create({
      title: title,
      author: author,
      coverImage: bookDetails.coverImage || '',
      genre: bookDetails.genre || [],
      publicationDate: bookDetails.publicationDate || '',
      publisher: bookDetails.publisher || '',
      description: bookDetails.description || '',
      isbn: bookDetails.isbn || '',
      language: bookDetails.language || 'en',
      quickSummary: aiSummary.quickSummary,
      detailedSummary: aiSummary.detailedSummary,
      keyTakeaways: aiSummary.keyTakeaways,
      lessons: aiSummary.lessons,
      actionItems: aiSummary.actionItems,
      mainThemes: aiSummary.mainThemes,
      difficultyLevel: aiSummary.difficultyLevel || 'Beginner',
      whoShouldRead: aiSummary.whoShouldRead || '',
      characters: aiSummary.characters || [],
      readingTimeSaved: aiSummary.readingTimeSaved || 'N/A'
    });

    return res.status(201).json({ success: true, source: 'ai', data: book });
  } catch (error) {
    console.error('Generate summary controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Error generating summary' });
  }
};

/**
 * @desc    Get book summary by database ID
 * @route   GET /api/books/:id
 * @access  Private
 */
const getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book summary not found' });
    }

    return res.json({ success: true, data: book });
  } catch (error) {
    console.error('Get book details error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Book summary not found' });
    }
    return res.status(500).json({ success: false, message: 'Error retrieving book details' });
  }
};

/**
 * @desc    Chat with a book summary context
 * @route   POST /api/books/:id/chat
 * @access  Private
 */
const chatWithBookController = async (req, res) => {
  try {
    const { history, message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book summary not found' });
    }

    const response = await chatWithBook(book, history || [], message);
    return res.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat with book controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Error chatting with book' });
  }
};

/**
 * @desc    Compare two books
 * @route   POST /api/books/compare
 * @access  Private
 */
const compareBooksController = async (req, res) => {
  try {
    const { bookAId, bookBId } = req.body;
    if (!bookAId || !bookBId) {
      return res.status(400).json({ success: false, message: 'Both Book A and Book B IDs are required' });
    }

    const bookA = await Book.findById(bookAId);
    const bookB = await Book.findById(bookBId);

    if (!bookA || !bookB) {
      return res.status(404).json({ success: false, message: 'One or both books could not be found' });
    }

    const comparison = await compareBooks(bookA, bookB);
    return res.json({ success: true, data: comparison });
  } catch (error) {
    console.error('Compare books controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Error comparing books' });
  }
};

/**
 * @desc    Get all summarized books in DB
 * @route   GET /api/books
 * @access  Private
 */
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).select('title author coverImage genre difficultyLevel').sort({ title: 1 });
    return res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    console.error('Get all books error:', error.message);
    return res.status(500).json({ success: false, message: 'Error retrieving books list' });
  }
};

module.exports = {
  searchBooks,
  generateSummary,
  getBookDetails,
  chatWithBookController,
  compareBooksController,
  getAllBooks
};

