import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Server, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

export function SecurityPolicy() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4 sm:px-6">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary pt-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="hover:text-indigo-600 transition-colors">
          {isAuthenticated ? t('security.backDashboard') : t('security.backHome')}
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="theme-text-primary">{t('security.title')}</span>
      </div>

      <PageHeader 
        title={t('security.title')} 
        description={t('security.desc')}
      />

      <div className="space-y-8">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t('security.localTitle')}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t('security.localDesc')}
          </p>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t('security.cloudTitle')}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t('security.cloudDesc')}
          </p>
          <ul className="list-disc list-inside space-y-2 theme-text-secondary ml-4">
            {(t('security.cloudPoints') as unknown as string[]).map((point: string, i: number) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t('security.privacyTitle')}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t('security.privacyDesc')}
          </p>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t('security.paymentTitle')}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t('security.paymentDesc')}
          </p>
        </Card>
      </div>
    </div>
  );
}
