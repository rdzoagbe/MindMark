import React, { useState, useMemo } from 'react';
import { useSessions } from '../hooks/useSessions';
import { useTheme } from '../hooks/useTheme';
import { SessionCard } from '../components/SessionCard';
import { Search, Plus, Inbox, Sun, Moon, BarChart3, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { sessions } = useSessions();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    const activeSessions = sessions.filter(s => s.status === 'active');
    if (!searchQuery.trim()) return activeSessions;
    const query = searchQuery.toLowerCase();
    return activeSessions.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.nextStep.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }, [sessions, searchQuery]);

  // Summary Stats
  const stats = useMemo(() => {
    const active = sessions.filter(s => s.status === 'active');
    const today = new Date().setHours(0, 0, 0, 0);
    const resumableToday = active.filter(s => s.updatedAt >= today).length;
    const lastUpdated = active.length > 0 
      ? new Date(Math.max(...active.map(s => s.updatedAt))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'N/A';

    return {
      total: active.length,
      resumableToday,
      lastUpdated
    };
  }, [sessions]);

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back. You have {stats.total} tasks waiting for your focus.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Session
          </Link>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Sessions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resumable Today</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.resumableToday}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
          placeholder="Search by title, description, category or tags..."
        />
      </div>

      {/* Session List */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700/50 mb-6">
            <Inbox className="h-8 w-8 text-gray-300 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery ? "No matches found" : "Ready to start saving context?"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-8">
            {searchQuery
              ? `We couldn't find any active sessions matching "${searchQuery}". Try a different search term.`
              : "Capture your current state before you step away. Your future self will thank you."}
          </p>
          {!searchQuery && (
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Capture Your First Context
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
