import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

export function Privacy() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen theme-bg theme-text-primary">
      <nav className="border-b theme-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 theme-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{isAuthenticated ? t('privacy.backDashboard') : t('privacy.backHome')}</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            {t('privacy.badge')}
          </div>
          <h1 className="text-4xl font-bold tracking-tight theme-text-primary">{t('privacy.title')}</h1>
          <p className="theme-text-secondary">{t('privacy.date')}</p>
        </section>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 theme-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('privacy.s1Title')}</h2>
            <p>{t('privacy.s1Desc')}</p>
            <p>{t('privacy.s1Pro')}</p>
            <ul className="list-disc pl-6 space-y-2">
              {(t('privacy.s1List') as unknown as string[]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('privacy.s2Title')}</h2>
            <p>{t('privacy.s2Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('privacy.s3Title')}</h2>
            <p>{t('privacy.s3Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('privacy.s4Title')}</h2>
            <p>{t('privacy.s4Desc')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">{t('privacy.s5Title')}</h2>
            <p>{t('privacy.s5Desc')}</p>
          </section>
        </div>
      </main>

      <footer className="border-t theme-border py-12 theme-surface">
        <div className="max-w-7xl mx-auto px-6 text-center theme-text-secondary text-sm">
          <p>© {new Date().getFullYear()} MindMark. {t('privacy.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
