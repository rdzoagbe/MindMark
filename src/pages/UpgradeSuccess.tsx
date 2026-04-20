import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { useTranslation } from '../hooks/useTranslation';
import { motion } from 'motion/react';
import { PlanType } from '../types';

export function UpgradeSuccess() {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState<string>('');
  const { currentPlan, isFree } = usePlan();
  const [isActivating, setIsActivating] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const lastPlan = localStorage.getItem('last_selected_plan') as PlanType | null;
    if (lastPlan) {
      setPlanName(lastPlan.charAt(0).toUpperCase() + lastPlan.slice(1));
    }
  }, []);

  // Polling mechanism based on usePlan reactivity
  useEffect(() => {
    if (!isFree && currentPlan !== 'free') {
      // The webhook has processed the subscription
      setIsActivating(false);
      
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isFree, currentPlan, navigate]);

  return (
    <div className="max-w-2xl mx-auto py-12 sm:py-24 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="theme-surface rounded-[3rem] border theme-border shadow-premium p-10 sm:p-16 text-center space-y-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold theme-text-primary tracking-tight">
            {t('success.title')}
          </h1>
          <p className="theme-text-secondary text-lg font-medium leading-relaxed max-w-md mx-auto">
            {t('success.thanks')} <span className="font-bold text-indigo-600 dark:text-indigo-400">{planName || 'Premium'}</span>.
          </p>
          
          {isActivating ? (
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 max-w-md mx-auto">
              <p className="text-sm text-indigo-700 dark:text-amber-600 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('success.finalizing')}
              </p>
              <p className="mt-2 text-xs text-indigo-600/80 dark:text-amber-600/80 font-medium">{t('success.waitMsg')}</p>
            </div>
          ) : (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 max-w-md mx-auto">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t('success.activated')}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 text-left max-w-md mx-auto">
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border theme-border space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold theme-text-primary text-lg">{t('success.featuresTitle')}</h3>
              <p className="text-sm theme-text-secondary mt-2 leading-relaxed font-medium">
                {t('success.featuresDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Link
            to="/dashboard"
            className={`inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-[1.5rem] font-display font-extrabold text-lg transition-all active:scale-95 ${
              isActivating 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border theme-border' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo'
            }`}
          >
            {isActivating ? t('success.awaiting') : t('success.return')}
            {!isActivating && <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
