import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatsSkeleton } from '../components/Skeleton';
import { 
  RiUser3Line, 
  RiMailLine, 
  RiCalendarLine, 
  RiBookLine,
  RiTimeLine,
  RiCompassLine
} from 'react-icons/ri';

const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/books/recommendations/dashboard');
        setStats(res.data.data.statistics);
      } catch (err) {
        console.error('Failed to fetch profile statistics:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER */}
      <div>
        <h1 className="font-display font-bold text-3xl dark:text-white">Account Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Manage your BookMind AI credentials and view your aggregate summary metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: USER INFORMATION CARD (1/3 width) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-6">
          <div className="text-center space-y-3 pb-6 border-b border-slate-200/50 dark:border-slate-800/40">
            <div className="w-20 h-20 rounded-full bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mx-auto text-3xl font-bold font-display shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl dark:text-white">{user?.name || 'Reader'}</h3>
              <p className="text-xs bg-brand-500/15 text-brand-500 dark:text-brand-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Premium Reader
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <RiMailLine className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                <p className="dark:text-slate-200 truncate">{user?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <RiCalendarLine className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                <p className="dark:text-slate-200">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
                    : 'June 2026'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED STATS WORKSPACE (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <h3 className="font-display font-bold text-xl dark:text-white border-b border-slate-200/50 dark:border-slate-800/40 pb-4">
              Your Performance Analytics
            </h3>

            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Books count */}
                <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-brand-500">
                    <RiBookLine className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Summarized</span>
                  </div>
                  <h4 className="font-display font-extrabold text-3xl dark:text-white">
                    {stats?.booksSummarized || 0}
                  </h4>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                    Total books analyzed under your profile.
                  </p>
                </div>

                {/* Time Saved */}
                <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-cyan-500">
                    <RiTimeLine className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hours Saved</span>
                  </div>
                  <h4 className="font-display font-extrabold text-2xl truncate dark:text-white" title={stats?.timeSaved || '0 hours'}>
                    {stats?.timeSaved || '0 hours'}
                  </h4>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                    Aggregated study hours optimized via AI.
                  </p>
                </div>

                {/* Favorite Genre */}
                <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-violet-500">
                    <RiCompassLine className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Genre</span>
                  </div>
                  <h4 className="font-display font-extrabold text-xl truncate dark:text-white" title={stats?.favoriteGenre || 'N/A'}>
                    {stats?.favoriteGenre || 'N/A'}
                  </h4>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                    Your dominant genre of research topics.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
