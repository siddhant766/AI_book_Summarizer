const express = require('express');
const {
  searchBooks,
  generateSummary,
  getBookDetails,
  chatWithBookController,
  compareBooksController,
  getAllBooks
} = require('../controllers/bookController');
const { getDashboardData } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect middleware to all book routes
router.use(protect);

router.get('/', getAllBooks);
router.get('/search/:title', searchBooks);
router.post('/generate-summary', generateSummary);
router.get('/recommendations/dashboard', getDashboardData);
router.post('/compare', compareBooksController);
router.get('/:id', getBookDetails);
router.post('/:id/chat', chatWithBookController);

module.exports = router;

