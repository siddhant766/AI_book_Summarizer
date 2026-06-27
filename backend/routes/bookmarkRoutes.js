const express = require('express');
const { addBookmark, removeBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', addBookmark);
router.get('/', getBookmarks);
router.delete('/:id', removeBookmark);

module.exports = router;
