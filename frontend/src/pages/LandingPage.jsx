import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { RiBookLine, RiCpuLine, RiTimeLine, RiBookmarkLine, RiChat3Line, RiCompass3Line } from 'react-icons/ri';

const LandingPage = () => {
  const { token } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const features = [
    {
      icon: RiCpuLine,
      title: "Generative AI Summaries",
      desc: "Instantly create concise 100-word overviews and comprehensive chapter-wise breakdowns using advanced Gemini models."
    },
    {
      icon: RiTimeLine,
      title: "Reading Time Saved",
      desc: "Skip the 10-hour reading load. Extract actionable insights and fundamental paradigms in under 5 minutes."
    },
    {
      icon: RiChat3Line,
      title: "Interactive AI Chat",
      desc: "Chat directly with the context of any summarized book. Ask questions, clarify concepts, or request chapter translations."
    },
    {
      icon: RiCompass3Line,
      title: "Book Comparisons",
      desc: "Compare two books side-by-side. Analyze conflicting methodologies, key differences, strengths, and reader difficulties."
    },
    {
      icon: RiBookmarkLine,
      title: "Personal Library",
      desc: "Bookmark summaries to your profile. Build a personalized reading history and receive tailored recommendations."
    },
    {
      icon: RiBookLine,
      title: "Google Books API Connect",
      desc: "Search and pull book metadata, covers, publisher dates, and genre categories from millions of titles automatically."
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full glow-blur-indigo opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full glow-blur-cyan opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Tag badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-400 uppercase">
            <span>✨ Powered by Gemini AI & Google Books</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight">
            Understand Any Book in{' '}
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Minutes
            </span>{' '}
            with AI
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Get intelligent summaries, key takeaways, and insights from thousands of books instantly. Explore topics, chat with book context, and compare ideas.
          </motion.p>

          {/* Call-to-actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={token ? "/search" : "/register"}
              className="w-full sm:w-auto text-center bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to={token ? "/dashboard" : "/login"}
              className="w-full sm:w-auto text-center glass-card hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
            >
              Explore Books
            </Link>
          </motion.div>

          {/* Book Floating illustration */}
          <motion.div
            variants={itemVariants}
            className="pt-16 pb-8 relative flex justify-center items-center"
          >
            <div className="relative w-72 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-brand-600/20 to-cyan-500/20 rounded-3xl border border-white/5 shadow-2xl p-6 flex flex-col justify-between overflow-hidden backdrop-blur-md animate-float">
              {/* Inside book design */}
              <div className="flex justify-between items-start">
                <span className="text-2xl font-bold font-display bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">BM</span>
                <span className="text-xs text-slate-400 font-mono">EDITION 2026</span>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-1 bg-brand-500 rounded"></div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-left tracking-tight">The AI Reading Revolution</h3>
                <p className="text-xs text-slate-400 text-left leading-relaxed">Let artificial intelligence parse complex concepts. Accelerate your knowledge aggregation, review summaries, and ask deep questions seamlessly.</p>
              </div>
              <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-brand-400">AI</div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200">BookMind Agent</p>
                  <p className="text-[10px] text-slate-500">Active Reader Assistant</p>
                </div>
              </div>
            </div>
            
            {/* Small absolute decorations */}
            <div className="hidden sm:block absolute top-12 left-16 w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-2xl animate-float-slow">📚</div>
            <div className="hidden sm:block absolute bottom-12 right-12 w-20 h-20 rounded-2xl glass-card flex items-center justify-center text-3xl animate-float-medium">🧠</div>
          </motion.div>
        </motion.div>

        {/* FEATURES GRID */}
        <div className="pt-24 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">Features Packed for Learning</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base">BookMind AI integrates Google Books metadata and Gemini AI to create the ultimate visual learning companion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="glass-card hover:bg-slate-800/30 hover:border-slate-700/60 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 group-hover:bg-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center mb-6 transition-colors duration-300">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
