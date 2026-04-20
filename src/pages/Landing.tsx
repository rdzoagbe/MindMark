import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Save,
  Shield,
  Sparkles,
  UserPlus,
  X,
  BookMarked,
  Layers3,
  Clock,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analytics } from '../services/analytics';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GlobalLanguageSelector } from '../components/GlobalLanguageSelector';
import { useLanguage } from '../hooks/useLanguage';

const HERO_TRANSLATIONS: Record<string, any> = {
  English: {
    badge: 'Resume work instantly',
    title: 'Keep your edge through', titleHighlight: 'context preservation.',
    desc: 'Bookmark your mind\'s exact state. The ultimate context-preservation tool that helps you capture exactly where you are and what to do next.',
    ctaPrimary: 'Start for Free', ctaSecondary: 'Learn More', ctaDash: 'Go to Dashboard',
    feature1: 'Local-first', feature2: 'Professional grade', feature3: 'Zero friction',
    signin: 'Sign in', getStarted: 'Get Started', dashboard: 'Dashboard',
    mechanics: {
      title1: '1. Capture', desc1: 'Record your current task, next step, and "why" you stopped. It takes less than 15 seconds but saves 20 minutes of re-orientation.',
      title2: '2. Resume', desc2: 'Return to a clean dashboard of "Active Contexts." One click shows you exactly where you were, eliminating the "mental fog."',
      title3: '3. Scale', desc3: 'Manage multiple projects simultaneously without context-switching costs. Every project has a clear entry point.'
    },
    designedTitle: 'Designed for operational continuity.',
    designedFeatures: [
      "Next Action focus reduces cognitive load instantly.",
      "Privacy-first: Data stays on your device by default.",
      "Structured logic skip retrieval-failure issues.",
      "Built for developers, builders, and deep-thinkers."
    ],
    pricingBadge: 'Pricing Strategy', pricingTitle: 'One target: Your focus.',
    pricingDesc: 'Invest in your mental flow. Choose a plan that fuels your operational continuity.',
    compareAll: 'Compare all features',
    modalTitle: 'Welcome back', modalDesc: 'Choose how you want to preserve your state.',
    mode1Title: 'Instant Mode', mode1Desc: 'No setup. Local storage only.',
    mode2Title: 'Upgrade to Pro', mode2Desc: 'Sync, backup & productivity tools.',
    mode3Title: 'Create Account', mode3Desc: 'Best for multi-device workflows.',
    modalSignin: 'Sign in existing user',
    footerDesc: "Bookmark your mind's exact state."
  },
  French: {
    badge: 'Reprenez le travail instantanément',
    title: 'Gardez votre avantage grâce à la', titleHighlight: 'préservation du contexte.',
    desc: 'Ajoutez l\'état exact de votre esprit à vos favoris. L\'outil de préservation du contexte qui vous aide à capturer exactement où vous en êtes.',
    ctaPrimary: 'Démarrer gratuitement', ctaSecondary: 'En savoir plus', ctaDash: 'Aller au tableau de bord',
    feature1: 'Local d\'abord', feature2: 'Qualité pro', feature3: 'Zéro friction',
    signin: 'Connexion', getStarted: 'Commencer', dashboard: 'Tableau de bord',
    mechanics: {
      title1: '1. Capturer', desc1: 'Enregistrez votre tâche, l\'étape suivante et le "pourquoi". Cela prend moins de 15 secondes mais fait gagner 20 minutes.',
      title2: '2. Reprendre', desc2: 'Revenez à un tableau de bord propre. Un clic vous montre exactement où vous en étiez.',
      title3: '3. Évoluer', desc3: 'Gérez plusieurs projets simultanément sans frais de changement de contexte.'
    },
    designedTitle: 'Conçu pour la continuité opérationnelle.',
    designedFeatures: [
      "La focalisation sur l'action suivante réduit la charge cognitive.",
      "Confidentialité : Les données restent sur votre appareil.",
      "Logique structurée pour éviter les échecs de récupération.",
      "Construit pour les développeurs et les penseurs profonds."
    ],
    pricingBadge: 'Stratégie tarifaire', pricingTitle: 'Un seul objectif : Votre concentration.',
    pricingDesc: 'Investissez dans votre flux mental. Choisissez un forfait qui alimente votre continuité.',
    compareAll: 'Comparer toutes les fonctionnalités',
    modalTitle: 'Bon retour', modalDesc: 'Choisissez comment vous voulez préserver votre état.',
    mode1Title: 'Mode Instantané', mode1Desc: 'Pas de configuration. Stockage local uniquement.',
    mode2Title: 'Passer à Pro', mode2Desc: 'Sync, sauvegarde et outils de productivité.',
    mode3Title: 'Créer un compte', mode3Desc: 'Idéal pour le travail multi-appareils.',
    modalSignin: 'Utilisateur existant ? Se connecter',
    footerDesc: "Marquez l'état exact de votre esprit."
  },
  Spanish: {
    badge: 'Reanuda el trabajo al instante',
    title: 'Mantén tu ventaja mediante la', titleHighlight: 'preservación del contexto.',
    desc: 'Guarda el estado exacto de tu mente. La herramienta definitiva de preservación del contexto.',
    ctaPrimary: 'Empezar gratis', ctaSecondary: 'Saber más', ctaDash: 'Ir al Panel',
    feature1: 'Local primero', feature2: 'Grado profesional', feature3: 'Cero fricción',
    signin: 'Iniciar sesión', getStarted: 'Empezar', dashboard: 'Panel',
    mechanics: {
      title1: '1. Capturar', desc1: 'Registra tu tarea actual, el siguiente paso y el porqué. Ahorra 20 minutos de reorientación.',
      title2: '2. Reanudar', desc2: 'Regresa a un panel limpio. Un clic te muestra exactamente dónde estabas.',
      title3: '3. Escalar', desc3: 'Gestiona múltiples proyectos sin costes de cambio de contexto.'
    },
    designedTitle: 'Diseñado para la continuidad operativa.',
    designedFeatures: [
      "El enfoque en la siguiente acción reduce la carga cognitiva.",
      "Privacidad: Los datos permanecen en tu dispositivo.",
      "Lógica estructurada para evitar fallos de recuperación.",
      "Creado para desarrolladores y pensadores profundos."
    ],
    pricingBadge: 'Estrategia de Precios', pricingTitle: 'Un objetivo: Tu enfoque.',
    pricingDesc: 'Invierte en tu flujo mental. Elige un plan que impulse tu continuidad.',
    compareAll: 'Comparar todas las funciones',
    modalTitle: 'Bienvenido de nuevo', modalDesc: 'Elige cómo quieres preservar tu estado.',
    mode1Title: 'Modo Instantáneo', mode1Desc: 'Sin configuración. Solo almacenamiento local.',
    mode2Title: 'Mejorar a Pro', mode2Desc: 'Sincronización, copia de seguridad y herramientas.',
    mode3Title: 'Crear Cuenta', mode3Desc: 'Lo mejor para flujos multi-dispositivo.',
    modalSignin: '¿Ya tienes cuenta? Inicia sesión',
    footerDesc: "Guarda el estado exacto de tu mente."
  },
  Portuguese: {
    badge: 'Retome o trabalho instantaneamente',
    title: 'Mantenha sua vantagem através da', titleHighlight: 'preservação do contexto.',
    desc: 'Marque o estado exato da sua mente. A ferramenta definitiva para preservar seu fluxo.',
    ctaPrimary: 'Comece grátis', ctaSecondary: 'Saiba mais', ctaDash: 'Ir para o Dashboard',
    feature1: 'Local-first', feature2: 'Qualidade profissional', feature3: 'Atrito zero',
    signin: 'Entrar', getStarted: 'Começar', dashboard: 'Painel',
    mechanics: {
      title1: '1. Capturar', desc1: 'Registre sua tarefa, próximo passo e o porquê. Economize 20 minutos de reorientação.',
      title2: '2. Retomar', desc2: 'Volte para um painel limpo. Um clique mostra exatamente onde você parou.',
      title3: '3. Escalar', desc3: 'Gerencie vários projetos sem custos de troca de contexto.'
    },
    designedTitle: 'Projetado para continuidade operacional.',
    designedFeatures: [
      "Foco na próxima ação reduz a carga cognitiva instantaneamente.",
      "Privacidade primeiro: Dados ficam no seu dispositivo por padrão.",
      "Lógica estruturada evita falhas de recuperação.",
      "Construído para desenvolvedores e pensadores profundos."
    ],
    pricingBadge: 'Estratégia de Preços', pricingTitle: 'Um alvo: Seu foco.',
    pricingDesc: 'Invista no seu fluxo mental. Escolha um plano que alimente sua continuidade.',
    compareAll: 'Comparar todos os recursos',
    modalTitle: 'Bem-vindo de volta', modalDesc: 'Escolha como deseja preservar seu estado.',
    mode1Title: 'Modo Instantâneo', mode1Desc: 'Sem configuração. Apenas armazenamento local.',
    mode2Title: 'Atualizar para Pro', mode2Desc: 'Sincronização, backup e ferramentas.',
    mode3Title: 'Criar Conta', mode3Desc: 'Ideal para fluxos multi-dispositivo.',
    modalSignin: 'Já tem conta? Entre aqui',
    footerDesc: "Marque o estado exato da sua mente."
  },
  Chinese: {
    badge: '立即恢复工作',
    title: '通过上下文保留来', titleHighlight: '保持您的优势。',
    desc: '记录您大脑的确切状态。终极上下文保留工具。',
    ctaPrimary: '免费开始', ctaSecondary: '了解更多', ctaDash: '转到仪表板',
    feature1: '本地优先', feature2: '专业级别', feature3: '零摩擦',
    signin: '登录', getStarted: '开始', dashboard: '仪表板',
    mechanics: {
      title1: '1. 捕捉', desc1: '记录当前任务、下一步及原因。只需不到 15 秒，即可节省 20 分钟的重新定向时间。',
      title2: '2. 恢复', desc2: '回到整洁的“活动上下文”仪表板。一键显示您之前的位置，消除“心理迷雾”。',
      title3: '3. 扩展', desc3: '同时管理多个项目，无需上下文切换成本。每个项目都有明确的切入点。'
    },
    designedTitle: '专为操作连续性设计。',
    designedFeatures: [
      "“下一步行动”聚焦可立即减轻认知负荷。",
      "隐私优先：数据默认保存在您的设备上。",
      "结构化逻辑可跳过检索失败问题。",
      "专为开发者、构建者和深度思考者打造。"
    ],
    pricingBadge: '定价策略', pricingTitle: '一个目标：您的专注。',
    pricingDesc: '投资于您的心理流。选择一个能为您持续运营提供动力的计划。',
    compareAll: '比较所有功能',
    modalTitle: '欢迎回来', modalDesc: '选择您想要保留状态的方式。',
    mode1Title: '即时模式', mode1Desc: '无需设置。仅限本地存储。',
    mode2Title: '升级到 Pro', mode2Desc: '同步、备份和生产力工具。',
    mode3Title: '创建帐户', mode3Desc: '最适合多设备工作流程。',
    modalSignin: '已有帐户？请登录',
    footerDesc: "准确记录您大脑的确切状态。"
  },
  German: {
    badge: 'Arbeit sofort fortsetzen',
    title: 'Behalten Sie Ihren Vorsprung durch', titleHighlight: 'Kontextbewahrung.',
    desc: 'Speichern Sie den genauen Zustand Ihres Geistes. Das ultimative Tool zur Kontextbewahrung.',
    ctaPrimary: 'Kostenlos starten', ctaSecondary: 'Mehr erfahren', ctaDash: 'Zum Dashboard',
    feature1: 'Lokal zuerst', feature2: 'Profi-Qualität', feature3: 'Null Reibung',
    signin: 'Anmelden', getStarted: 'Starten', dashboard: 'Dashboard',
    mechanics: {
      title1: '1. Erfassen', desc1: 'Notieren Sie Aufgabe, nächsten Schritt und das "Warum". Dauert 15 Sek., spart 20 Min. Orientierung.',
      title2: '2. Fortsetzen', desc2: 'Kehren Sie zum Dashboard zurück. Ein Klick zeigt Ihnen, wo Sie waren.',
      title3: '3. Skalieren', desc3: 'Verwalten Sie mehrere Projekte ohne Kontextwechsel-Kosten.'
    },
    designedTitle: 'Entwickelt für operative Kontinuität.',
    designedFeatures: [
      "Fokus auf die nächste Aktion reduziert sofort die kognitive Last.",
      "Datenschutz: Daten bleiben standardmäßig auf Ihrem Gerät.",
      "Strukturierte Logik verhindert Abruffehler.",
      "Gebaut für Entwickler, Konstrukteure und Querdenker."
    ],
    pricingBadge: 'Preisstrategie', pricingTitle: 'Ein Ziel: Ihr Fokus.',
    pricingDesc: 'Investieren Sie in Ihren mentalen Flow. Wählen Sie einen Plan, der Ihre Kontinuität fördert.',
    compareAll: 'Alle Funktionen vergleichen',
    modalTitle: 'Willkommen zurück', modalDesc: 'Wählen Sie, wie Sie Ihren Status bewahren möchten.',
    mode1Title: 'Sofort-Modus', mode1Desc: 'Kein Setup. Nur lokaler Speicher.',
    mode2Title: 'Upgrade auf Pro', mode2Desc: 'Sync, Backup & Produktivitäts-Tools.',
    mode3Title: 'Konto erstellen', mode3Desc: 'Ideal für geräteübergreifendes Arbeiten.',
    modalSignin: 'Bestehender Benutzer? Hier anmelden',
    footerDesc: "Speichern Sie den genauen Zustand Ihres Geistes."
  }
};

export function Landing() {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { preferredLanguage } = useLanguage();
  
  const t = HERO_TRANSLATIONS[preferredLanguage] || HERO_TRANSLATIONS['English'];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowGetStarted(true);
    }
  };

  const handleGuestMode = () => {
    analytics.track('guest_mode_started');
    navigate('/dashboard');
  };

  const handleSignup = (type: 'signup' | 'trial') => {
    analytics.track('landing_cta_clicked', { type });
    navigate('/signup');
  };

  return (
    <div className="min-h-screen theme-bg theme-text-primary selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Header */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b theme-border glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BookMarked className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">MindMark</span>
          </Link>

          <div className="flex items-center gap-4">
            <GlobalLanguageSelector />
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">{t.dashboard}</Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium theme-text-secondary hover:theme-text-primary transition-colors">{t.signin}</Link>
                <Button onClick={handleGetStarted} size="sm">{t.getStarted}</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl bg-indigo-500/5 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 theme-border theme-surface theme-text-secondary">
                <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                {t.badge}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight theme-text-primary sm:text-6xl mb-6 leading-[1.1]">
                {t.title} 
                <span className="text-indigo-600 dark:text-indigo-400"> {t.titleHighlight}</span>
              </h1>
              <p className="text-lg leading-relaxed theme-text-secondary mb-10 max-w-2xl mx-auto">
                {t.desc}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={handleGetStarted} size="lg" className="h-14 px-10 text-lg w-full sm:w-auto">
                  {isAuthenticated ? t.ctaDash : t.ctaPrimary}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-10 text-lg w-full sm:w-auto theme-surface"
                  onClick={() => document.getElementById('essential')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t.ctaSecondary}
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm theme-text-secondary">
                <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-500" /> {t.feature1}</div>
                <div className="flex items-center gap-1.5"><Layers3 className="h-4 w-4 text-indigo-500" /> {t.feature2}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-sky-500" /> {t.feature3}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Essential Info */}
        <section id="essential" className="py-20 border-t theme-border bg-slate-50/50 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                  <Save className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t.mechanics.title1}</h3>
                <p className="theme-text-secondary leading-relaxed">
                  {t.mechanics.desc1}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t.mechanics.title2}</h3>
                <p className="theme-text-secondary leading-relaxed">
                  {t.mechanics.desc2}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-500/20">
                  <Layers3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t.mechanics.title3}</h3>
                <p className="theme-text-secondary leading-relaxed">
                  {t.mechanics.desc3}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Visual Split */}
        <section className="py-20 border-t theme-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">{t.designedTitle}</h2>
                <div className="space-y-6">
                  {t.designedFeatures.map((text: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="theme-text-secondary font-medium">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Button onClick={handleGetStarted} className="gap-2">
                    {t.getStarted} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600/10 blur-[80px] rounded-full" />
                <div className="relative theme-surface border theme-border rounded-[2rem] p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b theme-border pb-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                          <BookMarked className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-sm">Active Session</span>
                      </div>
                      <Badge variant="indigo">In Flow</Badge>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-5 text-white">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Next Action</p>
                      <p className="text-lg font-bold">Verify the row counts match the staging snapshot.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Pricing */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/5 border-t theme-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <Badge variant="indigo" className="mb-4">{t.pricingBadge}</Badge>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter">{t.pricingTitle}</h2>
            <p className="theme-text-secondary max-w-2xl mx-auto mb-16 font-medium">
              {t.pricingDesc}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-6xl mx-auto">
              {/* Free */}
              <div className="flex flex-col h-full theme-surface border theme-border rounded-[2.5rem] p-8 items-start text-left hover:shadow-xl transition-all group">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary mb-4">Standard</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€0</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">forever</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 leading-relaxed font-medium">Local-only recovery and context preservation.</p>
                <Button variant="outline" fullWidth onClick={handleGetStarted} className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Start Free</Button>
              </div>

              {/* Plus */}
              <div className="flex flex-col h-full theme-surface border theme-border rounded-[2.5rem] p-8 items-start text-left opacity-80 scale-[0.95]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary mb-4">MindMark Plus</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€5</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 leading-relaxed font-medium">Basic sync for mobility.</p>
                <Button variant="outline" fullWidth onClick={() => navigate('/pricing')} className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Select Plus</Button>
              </div>

              {/* Pro - Recommended */}
              <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-[3px] border-indigo-600 rounded-[2.5rem] p-8 items-start text-left relative shadow-2xl shadow-indigo-500/20 scale-[1.05] z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">Recommended</div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-4">MindMark Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€10</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 font-semibold leading-relaxed">Frictionless continuity with AI Smart Resume.</p>
                <Button variant="primary" fullWidth onClick={() => navigate('/signup')} className="mt-8 rounded-xl shadow-lg shadow-indigo-600/30 font-bold uppercase tracking-widest text-[10px]">{t.getStarted}</Button>
              </div>

              {/* Premium */}
              <div className="flex flex-col h-full theme-surface border theme-border rounded-[2.5rem] p-8 items-start text-left opacity-80 scale-[0.95]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary mb-4">MindMark Premium</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€25</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 leading-relaxed font-medium">Unrestricted collaboration.</p>
                <Button variant="outline" fullWidth onClick={() => navigate('/pricing')} className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Select Premium</Button>
              </div>
            </div>
            
            <Link to="/pricing" className="inline-flex items-center gap-1 mt-16 text-sm font-bold theme-text-secondary hover:theme-text-primary transition-all hover:gap-2 uppercase tracking-widest text-[10px]">
              {t.compareAll} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showGetStarted && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowGetStarted(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.96 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 12, scale: 0.96 }} 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-lg rounded-[2.5rem] border theme-border theme-surface p-10 shadow-2xl overflow-hidden relative"
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{t.modalTitle}</h3>
                <p className="theme-text-secondary mt-2">{t.modalDesc}</p>
              </div>
              
              <div className="grid gap-4">
                <button 
                  onClick={handleGuestMode} 
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border theme-border hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.mode1Title}</h4>
                    <p className="text-xs theme-text-secondary">{t.mode1Desc}</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleSignup('signup')} 
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 hover:shadow-lg transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.mode2Title}</h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">{t.mode2Desc}</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleSignup('signup')} 
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border theme-border hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.mode3Title}</h4>
                    <p className="text-xs theme-text-secondary">{t.mode3Desc}</p>
                  </div>
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <Link to="/login" className="text-sm font-medium theme-text-secondary hover:theme-text-primary underline">{t.modalSignin}</Link>
              </div>

              <button 
                onClick={() => setShowGetStarted(false)} 
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t theme-border theme-text-secondary">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center text-white">
              <BookMarked className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm tracking-tight theme-text-primary">MindMark</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
            <Link to="/security" className="hover:theme-text-primary transition-colors">Security</Link>
            <Link to="/privacy" className="hover:theme-text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:theme-text-primary transition-colors">Terms</Link>
            <a href="mailto:support@mindmark.app" className="hover:theme-text-primary transition-colors">Support</a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} MindMark. {t.footerDesc}</p>
        </div>
      </footer>
    </div>
  );
}
