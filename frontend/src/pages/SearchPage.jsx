import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCardSkeleton } from '../components/Skeleton';
import { 
  RiSearchLine, 
  RiBookOpenLine, 
  RiCalendarLine, 
  RiCompass3Line,
  RiLoader4Line,
  RiSparklingLine,
  RiCpuLine,
  RiDatabaseLine,
  RiLayoutGridLine
} from 'react-icons/ri';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // AI summary states
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);
  const [activeBookTitle, setActiveBookTitle] = useState('');

  const examples = ['Atomic Habits', 'Rich Dad Poor Dad', 'Deep Work', 'Think and Grow Rich'];

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError('');
      setBooks([]);
      const response = await api.get(`/books/search/${encodeURIComponent(searchQuery)}`);
      setBooks(response.data.data);
      if (response.data.data.length === 0) {
        setError('No books found. Try adjusting your search query.');
      }
    } catch (err) {
      console.error('Error searching books:', err.message);
      setError(err.response?.data?.message || 'Error fetching books from Google Books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
    performSearch(query);
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    setSearchParams({ q: example });
    performSearch(example);
  };

  const handleGenerateSummary = async (book) => {
    setActiveBookTitle(book.title);
    setGenerating(true);
    setGenerationStep(1);

    // Dynamic simulated steps timing for organic feedback loading
    const timer1 = setTimeout(() => setGenerationStep(2), 1500);
    const timer2 = setTimeout(() => setGenerationStep(3), 3200);
    const timer3 = setTimeout(() => setGenerationStep(4), 5000);
    const timer4 = setTimeout(() => setGenerationStep(5), 7000);

    try {
      const response = await api.post('/books/generate-summary', book);
      const generatedBook = response.data.data;
      
      // Make sure we wait at least a tiny bit for UX, then navigate
      setTimeout(() => {
        setGenerating(false);
        navigate(`/book/${generatedBook._id}`);
      }, 7500);

    } catch (err) {
      console.error('Summary generation failed:', err.message);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setGenerating(false);
      alert(err.response?.data?.message || 'Failed to generate AI summary. Please check your Gemini API configuration.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      
      {/* HEADER HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display font-bold text-3xl sm:text-5xl dark:text-white">Discover & Summarize</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed">
          Search the Google Books database, select any volume, and let Gemini AI create a tailored dashboard containing brief overviews, key takeaways, and lessons.
        </p>
      </div>

      {/* SEARCH BAR INPUT */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <RiSearchLine className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Enter a book title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-100/50 text-slate-900 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 font-semibold text-sm shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all duration-200"
          >
            Search
          </button>
        </form>

        {/* Example prompts */}
        <div className="flex flex-wrap gap-2 justify-center items-center mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Try searching:</span>
          {examples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(ex)}
              className="px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500 dark:hover:border-brand-400 transition-all duration-200"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR MSG */}
      {error && (
        <div className="max-w-md mx-auto text-center bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-semibold p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* RESULTS GRID */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top segment: Image & core details */}
                  <div className="flex space-x-4">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-20 h-28 rounded-lg object-cover shadow-md bg-slate-900 flex-shrink-0"
                        onError={(e) => { e.target.src = ''; }}
                      />
                    ) : (
                      <div className="w-20 h-28 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                        <RiBookOpenLine className="w-8 h-8" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base line-clamp-2 dark:text-white" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{book.author}</p>
                      
                      <div className="space-y-1.5 mt-3">
                        <div className="flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <RiCalendarLine className="w-3.5 h-3.5 mr-1" />
                          {book.publicationDate ? book.publicationDate.split('-')[0] : 'N/A'}
                        </div>
                        <div className="flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <RiCompass3Line className="w-3.5 h-3.5 mr-1" />
                          <span className="truncate">{book.genre[0] || 'General'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Description */}
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Generate Summary CTA */}
                <button
                  onClick={() => handleGenerateSummary(book)}
                  className="mt-6 w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-brand-500/10 transition-all duration-200 text-sm"
                >
                  <RiSparklingLine className="w-4 h-4 mr-1.5" />
                  Generate AI Summary
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PREMIUM ACTIVE GENERATING OVERLAY MODAL */}
      <AnimatePresence>
        {generating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-md w-full rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-6"
            >
              {/* Spinning Logo */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-cyan-400 animate-spin-reverse"></div>
                <RiSparklingLine className="w-8 h-8 text-brand-400 animate-pulse" />
              </div>

              {/* Texts */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl dark:text-white">Analyzing "{activeBookTitle}"</h3>
                <p className="text-xs font-semibold text-brand-500 dark:text-brand-400 uppercase tracking-widest animate-pulse">Running Gemini AI Service</p>
              </div>

              {/* Progress Stepper UI */}
              <div className="space-y-4 text-left pt-2">
                {/* Step 1 */}
                <div className={`flex items-center space-x-3 text-sm font-semibold transition-opacity duration-300 ${generationStep >= 1 ? 'opacity-100 text-brand-500 dark:text-brand-400' : 'opacity-30 text-slate-400'}`}>
                  <RiBookOpenLine className="w-5 h-5 shrink-0" />
                  <span>Connecting with Google Books API...</span>
                  {generationStep > 1 && <span className="text-xs text-green-500 font-bold ml-auto">✓</span>}
                  {generationStep === 1 && <RiLoader4Line className="w-4 h-4 animate-spin ml-auto" />}
                </div>

                {/* Step 2 */}
                <div className={`flex items-center space-x-3 text-sm font-semibold transition-opacity duration-300 ${generationStep >= 2 ? 'opacity-100 text-brand-500 dark:text-brand-400' : 'opacity-30 text-slate-400'}`}>
                  <RiDatabaseLine className="w-5 h-5 shrink-0" />
                  <span>Extracting rich metadata...</span>
                  {generationStep > 2 && <span className="text-xs text-green-500 font-bold ml-auto">✓</span>}
                  {generationStep === 2 && <RiLoader4Line className="w-4 h-4 animate-spin ml-auto" />}
                </div>

                {/* Step 3 */}
                <div className={`flex items-center space-x-3 text-sm font-semibold transition-opacity duration-300 ${generationStep >= 3 ? 'opacity-100 text-brand-500 dark:text-brand-400' : 'opacity-30 text-slate-400'}`}>
                  <RiCpuLine className="w-5 h-5 shrink-0" />
                  <span>Prompting Gemini AI model...</span>
                  {generationStep > 3 && <span className="text-xs text-green-500 font-bold ml-auto">✓</span>}
                  {generationStep === 3 && <RiLoader4Line className="w-4 h-4 animate-spin ml-auto" />}
                </div>

                {/* Step 4 */}
                <div className={`flex items-center space-x-3 text-sm font-semibold transition-opacity duration-300 ${generationStep >= 4 ? 'opacity-100 text-brand-500 dark:text-brand-400' : 'opacity-30 text-slate-400'}`}>
                  <RiSparklingLine className="w-5 h-5 shrink-0" />
                  <span>Structuring takeaways & action insights...</span>
                  {generationStep > 4 && <span className="text-xs text-green-500 font-bold ml-auto">✓</span>}
                  {generationStep === 4 && <RiLoader4Line className="w-4 h-4 animate-spin ml-auto" />}
                </div>

                {/* Step 5 */}
                <div className={`flex items-center space-x-3 text-sm font-semibold transition-opacity duration-300 ${generationStep >= 5 ? 'opacity-100 text-brand-500 dark:text-brand-400' : 'opacity-30 text-slate-400'}`}>
                  <RiLayoutGridLine className="w-5 h-5 shrink-0" />
                  <span>Preparing interactive chat canvas...</span>
                  {generationStep === 5 && <RiLoader4Line className="w-4 h-4 animate-spin ml-auto" />}
                </div>
              </div>

              {/* Informative legal banner */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                ⚖️ <b>Notice</b>: We generate original, educational interpretations. Large copyrighted structures or direct excerpts are never fetched.
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SearchPage;
