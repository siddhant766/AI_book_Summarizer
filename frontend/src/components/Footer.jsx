import { RiBookLine } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-950/50 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <RiBookLine className="w-5 h-5 text-brand-500" />
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-cyan-500 dark:from-brand-400 dark:to-cyan-400 bg-clip-text text-transparent">
              BookMind AI
            </span>
          </div>
          
          {/* Tagline */}
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            AI-powered reading intelligence. Original summaries & insights.
          </p>

          {/* Legal and copy */}
          <div className="flex items-center space-x-6 text-sm text-slate-400 dark:text-slate-500">
            <span>&copy; {new Date().getFullYear()} BookMind AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
