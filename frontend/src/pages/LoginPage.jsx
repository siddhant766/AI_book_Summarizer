import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { RiMailLine, RiLockPasswordLine, RiLoader4Line } from 'react-icons/ri';

const LoginPage = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  const from = location.state?.from?.pathname || '/dashboard';
  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter all fields');
    }

    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full glow-blur-indigo opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl relative z-10">
          
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-display font-bold text-3xl tracking-tight dark:text-white">Welcome Back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Log in to your BookMind AI workspace</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm font-semibold rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <RiMailLine className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-slate-100/50 text-slate-900 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 font-medium text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <RiLockPasswordLine className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-slate-100/50 text-slate-900 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 font-medium text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold py-3.5 rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/35 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? (
                <>
                  <RiLoader4Line className="w-5 h-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Redirect link */}
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-semibold underline decoration-2">
              Register here
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
