import React, { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../hooks/useSessions';
import { Moon, Sun, Download, Upload, Monitor, Trash2, AlertTriangle } from 'lucide-react';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { exportSessions, importSessions, clearAllData } = useSessions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          importSessions(data);
          alert('Sessions imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage your preferences and data.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700">
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

        <div className="p-8 border-b border-gray-100 dark:border-gray-700">
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
                onClick={exportSessions}
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

        <div className="p-8 bg-red-50/30 dark:bg-red-900/10">
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
