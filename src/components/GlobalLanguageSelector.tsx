import React from 'react';
import { Globe, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function GlobalLanguageSelector() {
  const { preferredLanguage, handleLanguageChange, LANGUAGES } = useLanguage();

  return (
    <div className="relative group flex items-center">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border theme-border cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
        <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <select
          value={preferredLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-transparent text-xs font-semibold theme-text-primary outline-none appearance-none pr-4 cursor-pointer"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">
              {lang}
            </option>
          ))}
        </select>
        <ChevronRight className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none rotate-90" />
      </div>
    </div>
  );
}
