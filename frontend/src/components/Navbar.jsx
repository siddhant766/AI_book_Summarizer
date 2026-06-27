import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi';
import { RiBookLine } from 'react-icons/ri';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased font-sans transition-colors duration-300';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 antialiased font-sans transition-colors duration-300';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const activeStyle = ({ isActive }) =>
    `text-sm font-semibold tracking-wide px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-brand-500 bg-brand-500/10 dark:text-brand-400 dark:bg-brand-500/10'
        : 'text-slate-600 hover:text-brand-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
    }`;

  const mobileActiveStyle = ({ isActive }) =>
    `block text-base font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-brand-500 bg-brand-500/10 dark:text-brand-400 dark:bg-brand-500/10'
        : 'text-slate-700 hover:text-brand-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200/50 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <RiBookLine className="w-7 h-7 text-brand-500 dark:text-brand-400" />
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-cyan-500 dark:from-brand-400 dark:to-cyan-400 bg-clip-text text-transparent">
                BookMind AI
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-2">
            {token ? (
              <>
                <NavLink to="/dashboard" className={activeStyle}>Dashboard</NavLink>
                <NavLink to="/search" className={activeStyle}>Search</NavLink>
                <NavLink to="/compare" className={activeStyle}>Compare</NavLink>
                <NavLink to="/saved" className={activeStyle}>Saved</NavLink>
                <NavLink to="/profile" className={activeStyle}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold tracking-wide text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-brand-500 dark:text-slate-300 dark:hover:text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-brand-500/20 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Dark Mode Switch */}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-yellow-400 transition-all duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-yellow-400 transition-all duration-200"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden glass-nav border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {token ? (
              <>
                <NavLink to="/dashboard" className={mobileActiveStyle} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                <NavLink to="/search" className={mobileActiveStyle} onClick={() => setIsOpen(false)}>Search</NavLink>
                <NavLink to="/compare" className={mobileActiveStyle} onClick={() => setIsOpen(false)}>Compare</NavLink>
                <NavLink to="/saved" className={mobileActiveStyle} onClick={() => setIsOpen(false)}>Saved</NavLink>
                <NavLink to="/profile" className={mobileActiveStyle} onClick={() => setIsOpen(false)}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block text-base font-semibold px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-base font-semibold px-4 py-2.5 rounded-lg text-slate-700 hover:text-brand-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <div className="px-4 py-2">
                  <Link
                    to="/register"
                    className="block text-center bg-brand-500 hover:bg-brand-600 text-white text-base font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-brand-500/20 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
