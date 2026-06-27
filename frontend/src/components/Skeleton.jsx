import React from 'react';

export const BookCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/40 animate-pulse flex flex-col justify-between h-80">
      <div className="flex space-x-4">
        {/* Cover */}
        <div className="w-20 h-28 bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0"></div>
        {/* Metadata */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        </div>
      </div>
      {/* Description skeleton lines */}
      <div className="space-y-2 mt-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
      </div>
      {/* Action button */}
      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4 w-full"></div>
    </div>
  );
};

export const SummarySkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Hero card skeleton */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-36 h-48 mx-auto md:mx-0 bg-slate-200 dark:bg-slate-800 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
          </div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-32 mt-4"></div>
        </div>
      </div>
      {/* Tab content skeleton */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6 h-32 flex flex-col justify-between">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};
