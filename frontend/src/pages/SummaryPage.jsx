import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { SummarySkeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';
import { 
  RiBookmarkLine, 
  RiBookmarkFill, 
  RiBookOpenLine,
  RiTimeLine,
  RiCompass3Line,
  RiUser3Line,
  RiDoubleQuotesL,
  RiCheckDoubleLine,
  RiQuestionAnswerLine,
  RiSendPlane2Fill,
  RiLoader4Line
} from 'react-icons/ri';

const SummaryPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Action checklist checked state mapping
  const [checkedActions, setCheckedActions] = useState({});

  // Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const bookRes = await api.get(`/books/${id}`);
        setBook(bookRes.data.data);

        // Check if book is saved in bookmarks
        const savedRes = await api.get('/bookmarks');
        const savedList = savedRes.data.data;
        const exists = savedList.some(item => item._id === bookRes.data.data._id);
        setIsSaved(exists);

        // Initialize action checklist from local storage or empty
        const savedActions = localStorage.getItem(`actions_${id}`);
        if (savedActions) {
          setCheckedActions(JSON.parse(savedActions));
        }
      } catch (error) {
        console.error('Error fetching book summary details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  useEffect(() => {
    // Scroll chat to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const handleToggleBookmark = async () => {
    try {
      if (isSaved) {
        await api.delete(`/bookmarks/${book._id}`);
        setIsSaved(false);
      } else {
        await api.post('/bookmarks', { bookId: book._id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark status:', error.message);
    }
  };

  const handleActionToggle = (index) => {
    const newChecked = { ...checkedActions, [index]: !checkedActions[index] };
    setCheckedActions(newChecked);
    localStorage.setItem(`actions_${id}`, JSON.stringify(newChecked));
  };

  const handleSendChatMessage = async (e, customMsg = null) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg || chatMessage;
    if (!msgToSend.trim() || chatLoading) return;

    const userMessage = { sender: 'user', message: msgToSend };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const response = await api.post(`/books/${id}/chat`, {
        message: msgToSend,
        history: chatHistory
      });

      const aiMessage = { sender: 'ai', message: response.data.data };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to book chat:', error.message);
      setChatHistory(prev => [
        ...prev,
        { sender: 'ai', message: 'Sorry, I failed to process that request. Make sure your Gemini API key is configured correctly.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Simple Markdown Renderer Helper
  const renderDetailedSummary = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('###')) {
        return (
          <h3 key={idx} className="font-display font-bold text-xl mt-6 mb-3 dark:text-white border-l-4 border-brand-500 pl-3">
            {line.replace('###', '').trim()}
          </h3>
        );
      }
      if (line.startsWith('##')) {
        return (
          <h2 key={idx} className="font-display font-extrabold text-2xl mt-8 mb-4 dark:text-white">
            {line.replace('##', '').trim()}
          </h2>
        );
      }
      if (line.startsWith('-') || line.startsWith('*')) {
        return (
          <ul key={idx} className="list-disc pl-6 my-2 space-y-1">
            <li className="text-slate-600 dark:text-slate-300 font-medium">{line.substring(1).trim()}</li>
          </ul>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }
      return (
        <p key={idx} className="text-slate-600 dark:text-slate-300 my-3 font-medium leading-relaxed">
          {line.trim()}
        </p>
      );
    });
  };

  if (loading) {
    return <div className="py-12"><SummarySkeleton /></div>;
  }

  if (!book) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <p className="text-lg font-bold text-slate-400">Book summary not found.</p>
        <Link to="/search" className="text-brand-500 hover:text-brand-600 font-semibold underline">Back to Search</Link>
      </div>
    );
  }

  const defaultPrompts = [
    "What is the biggest lesson from this book?",
    "Explain the main thesis simply.",
    "What are some practical action steps?"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER HERO SUMMARY CARD */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex flex-col md:flex-row gap-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full glow-blur-indigo opacity-10 pointer-events-none"></div>

        {/* Cover segment */}
        <div className="w-40 h-56 sm:w-44 sm:h-64 mx-auto md:mx-0 shrink-0 relative group">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full rounded-2xl object-cover shadow-2xl bg-slate-900 border border-white/10"
              onError={(e) => { e.target.src = ''; }}
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-500 shadow-2xl">
              <RiBookOpenLine className="w-12 h-12 mb-2" />
              <span className="text-xs">No Cover</span>
            </div>
          )}
        </div>

        {/* Metadata Details */}
        <div className="flex-1 space-y-5 flex flex-col justify-between">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                book.difficultyLevel === 'Advanced' 
                  ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'
                  : book.difficultyLevel === 'Intermediate'
                    ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
              }`}>
                {book.difficultyLevel} Level
              </span>
              {book.readingTimeSaved && (
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 flex items-center">
                  <RiTimeLine className="w-3.5 h-3.5 mr-1" />
                  Saved {book.readingTimeSaved}
                </span>
              )}
            </div>
            
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl dark:text-white leading-tight">
              {book.title}
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-semibold">
              by {book.author}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <span><b>Publisher:</b> {book.publisher || 'N/A'}</span>
              <span className="hidden sm:inline">•</span>
              <span><b>Published:</b> {book.publicationDate ? book.publicationDate.split('-')[0] : 'N/A'}</span>
              <span className="hidden sm:inline">•</span>
              <span><b>ISBN:</b> {book.isbn || 'N/A'}</span>
            </div>
          </div>

          {/* Action Bookmark CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center justify-center font-semibold px-6 py-3 rounded-2xl transition-all duration-200 border text-sm ${
                isSaved
                  ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              {isSaved ? (
                <>
                  <RiBookmarkFill className="w-5 h-5 mr-1.5" />
                  Saved to Library
                </>
              ) : (
                <>
                  <RiBookmarkLine className="w-5 h-5 mr-1.5" />
                  Save Summary
                </>
              )}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center justify-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-800 transition-all duration-200 text-sm"
            >
              <RiQuestionAnswerLine className="w-5 h-5 mr-1.5" />
              Discuss with Book
            </button>
          </div>
        </div>
      </div>

      {/* TAB CONTROL BUTTONS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto whitespace-nowrap scrollbar-none gap-2 pb-px">
        {[
          { id: 'overview', name: 'Overview' },
          { id: 'detailed', name: 'Detailed Summary' },
          { id: 'takeaways', name: 'Takeaways & Checklist' },
          { id: 'chat', name: 'AI Chat with Book' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-display font-semibold text-sm sm:text-base px-6 py-3 border-b-2 transition-all duration-200 -mb-px outline-none ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-500 dark:border-brand-400 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="min-h-96">
        
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick summary and audience (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick 100-word overview */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
                  <RiBookOpenLine className="w-5 h-5 text-brand-500" />
                  <h3 className="font-display font-semibold text-lg dark:text-white">Quick Summary</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium italic relative pl-4 border-l-2 border-slate-300 dark:border-slate-700">
                  <RiDoubleQuotesL className="absolute -top-3 left-0 w-8 h-8 opacity-5 text-brand-500 pointer-events-none" />
                  {book.quickSummary}
                </p>
              </div>

              {/* Who should read */}
              {book.whoShouldRead && (
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
                    <RiUser3Line className="w-5 h-5 text-brand-500" />
                    <h3 className="font-display font-semibold text-lg dark:text-white">Who Should Read This Book?</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    {book.whoShouldRead}
                  </p>
                </div>
              )}

              {/* Main Themes */}
              {book.mainThemes && book.mainThemes.length > 0 && (
                <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Main Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.mainThemes.map((theme, idx) => (
                      <span key={idx} className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20">
                        #{theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SIDE COLUMN: CHARACTERS (1/3 width) */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
                  <RiCompass3Line className="w-5 h-5 text-slate-500" />
                  <h3 className="font-display font-semibold text-lg dark:text-white">Notable Figures & Roles</h3>
                </div>

                {book.characters && book.characters.length > 0 ? (
                  <div className="space-y-4">
                    {book.characters.map((char, idx) => (
                      <div key={idx} className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/40 space-y-1">
                        <h4 className="text-sm font-bold dark:text-slate-200">{char.name}</h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{char.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-slate-400 py-4 text-center leading-relaxed">
                    This book is non-fictional and focuses on frameworks rather than individual characters.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DETAILED SUMMARY PANEL */}
        {activeTab === 'detailed' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 max-w-4xl mx-auto">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {renderDetailedSummary(book.detailedSummary)}
            </div>
          </div>
        )}

        {/* TAKEAWAYS & ACTIONS PANEL */}
        {activeTab === 'takeaways' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Key Takeaways Grid */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl dark:text-white">Core Philosophy & Takeaways</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.keyTakeaways && book.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/40 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Lessons List */}
            {book.lessons && book.lessons.length > 0 && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-4">
                <h3 className="font-display font-semibold text-lg dark:text-white">Practical Life & Business Lessons</h3>
                <div className="space-y-3">
                  {book.lessons.map((lesson, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm">
                      <span className="text-cyan-500 dark:text-cyan-400 shrink-0 font-bold mt-0.5">•</span>
                      <p className="font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Item Checklist */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/40 pb-3">
                <h3 className="font-display font-semibold text-lg dark:text-white flex items-center">
                  <RiCheckDoubleLine className="w-5.5 h-5.5 mr-1.5 text-brand-500" />
                  Your Implementation Checklist
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {Object.values(checkedActions).filter(Boolean).length} of {book.actionItems?.length || 0} completed
                </span>
              </div>
              
              <div className="space-y-4">
                {book.actionItems && book.actionItems.map((action, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleActionToggle(idx)}
                    className="flex items-start space-x-3.5 cursor-pointer p-3 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 rounded-xl transition-all duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedActions[idx]}
                      onChange={() => {}} // toggled on container click
                      className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 shrink-0 mt-0.5 pointer-events-none"
                    />
                    <span className={`text-sm font-medium leading-relaxed transition-all duration-200 ${
                      checkedActions[idx] 
                        ? 'line-through text-slate-400 dark:text-slate-500' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI CHAT PANEL */}
        {activeTab === 'chat' && (
          <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 max-w-4xl mx-auto flex flex-col h-[32rem] overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/40 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <RiQuestionAnswerLine className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <div>
                  <h3 className="font-display font-semibold text-sm sm:text-base dark:text-white">Active Reading Partner</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Ask questions and clarify key chapters in "{book.title}"</p>
                </div>
              </div>
            </div>

            {/* Chat Body messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center">
                    <RiQuestionAnswerLine className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold dark:text-slate-300">Start the Discussion</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ask anything! Or click one of the quick suggestions below to prompt Gemini immediately.</p>
                  </div>
                  
                  {/* Default buttons */}
                  <div className="flex flex-col gap-2 w-full pt-2">
                    {defaultPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChatMessage(null, prompt)}
                        className="text-left text-xs bg-slate-100 dark:bg-slate-900 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 dark:hover:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-300 font-medium transition-all duration-200"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {chatHistory.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-brand-500 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2 text-sm text-slate-500">
                        <RiLoader4Line className="w-4 h-4 animate-spin text-brand-500" />
                        <span>Compiling answer...</span>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Input Form */}
            {chatHistory.length > 0 && (
              <form onSubmit={handleSendChatMessage} className="bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-slate-800/40 p-4 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Ask something about this book..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-semibold"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim() || chatLoading}
                  className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white p-3.5 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center shrink-0"
                >
                  <RiSendPlane2Fill className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default SummaryPage;
