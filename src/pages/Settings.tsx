import React, { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../hooks/useSessions';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/authService';
import { Moon, Sun, Download, Upload, Monitor, Trash2, AlertTriangle, Sparkles, CreditCard, LogOut, User, Cloud, CheckCircle2, ChevronRight } from 'lucide-react';
import { exportImport } from '../utils/exportImport';
import { PlanBadge } from '../components/PlanBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';

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
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <PageHeader 
        title="Settings" 
        description="Manage your account, preferences, and data."
      />

      <Card padding="none" className="divide-y divide-slate-100 dark:divide-white/5 premium-card">
        {/* Account Section */}
        <div className="p-10 sm:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Account</h2>
          </div>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">{user?.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Logged in via Email</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                icon={LogOut}
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-100 dark:border-rose-900/30"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
              <div className="space-y-2">
                <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Guest Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your data is stored locally on this device.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="p-10 sm:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Subscription</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-indigo ${!isFree ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                {!isFree ? <Sparkles className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white capitalize">
                    {currentPlan} Plan
                  </p>
                  <PlanBadge plan={currentPlan} size="sm" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {!isFree ? 'Active subscription' : 'Limited features'}
                </p>
              </div>
            </div>
            {!isFree ? (
              <Button variant="outline" size="lg" onClick={() => alert('Redirecting to Stripe Customer Portal...')}>
                Manage Subscription
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/pricing')} icon={Sparkles}>
                Upgrade Plan
              </Button>
            )}
          </div>

          {/* Developer Fallback for Testing */}
          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Simulate Pro access</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Developer tool to test feature gating without Stripe.</p>
              </div>
              <button
                onClick={() => isFree ? upgrade('pro') : downgrade()}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  !isFree ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                    !isFree ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Sync */}
        <div className="p-10 sm:p-12">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Cloud className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Cloud Sync</h2>
            </div>
            {isAuthenticated ? (
              <Badge variant="green" icon={CheckCircle2}>Active</Badge>
            ) : (
              <Badge variant="indigo">Available</Badge>
            )}
          </div>
          
          <div className="text-center space-y-6 p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm ${isAuthenticated ? 'text-emerald-500' : 'text-indigo-500'}`}>
              <Cloud className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
                {isAuthenticated ? 'Your data is being synced' : 'Multi-device Continuity'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                {isAuthenticated 
                  ? 'All your sessions are securely backed up and available across all your devices in real-time.'
                  : 'Upgrade to Pro and create an account to keep your context available across all your devices.'}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-display font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create account to sync across devices <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Appearance */}
        <div className="p-10 sm:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
            <div className="space-y-1">
              <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Theme</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Toggle between light and dark mode.</p>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-display font-bold transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-display font-bold transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-900 text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-10 sm:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Export Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Download all your sessions as a JSON file.</p>
              </div>
              <Button variant="outline" size="lg" icon={Download} onClick={handleExport}>
                Export JSON
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Import Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Restore sessions from a JSON file.</p>
              </div>
              <Button variant="outline" size="lg" icon={Upload} onClick={handleImportClick}>
                Import JSON
              </Button>
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
        <div className="p-10 sm:p-12 bg-rose-50/30 dark:bg-rose-900/10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-rose-600 dark:text-rose-400">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-1">
              <p className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Clear All Data</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Permanently delete all sessions from this device.</p>
            </div>
            <Button variant="danger" size="lg" icon={Trash2} onClick={clearAllData}>
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
