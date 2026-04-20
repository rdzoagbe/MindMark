import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlan } from '../hooks/usePlan';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Zap, Sparkles, Users, Crown, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';
import { handleCheckout } from '../lib/stripe';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'motion/react';

interface PricingTier {
  id: string;
  price: string;
  stripePriceId: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    price: '€0',
    stripePriceId: '',
  },
  {
    id: 'plus',
    price: '€5',
    stripePriceId: import.meta.env.VITE_STRIPE_PLUS_PRICE_ID || 'price_1Qx8EACvI8qE2Zc1Lz1xT0oN',
  },
  {
    id: 'pro',
    price: '€10',
    stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_1Qx8ELCvI8qE2Zc1bE1aJ6wB',
  },
  {
    id: 'premium',
    price: '€25',
    stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1Qx8EdCvI8qE2Zc1QJ71dM4q',
  },
];

const BUTTON_TRANSLATIONS: Record<string, any> = {
  English: { 
    active: 'Active Plan', start: 'Get Started Now', select: 'Select', processing: 'Processing...', signin: 'Create an account to subscribe.',
    title: 'Structured plans for', titleItalic: 'infinite flow.',
    subtitle: 'Choose the layer of continuity that matches your professional throughput.',
    badge: 'Pricing Tiers',
    securityTitle: 'Security-First Infrastructure', securityDesc: 'Payments are handled securely via Stripe. We never store your credit card information. All billing data is encrypted with bank-level security protocols.',
    billingStrategy: 'Billing Strategy',
    mostPopular: 'Most Popular',
    forever: 'forever',
    perMonth: '/mo',
    policy: 'Security Policy',
    support: 'Billing Support',
    home: 'Home',
    tiers: {
      free: {
        name: 'MindMark Standard',
        desc: 'Basic local operational recovery.',
        features: ['Local-only sessions', 'Quick Capture Palette', 'Basic search & filters', 'No cloud sync']
      },
      plus: {
        name: 'MindMark Plus',
        desc: 'Entry-level sync for mobility.',
        features: ['Everything in Basic', 'Cloud Sync (1 Device)', 'Basic Session History', 'Email Support']
      },
      pro: {
        name: 'MindMark Pro',
        desc: 'The standard for high-focus pros.',
        features: ['Everything in Plus', 'Unlimited Device Sync', 'AI Smart Resume', 'Advanced Productivity Analytics', 'Priority Session Restore']
      },
      premium: {
        name: 'MindMark Premium',
        desc: 'Unrestricted collaboration & scaling.',
        features: ['Everything in Pro', 'Collaboration Mode', 'Unlimited Team Shares', 'Custom Tag Systems', 'VIP Dedicated Support']
      }
    }
  },
  French: { 
    active: 'Forfait actuel', start: 'Commencer', select: 'Sélectionner', processing: 'Traitement...', signin: 'Créez un compte pour vous abonner.',
    title: 'Des plans structurés pour un', titleItalic: 'flux infini.',
    subtitle: 'Choisissez le niveau de continuité qui correspond à votre rythme professionnel.',
    badge: 'Tarifs',
    securityTitle: 'Infrastructure Sécurisée', securityDesc: 'Les paiements sont gérés en toute sécurité via Stripe. Nous ne stockons jamais vos informations de carte de crédit. Toutes les données de facturation sont cryptées avec des protocoles de sécurité de niveau bancaire.',
    billingStrategy: 'Stratégie de Facturation',
    mostPopular: 'Le Plus Populaire',
    forever: 'à vie',
    perMonth: '/mois',
    policy: 'Politique de Sécurité',
    support: 'Support de Facturation',
    home: 'Accueil',
    tiers: {
      free: {
        name: 'MindMark Standard',
        desc: 'Récupération opérationnelle locale de base.',
        features: ['Sessions locales uniquement', 'Palette de capture rapide', 'Recherche et filtres de base', 'Pas de synchronisation cloud']
      },
      plus: {
        name: 'MindMark Plus',
        desc: 'Synchronisation d\'entrée de gamme pour la mobilité.',
        features: ['Tout ce qui est dans Basic', 'Synchronisation Cloud (1 appareil)', 'Historique des sessions de base', 'Support par e-mail']
      },
      pro: {
        name: 'MindMark Pro',
        desc: 'Le standard pour les pros à haute concentration.',
        features: ['Tout ce qui est dans Plus', 'Synchronisation illimitée d\'appareils', 'Reprise intelligente par IA', 'Analyses de productivité avancées', 'Restauration de session prioritaire']
      },
      premium: {
        name: 'MindMark Premium',
        desc: 'Collaboration et mise à l\'échelle sans restriction.',
        features: ['Tout ce qui est dans Pro', 'Mode Collaboration', 'Partages d\'équipe illimités', 'Systèmes de tags personnalisés', 'Support VIP dédié']
      }
    }
  },
  Spanish: { 
    active: 'Plan Activo', start: 'Empezar ahora', select: 'Seleccionar', processing: 'Procesando...', signin: 'Crea una cuenta para suscribirte.',
    title: 'Planes estructurados para un', titleItalic: 'flujo infinito.',
    subtitle: 'Elige el nivel de continuidad que coincida con tu rendimiento profesional.',
    badge: 'Niveles de Precio',
    securityTitle: 'Infraestructura de Seguridad', securityDesc: 'Los pagos se manejan de forma segura a través de Stripe. Nunca almacenamos la información de su tarjeta de crédito. Todos los datos de facturación están encriptados.',
    billingStrategy: 'Estrategia de Facturación',
    mostPopular: 'Más Popular',
    forever: 'para siempre',
    perMonth: '/mes',
    policy: 'Política de Seguridad',
    support: 'Soporte de Facturación',
    home: 'Inicio',
    tiers: {
      free: {
        name: 'MindMark Standard',
        desc: 'Recuperación operativa local básica.',
        features: ['Sesiones solo locales', 'Paleta de captura rápida', 'Búsqueda y filtros básicos', 'Sin sincronización en la nube']
      },
      plus: {
        name: 'MindMark Plus',
        desc: 'Sincronización de nivel de entrada para movilidad.',
        features: ['Todo en Básico', 'Sincronización en la nube (1 dispositivo)', 'Historial de sesiones básico', 'Soporte por correo electrónico']
      },
      pro: {
        name: 'MindMark Pro',
        desc: 'El estándar para profesionales de alta concentración.',
        features: ['Todo en Plus', 'Sincronización ilimitada de dispositivos', 'Reanudación inteligente con IA', 'Analítica de productividad avanzada', 'Restauración de sesión prioritaria']
      },
      premium: {
        name: 'MindMark Premium',
        desc: 'Colaboración y escalado sin restricciones.',
        features: ['Todo en Pro', 'Modo de colaboración', 'Uso compartido de equipo ilimitado', 'Sistemas de etiquetas personalizados', 'Soporte VIP dedicado']
      }
    }
  },
  Portuguese: { 
    active: 'Plano Ativo', start: 'Comece Agora', select: 'Selecionar', processing: 'Processando...', signin: 'Crie uma conta para assinar.',
    title: 'Planos estruturados para', titleItalic: 'fluxo infinito.',
    subtitle: 'Escolha a camada de continuidade que corresponde ao seu rendimento profissional.',
    badge: 'Preços',
    securityTitle: 'Segurança em Primeiro Lugar', securityDesc: 'Os pagamentos são processados de forma segura pelo Stripe. Nunca guardamos as informações do seu cartão. Todos os dados são encriptados.',
    billingStrategy: 'Estratégia de Faturamento',
    mostPopular: 'Mais Popular',
    forever: 'para sempre',
    perMonth: '/mês',
    policy: 'Política de Segurança',
    support: 'Suporte de Faturamento',
    home: 'Início',
    tiers: {
      free: {
        name: 'MindMark Standard',
        desc: 'Recuperação operacional local básica.',
        features: ['Sessões apenas locais', 'Paleta de captura rápida', 'Busca e filtros básicos', 'Sem sincronização na nuvem']
      },
      plus: {
        name: 'MindMark Plus',
        desc: 'Sincronização básica para mobilidade.',
        features: ['Tudo no Básico', 'Sincronização na nuvem (1 dispositivo)', 'Histórico básico de sessões', 'Suporte por e-mail']
      },
      pro: {
        name: 'MindMark Pro',
        desc: 'O padrão para profissionais de alta concentração.',
        features: ['Tudo no Plus', 'Sincronização ilimitada de dispositivos', 'Retomada inteligente por IA', 'Análise de produtividade avançada', 'Restauração de sessão prioritária']
      },
      premium: {
        name: 'MindMark Premium',
        desc: 'Colaboração e escala sem restrições.',
        features: ['Tudo no Pro', 'Modo colaboração', 'Compartilhamento de equipe ilimitado', 'Sistemas de tags personalizados', 'Suporte VIP dedicado']
      }
    }
  },
  Chinese: { 
    active: '当前计划', start: '立即开始', select: '选择', processing: '处理中...', signin: '创建一个帐户以订阅。',
    title: '为无限流畅构建的', titleItalic: '结构化计划。',
    subtitle: '选择符合您专业吞吐量的连续性层。',
    badge: '定价层级',
    securityTitle: '安全优先的架构', securityDesc: '通过 Stripe 安全处理支付。我们从不存储您的信用卡信息。所有计费数据均使用银行级安全协议加密。',
    billingStrategy: '计费策略',
    mostPopular: '最受欢迎',
    forever: '永久',
    perMonth: '/月',
    policy: '安全政策',
    support: '计费支持',
    home: '首页',
    tiers: {
      free: {
        name: 'MindMark 标准版',
        desc: '基本本地操作恢复。',
        features: ['仅限本地会话', '快速捕捉面板', '基础搜索与过滤', '无云端同步']
      },
      plus: {
        name: 'MindMark Plus',
        desc: '入门级移动同步。',
        features: ['包含基础版所有功能', '云同步（1 台设备）', '基础会话历史', '邮件支持']
      },
      pro: {
        name: 'MindMark Pro',
        desc: '高专注专业人士的标准选择。',
        features: ['包含 Plus 版所有功能', '无限设备同步', 'AI 智能恢复', '高级生产力分析', '优先会话恢复']
      },
      premium: {
        name: 'MindMark Premium',
        desc: '无限制的协作与扩展。',
        features: ['包含 Pro 版所有功能', '协作模式', '无限团队共享', '自定义标签系统', 'VIP 专属支持']
      }
    }
  },
  German: { 
    active: 'Aktiver Plan', start: 'Jetzt beginnen', select: 'Auswählen', processing: 'Wird bearbeitet...', signin: 'Erstellen Sie ein Konto, um sich anzumelden.',
    title: 'Strukturierte Pläne für', titleItalic: 'unendlichen Flow.',
    subtitle: 'Wählen Sie die Kontinuitätsebene, die Ihrem professionellen Durchsatz entspricht.',
    badge: 'Preisstufen',
    securityTitle: 'Sicherheitsinfrastruktur', securityDesc: 'Zahlungen werden sicher über Stripe abgewickelt. Wir speichern niemals Ihre Kreditkarteninformationen. Alle Abrechnungsdaten sind verschlüsselt.',
    billingStrategy: 'Abrechnungsstrategie',
    mostPopular: 'Beliebteste',
    forever: 'dauerhaft',
    perMonth: '/Mo',
    policy: 'Sicherheitsrichtlinie',
    support: 'Abrechnungs-Support',
    home: 'Startseite',
    tiers: {
      free: {
        name: 'MindMark Standard',
        desc: 'Grundlegende lokale operative Wiederherstellung.',
        features: ['Nur lokale Sitzungen', 'Quick Capture Palette', 'Grundlegende Suche & Filter', 'Kein Cloud-Sync']
      },
      plus: {
        name: 'MindMark Plus',
        desc: 'Einstiegs-Synchronisierung für Mobilität.',
        features: ['Alles in Basic', 'Cloud-Sync (1 Gerät)', 'Grundlegende Sitzungshistorie', 'E-Mail-Support']
      },
      pro: {
        name: 'MindMark Pro',
        desc: 'Der Standard für hochkonzentrierte Profis.',
        features: ['Alles in Plus', 'Unbegrenzte Geräte-Synchronisierung', 'KI-Smart-Resume', 'Erweiterte Produktivitätsanalysen', 'Priorisierte Sitzungswiederherstellung']
      },
      premium: {
        name: 'MindMark Premium',
        desc: 'Uneingeschränkte Zusammenarbeit & Skalierung.',
        features: ['Alles in Pro', 'Kollaborationsmodus', 'Unbegrenzte Team-Freigaben', 'Benutzerdefinierte Tag-Systeme', 'VIP-Support']
      }
    }
  },
};

export function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const { currentPlan } = usePlan();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { preferredLanguage } = useLanguage();

  const t = BUTTON_TRANSLATIONS[preferredLanguage] || BUTTON_TRANSLATIONS['English'];

  const handleSubscription = async (tier: PricingTier) => {
    if (tier.id === 'free') {
      navigate('/dashboard');
      return;
    }

    if (!isAuthenticated) {
      navigate('/signup', { state: { redirect: '/pricing', message: t.signin } });
      return;
    }

    setLoadingId(tier.id);
    try {
      await handleCheckout(tier.stripePriceId, user!.uid);
    } catch (err) {
      // Error handled in handleCheckout alert
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/" className="hover:text-indigo-600 transition-colors">{t.home}</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="theme-text-primary uppercase tracking-widest text-[10px] font-bold">{t.billingStrategy}</span>
      </div>

      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="indigo" size="md">{t.badge}</Badge>
        <h1 className="text-4xl sm:text-6xl font-black theme-text-primary tracking-tighter leading-[0.9]">
          {t.title} <span className="text-indigo-600 dark:text-indigo-400 italic">{t.titleItalic}</span>
        </h1>
        <p className="text-lg theme-text-secondary leading-relaxed font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* 4-Column Grid with Decoy Pricing Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {pricingTiers.map((tier) => {
          const isPro = tier.id === 'pro';
          const isDecoy = tier.id === 'plus' || tier.id === 'premium';
          const tierInfo = t.tiers[tier.id];

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -5 }}
              className={`relative flex flex-col h-full rounded-[2.5rem] p-8 border transition-all duration-500 shadow-sm ${
                isPro 
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 border-4 scale-[1.05] z-10 shadow-2xl shadow-indigo-500/20' 
                  : isDecoy
                    ? 'theme-surface theme-border opacity-80 scale-[0.95]'
                    : 'theme-surface theme-border'
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.mostPopular}
                </div>
              )}

              <div className="mb-8 overflow-hidden">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${isPro ? 'text-indigo-600 dark:text-indigo-400' : 'theme-text-secondary'}`}>
                  {tierInfo.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black tracking-tighter ${isPro ? 'theme-text-primary' : 'theme-text-primary'}`}>{tier.price}</span>
                  <span className="text-xs theme-text-secondary font-bold uppercase tracking-widest">{tier.id === 'free' ? t.forever : t.perMonth}</span>
                </div>
                <p className="mt-4 text-sm theme-text-secondary font-medium leading-relaxed">{tierInfo.desc}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {tierInfo.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${isPro ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className={`text-sm font-medium ${isPro ? 'theme-text-primary cursor-default' : 'theme-text-secondary'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                fullWidth
                size="lg"
                variant={isPro ? 'primary' : 'outline'}
                className={`h-14 rounded-2xl font-bold uppercase tracking-widest text-xs ${isPro ? 'shadow-lg shadow-indigo-600/30' : ''}`}
                onClick={() => handleSubscription(tier)}
                loading={loadingId === tier.id}
                disabled={currentPlan === tier.id}
              >
                {loadingId === tier.id 
                  ? t.processing 
                  : currentPlan === tier.id 
                    ? t.active 
                    : isPro ? t.start : `${t.select} ${tierInfo.name}`}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Security Proof */}
      <Card variant="ghost" className="p-12 text-center space-y-8 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-2 ring-1 ring-indigo-500/10">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black theme-text-primary tracking-tight">{t.securityTitle}</h2>
          <p className="theme-text-secondary text-lg max-w-3xl mx-auto leading-relaxed font-medium">
            {t.securityDesc}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/security">
            <Button variant="outline" size="lg" className="px-8 rounded-xl font-bold tracking-widest text-[10px] uppercase">{t.policy}</Button>
          </Link>
          <a href="mailto:billing@mindmark.app">
            <Button variant="ghost" size="lg" className="px-8 font-bold tracking-widest text-[10px] uppercase">{t.support}</Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
