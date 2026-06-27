import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { StatsSkeleton } from '../components/Skeleton';
import { 
  RiBookLine, 
  RiTimeLine, 
  RiCompassLine, 
  RiArrowRightUpLine, 
  RiHistoryLine, 
  RiBookmarkLine,
  RiStarLine,
  RiSearchLine
} from 'react-icons/ri';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch recommendations & stats
        const recsRes = await api.get('/books/recommendations/dashboard');
        setStats(recsRes.data.data.statistics);
        setRecentSearches(recsRes.data.data.recentSearches || []);
        setRecommendations(recsRes.data.data.recommendations || []);

        // Fetch user bookmarks (first 4 items for preview)
        const bookmarksRes = await api.get('/bookmarks');
        setSavedBooks(bookmarksRes.data.data.slice(0, 4) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRecommendClick = (book) => {
    // Navigate to Search page and auto-trigger query
    navigate(`/search?q=${encodeURIComponent(book.title)}`);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="space-y-3">
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
        </div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl dark:text-white">
            {getGreeting()}, {user?.name || 'Reader'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Here is your book summary workspace and reading intelligence overview.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200 group"
        >
          <RiSearchLine className="w-5 h-5 mr-2" />
          Summarize New Book
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <RiBookLine className="w-24 h-24 text-brand-500" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-500/10 text-brand-500 dark:text-brand-400 rounded-2xl">
              <RiBookLine className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Books Summarized</p>
              <h3 className="font-display font-bold text-3xl mt-1 dark:text-white">
                {stats?.booksSummarized || 0}
              </h3>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-4">Total books analyzed by BookMind AI</p>
        </div>

        {/* Stat 2 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <RiTimeLine className="w-24 h-24 text-cyan-500" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 rounded-2xl">
              <RiTimeLine className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimated Time Saved</p>
              <h3 className="font-display font-bold text-3xl mt-1 dark:text-white">
                {stats?.timeSaved || '0 hours'}
              </h3>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-4">Calculated reading hours optimized</p>
        </div>

        {/* Stat 3 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <RiCompassLine className="w-24 h-24 text-violet-500" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-violet-500/10 text-violet-500 dark:text-violet-400 rounded-2xl">
              <RiCompassLine className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Favorite Genre</p>
              <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 truncate dark:text-white" title={stats?.favoriteGenre || 'N/A'}>
                {stats?.favoriteGenre || 'N/A'}
              </h3>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-4">Based on your activity profiles</p>
        </div>
      </div>

      {/* DASHBOARD GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: RECOMMENDATIONS & RECENT SAVES (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recommendations Carousel/Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl dark:text-white">Personalized Recommendations</h2>
              <span className="text-xs bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full text-brand-500 dark:text-brand-400 font-semibold uppercase">Tailored</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.length > 0 ? (
                recommendations.map((book, idx) => (
                  <div 
                    key={idx} 
                    className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 group"
                  >
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
                          <RiBookLine className="w-8 h-8" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-base truncate dark:text-white" title={book.title}>
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mb-2">{book.author}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {book.genre && book.genre.slice(0, 2).map((g, gi) => (
                            <span key={gi} className="text-[10px] bg-slate-200/50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRecommendClick(book)}
                      className="mt-4 w-full flex items-center justify-center bg-slate-200/60 dark:bg-slate-800 hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-200 font-semibold py-2 rounded-xl transition-all duration-200 text-xs"
                    >
                      Generate AI Insights
                      <RiArrowRightUpLine className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 col-span-2">No recommendations available yet. Search some books to build recommendations.</p>
              )}
            </div>
          </div>

          {/* Saved Books Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl dark:text-white">Saved Summaries</h2>
              <Link to="/saved" className="text-xs text-brand-500 hover:text-brand-600 font-semibold flex items-center">
                View All
                <RiArrowRightUpLine className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            {savedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedBooks.map((book) => (
                  <Link 
                    key={book._id} 
                    to={`/book/${book._id}`}
                    className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/40 flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 group"
                  >
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-16 h-24 rounded-lg object-cover shadow-md bg-slate-900 flex-shrink-0"
                        onError={(e) => { e.target.src = ''; }}
                      />
                    ) : (
                      <div className="w-16 h-24 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                        <RiBookLine className="w-8 h-8" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-brand-500 dark:text-brand-400 font-bold uppercase tracking-wider">
                          {book.difficultyLevel}
                        </span>
                        <RiBookmarkLine className="w-4 h-4 text-brand-500" />
                      </div>
                      <h4 className="font-display font-semibold text-base truncate dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200 mt-1">
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mb-2">{book.author}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mt-1 font-medium leading-relaxed">
                        {book.quickSummary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 text-center">
                <RiBookmarkLine className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">You haven't saved any book summaries yet.</p>
                <p className="text-xs text-slate-500 mt-1">Bookmark summaries during reading to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SEARCH HISTORY & PERSONAL STATISTICS (1/3 width) */}
        <div className="space-y-8">
          {/* Recent Searches */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200/50 dark:border-slate-800/40">
              <RiHistoryLine className="w-5 h-5 text-slate-500" />
              <h3 className="font-display font-semibold text-lg dark:text-white">Recent Activity</h3>
            </div>

            {recentSearches.length > 0 ? (
              <div className="space-y-4">
                {recentSearches.map((history, idx) => (
                  <div 
                    key={idx}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(history.title)}`)}
                    className="flex justify-between items-start cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 p-2.5 rounded-xl transition-all duration-200 group"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-sm font-semibold truncate dark:text-slate-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200">
                        {history.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{history.author}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium pt-0.5">
                      {new Date(history.searchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No search history available yet.</p>
            )}
          </div>

          {/* Quick recommendations */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 space-y-4 bg-gradient-to-br from-brand-900/10 to-cyan-900/10">
            <div className="flex items-center space-x-2">
              <RiStarLine className="w-5 h-5 text-yellow-400" />
              <h3 className="font-display font-semibold text-lg dark:text-white">Why Summaries?</h3>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
              <p>💡 <b>Identity over goals</b>: Shift focus from what you want to achieve to who you want to become.</p>
              <p>⚡ <b>Friction Reduction</b>: Lower the friction needed to start positive actions to build consistent cues.</p>
              <p>🚀 <b>Compound Insights</b>: Read a 10-hour book in 5 minutes, mapping the core takeaways instantly.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
