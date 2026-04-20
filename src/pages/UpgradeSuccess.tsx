import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'motion/react';
import { PlanType } from '../types';

const TRANSLATIONS: Record<string, any> = {
  English: {
    success: '🎉 Payment successful!',
    thanks: 'Thank you for upgrading to the',
    finalizing: 'Finalizing your upgrade...',
    waitMsg: 'It may take a few minutes for your features to activate based on Stripe processing.',
    activated: 'Upgrade Activated! Redirecting...',
    featuresTitle: 'MindMark Pro Features Unlocked',
    featuresDesc: "Once processed, you'll have access to pinned sessions, custom templates, and advanced filters to supercharge your productivity.",
    awaiting: 'Awaiting Activation...',
    return: 'Return to Dashboard'
  },
  French: {
    success: '🎉 Paiement réussi !',
    thanks: 'Merci d\'avoir souscrit au forfait',
    finalizing: 'Finalisation de votre mise à niveau...',
    waitMsg: 'L\'activation de vos fonctionnalités peut prendre quelques minutes selon le traitement de Stripe.',
    activated: 'Mise à niveau activée ! Redirection...',
    featuresTitle: 'Fonctionnalités MindMark Pro débloquées',
    featuresDesc: "Une fois traité, vous aurez accès aux sessions épinglées, aux modèles personnalisés et aux filtres avancés pour booster votre productivité.",
    awaiting: 'En attente d\'activation...',
    return: 'Retour au tableau de bord'
  },
  Spanish: {
    success: '🎉 ¡Pago exitoso!',
    thanks: 'Gracias por actualizar al plan',
    finalizing: 'Finalizando tu actualización...',
    waitMsg: 'Las características pueden tardar unos minutos en activarse según el procesamiento de Stripe.',
    activated: '¡Actualización activada! Redirigiendo...',
    featuresTitle: 'Características de MindMark Pro desbloqueadas',
    featuresDesc: "Una vez procesado, tendrás acceso a sesiones ancladas, plantillas personalizadas y filtros avanzados para potenciar tu productividad.",
    awaiting: 'Esperando Activación...',
    return: 'Volver al Panel'
  },
  Portuguese: {
    success: '🎉 Pagamento bem-sucedido!',
    thanks: 'Obrigado por atualizar para o plano',
    finalizing: 'Finalizando sua atualização...',
    waitMsg: 'Pode levar alguns minutos para suas funcionalidades ativarem com base no processamento do Stripe.',
    activated: 'Atualização ativada! Redirecionando...',
    featuresTitle: 'Recursos do MindMark Pro Desbloqueados',
    featuresDesc: "Após o processamento, você terá acesso a sessões fixadas, modelos personalizados e filtros avançados para aumentar sua produtividade.",
    awaiting: 'Aguardando Ativação...',
    return: 'Voltar ao Painel'
  },
  Chinese: {
    success: '🎉 支付成功！',
    thanks: '感谢您升级到',
    finalizing: '正在完成您的升级...',
    waitMsg: '根据 Stripe 的处理，您的功能可能需要几分钟才能激活。',
    activated: '升级已激活！正在重定向...',
    featuresTitle: 'MindMark Pro 功能已解锁',
    featuresDesc: "处理完成后，您将可以访问固定会话、自定义模板和高级过滤器，以提高您的工作效率。",
    awaiting: '等待激活中...',
    return: '返回仪表板'
  },
  German: {
    success: '🎉 Zahlung erfolgreich!',
    thanks: 'Vielen Dank für das Upgrade auf den Plan',
    finalizing: 'Upgrade wird abgeschlossen...',
    waitMsg: 'Es kann einige Minuten dauern, bis Ihre Funktionen aufgrund der Stripe-Verarbeitung aktiviert werden.',
    activated: 'Upgrade aktiviert! Weiterleitung...',
    featuresTitle: 'MindMark Pro Funktionen freigeschaltet',
    featuresDesc: "Nach der Verarbeitung haben Sie Zugriff auf angeheftete Sitzungen, benutzerdefinierte Vorlagen und erweiterte Filter, um Ihre Produktivität zu steigern.",
    awaiting: 'Warten auf Aktivierung...',
    return: 'Zurück zum Dashboard'
  }
};

export function UpgradeSuccess() {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState<string>('');
  const { currentPlan, isFree } = usePlan();
  const [isActivating, setIsActivating] = useState(true);
  const { preferredLanguage } = useLanguage();

  const t = TRANSLATIONS[preferredLanguage] || TRANSLATIONS['English'];

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
        alert(`Successfully activated ${currentPlan} plan!`);
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
            {t.success}
          </h1>
          <p className="theme-text-secondary text-lg font-medium leading-relaxed max-w-md mx-auto">
            {t.thanks} <span className="font-bold text-indigo-600 dark:text-indigo-400">{planName || 'Premium'}</span>.
          </p>
          
          {isActivating ? (
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 max-w-md mx-auto">
              <p className="text-sm text-indigo-700 dark:text-amber-600 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.finalizing}
              </p>
              <p className="mt-2 text-xs text-indigo-600/80 dark:text-amber-600/80 font-medium">{t.waitMsg}</p>
            </div>
          ) : (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 max-w-md mx-auto">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t.activated}
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
              <h3 className="font-display font-extrabold theme-text-primary text-lg">{t.featuresTitle}</h3>
              <p className="text-sm theme-text-secondary mt-2 leading-relaxed font-medium">
                {t.featuresDesc}
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
            {isActivating ? t.awaiting : t.return}
            {!isActivating && <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
