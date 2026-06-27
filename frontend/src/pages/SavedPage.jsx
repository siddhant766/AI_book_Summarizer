import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BookCardSkeleton } from '../components/Skeleton';
import { 
  RiBookmarkFill, 
  RiBookOpenLine, 
  RiDeleteBinLine, 
  RiSearchLine
} from 'react-icons/ri';

const SavedPage = () => {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSavedSummaries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookmarks');
      setSavedBooks(res.data.data);
    } catch (err) {
      console.error('Failed to load bookmarks:', err.message);
      setError('Error loading saved book summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSummaries();
  }, []);

  const handleRemoveSaved = async (e, bookId) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation(); // prevent navigation
    
    if (!window.confirm('Are you sure you want to remove this summary from your library?')) {
      return;
    }

    try {
      await api.delete(`/bookmarks/${bookId}`);
      setSavedBooks(prev => prev.filter(book => book._id !== bookId));
    } catch (err) {
      console.error('Failed to delete bookmark:', err.message);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="font-display font-bold text-3xl dark:text-white flex items-center">
          <RiBookmarkFill className="w-8 h-8 text-brand-500 mr-2" />
          Your Saved Summaries
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Access your personalized library of saved books, action lists, and AI chat histories.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto text-center bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-semibold p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* SAVED SUMMARIES GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : savedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBooks.map((book) => (
            <Link 
              key={book._id} 
              to={`/book/${book._id}`}
              className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex space-x-4">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-16 h-24 rounded-lg object-cover shadow-md bg-slate-900 flex-shrink-0"
                      onError={(e) => { e.target.src = ''; }}
                    />
                  ) : (
                    <div className="w-16 h-24 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <RiBookOpenLine className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-brand-500 dark:text-brand-400 font-bold uppercase tracking-wider">
                        {book.difficultyLevel}
                      </span>
                      <button
                        onClick={(e) => handleRemoveSaved(e, book._id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors duration-200"
                        title="Remove bookmark"
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h3 className="font-display font-bold text-base line-clamp-1 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200 mt-1" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{book.author}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.genre && book.genre.slice(0, 2).map((g, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-200/50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {book.quickSummary}
                </p>
              </div>

              {/* View summary CTA */}
              <button
                className="mt-6 w-full flex items-center justify-center bg-slate-200/60 dark:bg-slate-800 hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-200 font-semibold py-2 rounded-xl transition-all duration-200 text-xs"
              >
                Open Summary & Insights
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card max-w-md mx-auto rounded-3xl p-12 border border-slate-200/50 dark:border-slate-800/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <RiBookmarkFill className="w-8 h-8 text-brand-500" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-lg dark:text-white">Your library is empty</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              You haven't bookmark-saved any summaries yet. Go to the search page, summarize a book, and click the "Save Summary" button!
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-brand-500/10 transition-all duration-200"
          >
            <RiSearchLine className="w-4 h-4 mr-1.5" />
            Discover Books
          </Link>
        </div>
      )}

    </div>
  );
};

export default SavedPage;
