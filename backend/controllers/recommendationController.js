const SearchHistory = require('../models/SearchHistory');
const SavedSummary = require('../models/SavedSummary');
const Book = require('../models/Book');

/**
 * Helper to parse readingTimeSaved string (e.g. "7 hours 50 minutes") into minutes
 */
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 480; // 8 hours default (480 minutes)
  
  let totalMinutes = 0;
  const hourMatch = timeStr.match(/(\d+)\s*hour/);
  const minMatch = timeStr.match(/(\d+)\s*min/);
  
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60;
  }
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10);
  }
  
  return totalMinutes > 0 ? totalMinutes : 480;
};

/**
 * @desc    Get dashboard statistics, search history, and recommendations
 * @route   GET /api/books/recommendations/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch Search History (limit 5 for listing, but get more for stats)
    const allHistory = await SearchHistory.find({ userId })
      .sort({ searchedAt: -1 });

    const recentSearches = allHistory.slice(0, 8).map(h => ({
      title: h.bookTitle,
      author: h.author,
      searchedAt: h.searchedAt
    }));

    // Find unique book titles searched
    const uniqueSearchedTitles = [...new Set(allHistory.map(h => h.bookTitle.toLowerCase()))];
    const totalSummarizedCount = uniqueSearchedTitles.length;

    // 2. Fetch User's Saved Bookmarks
    const bookmarks = await SavedSummary.find({ userId }).populate('bookId');
    const validSavedBooks = bookmarks.filter(b => b.bookId !== null).map(b => b.bookId);

    // 3. Compute User Statistics (Favorite Genre, Reading Time Saved)
    let genresCount = {};
    let totalMinutesSaved = 0;
    
    // Add genres from searched books in database
    const booksInDb = await Book.find({
      title: { $in: allHistory.map(h => new RegExp(`^${h.bookTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i')) }
    });

    // Merge genres and calculate time saved from DB books
    const processedBookIds = new Set();
    
    booksInDb.forEach(book => {
      processedBookIds.add(book._id.toString());
      // Genre mapping
      if (book.genre && Array.isArray(book.genre)) {
        book.genre.forEach(g => {
          genresCount[g] = (genresCount[g] || 0) + 1;
        });
      }
      totalMinutesSaved += parseTimeToMinutes(book.readingTimeSaved);
    });

    // Also add bookmarks to time saved and genres (avoiding double count if already processed)
    validSavedBooks.forEach(book => {
      if (!processedBookIds.has(book._id.toString())) {
        processedBookIds.add(book._id.toString());
        if (book.genre && Array.isArray(book.genre)) {
          book.genre.forEach(g => {
            genresCount[g] = (genresCount[g] || 0) + 1;
          });
        }
        totalMinutesSaved += parseTimeToMinutes(book.readingTimeSaved);
      }
    });

    // Determine favorite genre
    let favoriteGenre = 'N/A';
    let maxGenreCount = 0;
    Object.entries(genresCount).forEach(([genre, count]) => {
      if (count > maxGenreCount && genre.toLowerCase() !== 'general') {
        favoriteGenre = genre;
        maxGenreCount = count;
      }
    });
    if (favoriteGenre === 'N/A' && Object.keys(genresCount).length > 0) {
      favoriteGenre = Object.keys(genresCount)[0]; // fallback
    }

    // Format reading time saved (e.g. "15 hours")
    let timeSavedStr = '0 hours';
    if (totalMinutesSaved > 0) {
      const hours = Math.floor(totalMinutesSaved / 60);
      const mins = totalMinutesSaved % 60;
      timeSavedStr = hours > 0 
        ? `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`
        : `${mins} min`;
    }

    // 4. Generate Personalized Recommendations
    // Find what genres/authors the user likes
    const preferredGenres = Object.keys(genresCount);
    
    let dbRecommendations = [];
    if (preferredGenres.length > 0) {
      // Find books in DB that user hasn't saved or searched, but are in their preferred genres
      dbRecommendations = await Book.find({
        genre: { $in: preferredGenres },
        title: { $nin: allHistory.map(h => h.bookTitle) }
      }).limit(5);
    }

    // Default Trending Books list (useful as recommendations fallback or default dashboard display)
    const defaultTrending = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        genre: ["Self-Improvement", "Psychology"],
        coverImage: "https://books.google.com/books/content?id=gDgKDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        description: "An easy and proven way to build good habits and break bad ones."
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        genre: ["Productivity", "Self-Improvement"],
        coverImage: "https://books.google.com/books/content?id=y49VBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        description: "Rules for focused success in a distracted world."
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        genre: ["Psychology", "Science"],
        coverImage: "https://books.google.com/books/content?id=Zu4fda5crUKC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        description: "An analysis of the two systems that drive the way we think."
      },
      {
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        genre: ["Finance", "Business"],
        coverImage: "https://books.google.com/books/content?id=V2T3DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        description: "What the rich teach their kids about money that the poor and middle class do not!"
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        genre: ["History", "Anthropology"],
        coverImage: "https://books.google.com/books/content?id=1Y9dAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        description: "A brief history of humankind from early hominids to the modern era."
      }
    ];

    // Combine database recommendations and trending ones, ensuring uniqueness by title
    let combinedRecs = [...dbRecommendations];
    const recTitles = new Set(combinedRecs.map(r => r.title.toLowerCase()));

    defaultTrending.forEach(trendBook => {
      if (!recTitles.has(trendBook.title.toLowerCase()) && !uniqueSearchedTitles.includes(trendBook.title.toLowerCase())) {
        combinedRecs.push(trendBook);
        recTitles.add(trendBook.title.toLowerCase());
      }
    });

    // Limit recommendations to top 6 items
    const recommendations = combinedRecs.slice(0, 6);

    return res.json({
      success: true,
      data: {
        statistics: {
          booksSummarized: totalSummarizedCount,
          timeSaved: timeSavedStr,
          favoriteGenre: favoriteGenre
        },
        recentSearches,
        recommendations
      }
    });
  } catch (error) {
    console.error('Get dashboard recommendations controller error:', error.message);
    return res.status(500).json({ success: false, message: 'Error retrieving dashboard analytics' });
  }
};

module.exports = {
  getDashboardData
};
