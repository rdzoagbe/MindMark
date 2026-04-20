import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

export function Terms() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen theme-bg theme-text-primary">
      <nav className="border-b theme-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 theme-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{isAuthenticated ? t('terms.backDashboard') : t('terms.backHome')}</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 theme-text-secondary text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            {t('terms.badge')}
          </div>
          <h1 className="text-4xl font-bold tracking-tight theme-text-primary">{t('terms.title')}</h1>
          <p className="theme-text-secondary">{t('terms.date')}</p>
        </section>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 theme-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('terms.s1Title')}</h2>
            <p>{t('terms.s1Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('terms.s2Title')}</h2>
            <p>{t('terms.s2Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('terms.s3Title')}</h2>
            <p>{t('terms.s3Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('terms.s4Title')}</h2>
            <p>{t('terms.s4Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('terms.s5Title')}</h2>
            <p>{t('terms.s5Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('terms.s6Title')}</h2>
            <p>{t('terms.s6Desc')}</p>
          </section>
        </div>
      </main>

      <footer className="border-t theme-border py-12 theme-surface">
        <div className="max-w-7xl mx-auto px-6 text-center theme-text-secondary text-sm">
          <p>© {new Date().getFullYear()} MindMark. {t('terms.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
