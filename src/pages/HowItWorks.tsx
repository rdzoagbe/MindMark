import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock3, 
  PlayCircle, 
  Save, 
  Layers3,
  Zap,
  Target,
  Workflow,
  BookMarked
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../hooks/useLanguage';

const HOW_TRANSLATIONS: Record<string, any> = {
  English: {
    back: 'Back to Home', signIn: 'Sign in', getStarted: 'Get Started',
    badge: 'The Methodology', title: 'How MindMark', titleHighlight: 'Works',
    subtitle: 'A structured approach to managing operational continuity in high-interruption environments.',
    step: 'Step', fast: 'Takes less than 30 seconds', mental: 'Reduces mental load',
    ctaTitle: 'Ready to stop the re-orientation drain?',
    ctaSub: 'Join thousands of developers and operators who have reclaimed their focus time.',
    ctaFree: 'Start for Free', ctaPricing: 'View Pricing',
    footerMission: 'Bookmark your mind\'s exact state. Operational continuity for high-context work.',
    steps: [
      { title: "Capture", desc: "When you're about to be interrupted or need to switch tasks, quickly record your current state. What are you doing? Why are you stopping? What's the very next thing you need to do?", color: "bg-blue-500", icon: Save },
      { title: "Pause", desc: "Your context is safely stored. You can now walk away, join that meeting, or handle that urgent request without the mental burden of trying to remember where you left off.", color: "bg-indigo-500", icon: Clock3 },
      { title: "Resume", desc: "When you return, open your session. You'll see your 'Next Action' front and center, along with all your notes and links. No more 'What was I doing?' moments.", color: "bg-emerald-500", icon: PlayCircle },
      { title: "Continuity", desc: "Maintain multiple workstreams effortlessly. MindMark acts as an external memory for your operational state, allowing for seamless transitions across days or devices.", color: "bg-violet-500", icon: Layers3 }
    ]
  },
  French: {
    back: 'Retour à l\'accueil', signIn: 'Se connecter', getStarted: 'Commencer',
    badge: 'La Méthodologie', title: 'Comment MindMark', titleHighlight: 'Fonctionne',
    subtitle: 'Une approche structurée pour gérer la continuité opérationnelle dans les environnements à fortes interruptions.',
    step: 'Étape', fast: 'Prend moins de 30 secondes', mental: 'Réduit la charge mentale',
    ctaTitle: 'Prêt à arrêter la perte de temps de réorientation ?',
    ctaSub: 'Rejoignez des milliers de développeurs qui ont récupéré leur temps de concentration.',
    ctaFree: 'Commencer gratuitement', ctaPricing: 'Voir les prix',
    footerMission: 'Marquez l\'état exact de votre esprit. Continuité opérationnelle pour le travail complexe.',
    steps: [
      { title: "Capture", desc: "Lorsque vous êtes sur le point d'être interrompu, enregistrez rapidement votre état. Qu'est-ce que vous faites ? Pourquoi vous arrêtez-vous ? Quelle est la prochaine étape ?", color: "bg-blue-500", icon: Save },
      { title: "Pause", desc: "Votre contexte est stocké en toute sécurité. Vous pouvez maintenant partir ou rejoindre cette réunion sans le fardeau mental de devoir vous souvenir où vous en étiez.", color: "bg-indigo-500", icon: Clock3 },
      { title: "Reprise", desc: "À votre retour, ouvrez votre session. Vous verrez votre 'Action suivante' au centre, ainsi que toutes vos notes et liens.", color: "bg-emerald-500", icon: PlayCircle },
      { title: "Continuité", desc: "Gérez plusieurs flux de travail sans effort. MindMark agit comme une mémoire externe pour votre état opérationnel.", color: "bg-violet-500", icon: Layers3 }
    ]
  },
  Spanish: {
    back: 'Volver al inicio', signIn: 'Iniciar sesión', getStarted: 'Empezar',
    badge: 'La Metodología', title: 'Cómo MindMark', titleHighlight: 'Funciona',
    subtitle: 'Un enfoque estructurado para gestionar la continuidad operativa en entornos de alta interrupción.',
    step: 'Paso', fast: 'Toma menos de 30 segundos', mental: 'Reduce la carga mental',
    ctaTitle: '¿Listo para detener el drenaje de reorientación?',
    ctaSub: 'Únete a miles de desarrolladores que han recuperado su tiempo de enfoque.',
    ctaFree: 'Empezar gratis', ctaPricing: 'Ver Precios',
    footerMission: 'Marca el estado exacto de tu mente. Continuidad operacional para trabajo complejo.',
    steps: [
      { title: "Captura", desc: "Cuando estés a punto de ser interrumpido, registra rápidamente tu estado actual. ¿Qué estás haciendo? ¿Por qué te detienes? ¿Cuál es el siguiente paso?", color: "bg-blue-500", icon: Save },
      { title: "Pausa", desc: "Tu contexto se guarda de forma segura. Ahora puedes irte sin la carga mental de intentar recordar dónde lo dejaste.", color: "bg-indigo-500", icon: Clock3 },
      { title: "Reanudación", desc: "Cuando regreses, abre tu sesión. Verás tu 'Siguiente Acción' al frente y al centro, junto con tus notas y enlaces.", color: "bg-emerald-500", icon: PlayCircle },
      { title: "Continuidad", desc: "Mantén múltiples flujos de trabajo sin esfuerzo. MindMark actúa como una memoria externa para tu estado operacional.", color: "bg-violet-500", icon: Layers3 }
    ]
  },
  Portuguese: {
    back: 'Voltar ao início', signIn: 'Entrar', getStarted: 'Começar',
    badge: 'A Metodologia', title: 'Como o MindMark', titleHighlight: 'Funciona',
    subtitle: 'Uma abordagem estruturada para gerenciar a continuidade operacional em ambientes de alta interrupção.',
    step: 'Passo', fast: 'Leva menos de 30 segundos', mental: 'Reduz a carga mental',
    ctaTitle: 'Pronto para parar de perder tempo se reorientando?',
    ctaSub: 'Junte-se a milhares de desenvolvedores que recuperaram seu tempo de foco.',
    ctaFree: 'Começar Grátis', ctaPricing: 'Ver Preços',
    footerMission: 'Marque o estado exato da sua mente. Continuidade operacional para trabalho complexo.',
    steps: [
      { title: "Captura", desc: "Quando estiver prestar a ser interrompido, registre rapidamente seu estado atual. O que você está fazendo? Por que está parando? Qual o próximo passo?", color: "bg-blue-500", icon: Save },
      { title: "Pausa", desc: "Seu contexto é armazenado com segurança. Você pode sair agora sem o fardo mental de tentar lembrar onde parou.", color: "bg-indigo-500", icon: Clock3 },
      { title: "Retomada", desc: "Ao voltar, abra sua sessão. Você verá sua 'Próxima Ação' em destaque, junto com todas as suas notas e links.", color: "bg-emerald-500", icon: PlayCircle },
      { title: "Continuidade", desc: "Mantenha vários fluxos de trabalho sem esforço. O MindMark age como uma memória externa para seu estado operacional.", color: "bg-violet-500", icon: Layers3 }
    ]
  },
  Chinese: {
    back: '返回主页', signIn: '登录', getStarted: '开始使用',
    badge: '方法论', title: 'MindMark 如何', titleHighlight: '运作',
    subtitle: '一种在频繁干扰环境中管理操作连续性的结构化方法。',
    step: '步骤', fast: '只需不到 30 秒', mental: '减轻心理负担',
    ctaTitle: '准备好停止重新适应带来的精力流失了吗？',
    ctaSub: '加入成千上万名已经找回专注时间的开发人员和运营商的行列。',
    ctaFree: '免费开始', ctaPricing: '查看定价',
    footerMission: '为您的思维确切状态添加书签。高上下文工作的操作连续性。',
    steps: [
      { title: "捕获", desc: "当您即将受到干扰或需要切换任务时，请快速记录当前状态。您在做什么？为什么要停止？您下一步需要做的第一件事是什么？", color: "bg-blue-500", icon: Save },
      { title: "暂停", desc: "您的上下文已被安全存储。您现在可以离开、参加会议或处理紧急请求，而无需承受试图记住上次中断位置的心理负担。", color: "bg-indigo-500", icon: Clock3 },
      { title: "恢复", desc: "当您回来时，打开您的会话。您将看到您的“下一步行动”处于中心位置，以及您的所有笔记和链接。不再有“我刚才在做什么？”的时刻。", color: "bg-emerald-500", icon: PlayCircle },
      { title: "连续性", desc: "毫不费力地维护多个工作流。MindMark 充当您操作系统的外部存储器，允许在不同日期或设备之间进行无缝切换。", color: "bg-violet-500", icon: Layers3 }
    ]
  },
  German: {
    back: 'Zurück zum Dashboard', signIn: 'Anmelden', getStarted: 'Loslegen',
    badge: 'Die Methodik', title: 'Wie MindMark', titleHighlight: 'funktioniert',
    subtitle: 'Ein strukturierter Ansatz für operative Kontinuität in Umgebungen mit vielen Unterbrechungen.',
    step: 'Schritt', fast: 'Dauert weniger als 30 Sek.', mental: 'Reduziert mentale Last',
    ctaTitle: 'Bereit, den Fokus-Verlust zu stoppen?',
    ctaSub: 'Schließen Sie sich Tausenden von Entwicklern an, die ihre Fokuszeit zurückgewonnen haben.',
    ctaFree: 'Kostenlos starten', ctaPricing: 'Preise ansehen',
    footerMission: 'Ein Lesezeichen für Ihren Geisteszustand. Operative Kontinuität für komplexe Arbeit.',
    steps: [
      { title: "Erfassen", desc: "Wenn Sie unterbrochen werden, halten Sie kurz Ihren Zustand fest: Was tun Sie gerade? Warum hören Sie auf? Was ist der nächste Schritt?", color: "bg-blue-500", icon: Save },
      { title: "Pause", desc: "Ihr Kontext ist sicher gespeichert. Sie können nun unbesorgt in das Meeting gehen, ohne krampfhaft an den aktuellen Stand denken zu müssen.", color: "bg-indigo-500", icon: Clock3 },
      { title: "Fortsetzen", desc: "Bei Ihrer Rückkehr öffnen Sie die Sitzung. Ihr 'nächster Schritt' steht im Fokus, zusammen mit allen Notizen und Links.", color: "bg-emerald-500", icon: PlayCircle },
      { title: "Kontinuität", desc: "Verwalten Sie mehrere Workstreams mühelos. MindMark fungiert als externes Gedächtnis für Ihren operativen Status.", color: "bg-violet-500", icon: Layers3 }
    ]
  }
};

export function HowItWorks() {
  const { preferredLanguage } = useLanguage();
  const t = HOW_TRANSLATIONS[preferredLanguage] || HOW_TRANSLATIONS['English'];

  return (
    <div className="min-h-screen theme-bg theme-text-primary">
      <nav className="border-b theme-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 theme-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t.back}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button to="/login" variant="ghost" size="sm">{t.signIn}</Button>
            <Button to="/signup" size="sm">{t.getStarted}</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider"
          >
            <Workflow className="w-3.5 h-3.5" />
            {t.badge}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            {t.title} <span className="text-indigo-600 dark:text-indigo-400">{t.titleHighlight}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl theme-text-secondary max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </section>

        <section className="space-y-12">
          {t.steps.map((step: any, index: number) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className={`w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold theme-text-primary">{t.step} {index + 1}: {step.title}</h2>
                <p className="text-lg theme-text-secondary leading-relaxed">
                  {step.desc}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm theme-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{t.fast}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm theme-text-secondary">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{t.mental}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="bg-indigo-600 rounded-[2.5rem] p-12 text-center text-white space-y-8 shadow-2xl shadow-indigo-500/20">
          <Target className="w-12 h-12 mx-auto opacity-80" />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>
            <p className="text-indigo-100 text-lg max-w-xl mx-auto">
              {t.ctaSub}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/signup" className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg">
              {t.ctaFree}
            </Button>
            <Button to="/pricing" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
              {t.ctaPricing}
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t theme-border theme-bg py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <BookMarked className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight theme-text-primary">MindMark</span>
              </div>
              <p className="mt-4 text-sm theme-text-secondary">
                {t.footerMission}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider theme-text-primary">Product</h4>
              <ul className="mt-4 space-y-2 text-sm theme-text-secondary">
                <li><Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">How it works</Link></li>
                <li><Link to="/outcomes" className="hover:text-indigo-600 transition-colors">Outcomes</Link></li>
                <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider theme-text-primary">Company</h4>
              <ul className="mt-4 space-y-2 text-sm theme-text-secondary">
                <li><Link to="/security" className="hover:text-indigo-600 transition-colors">Security Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider theme-text-primary">Support</h4>
              <ul className="mt-4 space-y-2 text-sm theme-text-secondary">
                <li><a href="mailto:support@mindmark.app" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t theme-border pt-8 text-center text-xs theme-text-secondary">
            <p>© {new Date().getFullYear()} MindMark. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
