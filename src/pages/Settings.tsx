import React, { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../hooks/useSessions';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/authService';
import { Moon, Sun, Download, Upload, Monitor, Trash2, AlertTriangle, Sparkles, CreditCard, LogOut, User, Cloud, CheckCircle2 } from 'lucide-react';
import { exportImport } from '../utils/exportImport';
import { PlanBadge } from '../components/PlanBadge';
import { Link, useNavigate } from 'react-router-dom';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { sessions, importSessions, clearAllData } = useSessions();
  const { currentPlan, isFree, upgrade, downgrade } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleExport = () => {
    exportImport.exportToJson(sessions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await exportImport.importFromJson(file);
      importSessions(imported);
      alert('Sessions imported successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import sessions.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Manage your account, preferences, and data.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Account Section */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Account
          </h2>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Logged in via Email</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Guest Mode</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">Your data is stored locally on this device.</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-white dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/60 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Subscription
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${!isFree ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>
                {!isFree ? <Sparkles className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    {currentPlan} Plan
                  </p>
                  <PlanBadge plan={currentPlan} size="sm" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {!isFree ? 'Active subscription' : 'Limited features'}
                </p>
              </div>
            </div>
            {!isFree ? (
              <button
                onClick={() => alert('Redirecting to Stripe Customer Portal...')}
                className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              >
                Manage Subscription
              </button>
            ) : (
              <Link
                to="/pricing"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Upgrade Plan
              </Link>
            )}
          </div>

          {/* Developer Fallback for Testing */}
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Simulate Pro access</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Developer tool to test feature gating without Stripe.</p>
              </div>
              <button
                onClick={() => isFree ? upgrade('pro') : downgrade()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  !isFree ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !isFree ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Sync */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-500" />
              Cloud Sync
            </h2>
            {isAuthenticated ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg border border-green-100 dark:border-green-900/30">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                Available
              </span>
            )}
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ${isAuthenticated ? 'text-green-500' : 'text-indigo-500'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {isAuthenticated ? 'Your data is being synced' : 'Multi-device Continuity'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                {isAuthenticated 
                  ? 'All your sessions are securely backed up and available across all your devices in real-time.'
                  : 'Upgrade to Pro and create an account to keep your context available across all your devices.'}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create account to sync across devices →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Appearance */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-500" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            Data Management
          </h2>
          
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Export Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download all your sessions as a JSON file.</p>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm shrink-0"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Import Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Restore sessions from a previously exported JSON file.</p>
              </div>
              <button
                onClick={handleImportClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm shrink-0"
              >
                <Upload className="w-4 h-4" />
                Import JSON
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-8 sm:p-10 bg-red-50/30 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Clear All Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete all sessions from this device.</p>
            </div>
            <button
              onClick={clearAllData}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-sm shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
