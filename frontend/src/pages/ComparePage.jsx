import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  RiCompass3Line, 
  RiLoader4Line, 
  RiGitCommitLine,
  RiSwapLine,
  RiShieldFlashLine,
  RiFileListLine
} from 'react-icons/ri';

const ComparePage = () => {
  const [booksList, setBooksList] = useState([]);
  const [bookAId, setBookAId] = useState('');
  const [bookBId, setBookBId] = useState('');
  
  const [loadingList, setLoadingList] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingList(true);
        const res = await api.get('/books');
        setBooksList(res.data.data);
      } catch (err) {
        console.error('Failed to load books for comparison:', err.message);
        setError('Failed to fetch compiled books list.');
      } finally {
        setLoadingList(false);
      }
    };
    fetchBooks();
  }, []);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!bookAId || !bookBId) {
      return setError('Please select both books to compare.');
    }
    if (bookAId === bookBId) {
      return setError('Please choose two different books.');
    }

    setError('');
    setComparing(true);
    setComparisonResult(null);

    try {
      const res = await api.post('/books/compare', { bookAId, bookBId });
      setComparisonResult(res.data.data);
    } catch (err) {
      console.error('Comparison error:', err.message);
      setError(err.response?.data?.message || 'Error generating book comparison. Please verify your Gemini API configuration.');
    } finally {
      setComparing(false);
    }
  };

  const selectedBookA = booksList.find(b => b._id === bookAId);
  const selectedBookB = booksList.find(b => b._id === bookBId);

  if (loadingList) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[30rem]">
        <RiLoader4Line className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading summarized books library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display font-bold text-3xl sm:text-5xl dark:text-white">Compare Books Side-by-Side</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed">
          Select any two books from your summarized library to run an on-the-fly comparative analysis. Map differences in philosophy, target readers, strengths, and weaknesses.
        </p>
      </div>

      {booksList.length < 2 ? (
        <div className="glass-card max-w-md mx-auto rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 text-center space-y-5">
          <RiSwapLine className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-lg dark:text-white">Need More Summaries</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              You must have at least 2 summarized books in the database to run comparisons. Currently, you have {booksList.length} book(s) summarized.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-2xl text-sm transition-all duration-200"
          >
            Summarize Your First Books
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SELECTION BOX FORM */}
          <form onSubmit={handleCompare} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-6 max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-semibold p-4 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Select Book A */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Book A</label>
                <select
                  value={bookAId}
                  onChange={(e) => { setBookAId(e.target.value); setComparisonResult(null); }}
                  className="w-full px-4 py-3.5 rounded-2xl border bg-slate-100/50 text-slate-900 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">-- Choose Book A --</option>
                  {booksList.map(b => (
                    <option key={b._id} value={b._id}>{b.title} ({b.author})</option>
                  ))}
                </select>
                {selectedBookA && (
                  <div className="flex items-center space-x-3 pt-2">
                    {selectedBookA.coverImage && (
                      <img src={selectedBookA.coverImage} className="w-10 h-14 rounded object-cover shadow bg-slate-900 shrink-0" alt="" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold dark:text-slate-200 truncate">{selectedBookA.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{selectedBookA.author}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Select Book B */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Book B</label>
                <select
                  value={bookBId}
                  onChange={(e) => { setBookBId(e.target.value); setComparisonResult(null); }}
                  className="w-full px-4 py-3.5 rounded-2xl border bg-slate-100/50 text-slate-900 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">-- Choose Book B --</option>
                  {booksList.map(b => (
                    <option key={b._id} value={b._id}>{b.title} ({b.author})</option>
                  ))}
                </select>
                {selectedBookB && (
                  <div className="flex items-center space-x-3 pt-2">
                    {selectedBookB.coverImage && (
                      <img src={selectedBookB.coverImage} className="w-10 h-14 rounded object-cover shadow bg-slate-900 shrink-0" alt="" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold dark:text-slate-200 truncate">{selectedBookB.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{selectedBookB.author}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <button
              type="submit"
              disabled={comparing || !bookAId || !bookBId}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center text-sm shadow-lg shadow-brand-500/10"
            >
              {comparing ? (
                <>
                  <RiLoader4Line className="w-5 h-5 animate-spin mr-2" />
                  Generating AI Comparison Matrix...
                </>
              ) : (
                'Compare Selected Books'
              )}
            </button>
          </form>

          {/* COMPARISON RESULT CONTAINER */}
          {comparisonResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              
              {/* Core comparison table/grid */}
              <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-xl">
                
                {/* Grid header */}
                <div className="grid grid-cols-3 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-5 text-sm font-bold tracking-wide">
                  <div className="text-slate-500 dark:text-slate-400">Metric</div>
                  <div className="dark:text-white truncate">{selectedBookA?.title}</div>
                  <div className="dark:text-white truncate">{selectedBookB?.title}</div>
                </div>

                {/* Grid Rows */}
                {[
                  { key: 'mainIdea', label: 'Core Thesis', icon: RiFileListLine },
                  { key: 'targetAudience', label: 'Target Audience', icon: RiCompass3Line },
                  { key: 'strengths', label: 'Strengths', icon: RiShieldFlashLine },
                  { key: 'weaknesses', label: 'Critiques/Gaps', icon: RiGitCommitLine },
                  { key: 'readingDifficulty', label: 'Reading Level', icon: RiSwapLine }
                ].map((row, idx) => (
                  <div 
                    key={idx} 
                    className="grid grid-cols-3 p-5 text-xs sm:text-sm font-medium border-b last:border-b-0 border-slate-200/50 dark:border-slate-800/40 items-start hover:bg-slate-100/20 dark:hover:bg-slate-900/10 transition-colors duration-200"
                  >
                    <div className="flex items-center text-slate-500 dark:text-slate-400 font-semibold pr-2 select-none">
                      <row.icon className="w-4 h-4 mr-1.5 shrink-0 hidden sm:block" />
                      {row.label}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 pr-4 leading-relaxed whitespace-pre-line">
                      {comparisonResult.comparisonTable[row.key]?.bookA}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {comparisonResult.comparisonTable[row.key]?.bookB}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Takeaway paragraph */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-4 bg-gradient-to-br from-brand-900/10 to-transparent">
                <h3 className="font-display font-bold text-xl dark:text-white flex items-center">
                  ✨ Combined Reading Recommendation
                </h3>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line font-medium">
                  {comparisonResult.overallTakeaway}
                </div>
              </div>

            </motion.div>
          )}

        </div>
      )}

    </div>
  );
};

export default ComparePage;
