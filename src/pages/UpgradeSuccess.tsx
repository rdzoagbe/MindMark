import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { motion } from 'motion/react';
import { PlanType } from '../types';

export function UpgradeSuccess() {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState<string>('');
  const { upgrade } = usePlan();

  useEffect(() => {
    const lastPlan = localStorage.getItem('last_selected_plan') as PlanType | null;
    if (lastPlan) {
      setPlanName(lastPlan.charAt(0).toUpperCase() + lastPlan.slice(1));
      
      // Simulate successful webhook by upgrading locally for now
      upgrade(lastPlan);
    }
    
    // TODO: Future webhook validation
    // In a full-stack app, we would verify the checkout session ID with our backend here
    // e.g. await verifyStripeSession(sessionId);
  }, [upgrade]);

  return (
    <div className="max-w-2xl mx-auto py-12 sm:py-24 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-premium p-10 sm:p-16 text-center space-y-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            🎉 Payment successful!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
            Thank you for upgrading to the <span className="font-bold text-indigo-600 dark:text-indigo-400">{planName || 'Premium'}</span> plan. Your new features are now unlocked.
          </p>
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 max-w-md mx-auto">
            <p className="text-sm text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {planName ? `${planName} Features Activated` : 'Pro Features Activated'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 text-left max-w-md mx-auto">
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-lg">Premium Features Unlocked</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                You can now use pinned sessions, custom templates, and advanced filters to supercharge your productivity.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-display font-extrabold text-lg hover:bg-indigo-700 transition-all shadow-indigo active:scale-95"
          >
            Return to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
