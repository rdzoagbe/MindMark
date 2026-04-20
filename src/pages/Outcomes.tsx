import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Brain, 
  Clock, 
  Zap,
  Shield,
  BarChart3,
  Users,
  BookMarked
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../hooks/useLanguage';

const OUTCOMES_TRANSLATIONS: Record<string, any> = {
  EN: {
    back: 'Back to Home', signIn: 'Sign in', getStarted: 'Get Started',
    badge: 'Measurable Impact', title: 'Real-world', titleHighlight: 'Outcomes',
    subtitle: 'How MindMark transforms the way high-performance teams handle interruptions and task switching.',
    benefitTitle: 'Who benefits most?',
    se: 'Software Engineers', seDesc: 'Manage deep work sessions across PR reviews, meetings, and bug fixes without losing your place in complex logic.',
    pm: 'Product Managers', pmDesc: 'Switch between strategy, stakeholder comms, and spec writing while maintaining a clear operational handoff for yourself.',
    ops: 'SRE & Ops', opsDesc: 'Track incident response state and hand off contexts cleanly during shift changes or escalations.',
    creative: 'Creative Leads', creativeDesc: 'Preserve the "why" behind design decisions when moving between multiple active projects and feedback loops.',
    ctaTitle: 'Ready to see the results?', ctaButton: 'Get Started Now',
    footerMission: 'Bookmark your mind\'s exact state. Operational continuity for high-context work.',
    outcomes: [
      { title: "Reclaim 15-20 mins per restart", desc: "Eliminate the 'What was I doing?' phase. By having a clear next action and context summary, you jump straight back into execution mode.", metric: "Focus Time Saved", val: "2.5 hrs/week", icon: Clock },
      { title: "Reduced Cognitive Load", desc: "Offload the burden of remembering active tasks to MindMark. Free up your working memory for the actual problem-solving.", metric: "Mental Clarity", val: "High", icon: Brain },
      { title: "Zero Dropped Threads", desc: "Small but critical details often get lost during handoffs or end-of-day transitions. MindMark ensures every thread is accounted for.", metric: "Task Completion", val: "100%", icon: Shield },
      { title: "Instant Flow State", desc: "Flow is fragile. Our structured resume process helps you re-enter flow state faster by providing a low-friction entry point.", metric: "Flow Entry", val: "2x Faster", icon: Zap }
    ]
  },
  FR: {
    back: 'Retour à l\'accueil', signIn: 'Se connecter', getStarted: 'Commencer',
    badge: 'Impact mesurable', title: 'Résultats', titleHighlight: 'concrets',
    subtitle: 'Comment MindMark transforme la façon dont les équipes performantes gèrent les interruptions.',
    benefitTitle: 'Qui en profite le plus ?',
    se: 'Ingénieurs logiciel', seDesc: 'Gérez vos sessions de travail profond sans perdre le fil entre les revues de code et les réunions.',
    pm: 'Chefs de produit', pmDesc: 'Passez de la stratégie aux comms stakeholders tout en gardant un contexte précis pour vous-même.',
    ops: 'SRE & Ops', opsDesc: 'Suivez l\'état de réponse aux incidents et transmettez les contextes proprement lors des changements d\'équipe.',
    creative: 'Directeurs créatifs', creativeDesc: 'Préservez le "pourquoi" de vos décisions de design entre plusieurs projets actifs.',
    ctaTitle: 'Prêt à voir les résultats ?', ctaButton: 'Commencer maintenant',
    footerMission: 'Marquez l\'état exact de votre esprit. Continuité opérationnelle pour le travail complexe.',
    outcomes: [
      { title: "Gagnez 15-20 mins par redémarrage", desc: "Éliminez la phase du 'Qu'est-ce que je faisais ?'. Reprenez directement l'exécution.", metric: "Temps économisé", val: "2.5 h/semaine", icon: Clock },
      { title: "Charge mentale réduite", desc: "Déchargez MindMark de la mémoire des tâches actives. Libérez votre esprit pour la résolution de problèmes.", metric: "Clarté mentale", val: "Élevée", icon: Brain },
      { title: "Zéro perte d'info", desc: "MindMark garantit que chaque détail est conservé lors des transitions de fin de journée.", metric: "Tâches terminées", val: "100%", icon: Shield },
      { title: "Flow instantané", desc: "Notre processus structuré vous aide à ré-entrer en état de flow plus rapidement.", metric: "Entrée en flow", val: "2x plus rapide", icon: Zap }
    ]
  },
  ES: {
    back: 'Volver al inicio', signIn: 'Iniciar sesión', getStarted: 'Empezar',
    badge: 'Impacto medible', title: 'Resultados', titleHighlight: 'Reales',
    subtitle: 'Cómo MindMark transforma la forma en que los equipos de alto rendimiento manejan las interrupciones.',
    benefitTitle: '¿Quién se beneficia más?',
    se: 'Ingenieros de Software', seDesc: 'Gestiona sesiones de trabajo profundo sin perder el hilo entre revisiones y reuniones.',
    pm: 'Gerentes de Producto', pmDesc: 'Cambia entre estrategia y comunicación manteniendo un traspaso operacional claro.',
    ops: 'SRE y Operaciones', opsDesc: 'Rastrea el estado de respuesta a incidentes y entrega contextos limpiamente.',
    creative: 'Líderes Creativos', creativeDesc: 'Preserva el "porqué" de las decisiones de diseño entre múltiples proyectos.',
    ctaTitle: '¿Listo para ver resultados?', ctaButton: 'Empezar ahora',
    footerMission: 'Marca el estado exacto de tu mente. Continuidad operacional para trabajo complejo.',
    outcomes: [
      { title: "Recupera 15-20 mins por reinicio", desc: "Elimina la fase de '¿Qué estaba haciendo?'. Salta directo a la ejecución.", metric: "Tiempo ahorrado", val: "2.5 hrs/semana", icon: Clock },
      { title: "Carga Cognitiva Reducida", desc: "Descarga la carga de recordar tareas activas en MindMark. Libera tu memoria de trabajo.", metric: "Claridad Mental", val: "Alta", icon: Brain },
      { title: "Cero hilos perdidos", desc: "MindMark asegura que cada detalle se tenga en cuenta en las transiciones.", metric: "Cumplimiento", val: "100%", icon: Shield },
      { title: "Estado de Flow Instantáneo", desc: "Nuestro proceso estructurado te ayuda a re-entrar en flow más rápido.", metric: "Entrada en Flow", val: "2x más rápido", icon: Zap }
    ]
  },
  PT: {
    back: 'Voltar ao início', signIn: 'Entrar', getStarted: 'Começar',
    badge: 'Impacto mensurável', title: 'Resultados', titleHighlight: 'Reais',
    subtitle: 'Como o MindMark transforma a maneira como equipes de alta performance lidam com interrupções.',
    benefitTitle: 'Quem mais se beneficia?',
    se: 'Engenheiros de Software', seDesc: 'Gerencie sessões de trabalho profundo sem perder o fio da meada entre revisões e reuniões.',
    pm: 'Gerentes de Produto', pmDesc: 'Alterne entre estratégia e comunicação mantendo um histórico operacional claro.',
    ops: 'SRE e Operações', opsDesc: 'Acompanhe o estado de resposta a incidentes e passe contextos de forma limpa.',
    creative: 'Líderes Criativos', creativeDesc: 'Preserve o "porquê" das decisões de design entre múltiplos projetos ativos.',
    ctaTitle: 'Pronto para ver resultados?', ctaButton: 'Começar agora',
    footerMission: 'Marque o estado exato da sua mente. Continuidade operacional para trabalho complexo.',
    outcomes: [
      { title: "Recupere 15-20 min por reinício", desc: "Elimine a fase 'O que eu estava fazendo?'. Vá direto para a execução.", metric: "Tempo economizado", val: "2.5 h/semana", icon: Clock },
      { title: "Carga Cognitiva Reduzida", desc: "Descarregue o fardo de lembrar tarefas no MindMark. Libere sua memória de trabalho.", metric: "Clareza Mental", val: "Alta", icon: Brain },
      { title: "Zero pendências perdidas", desc: "O MindMark garante que cada detalhe seja contabilizado nas transições.", metric: "Conclusão", val: "100%", icon: Shield },
      { title: "Estado de Flow Instantâneo", desc: "Nosso processo estruturado ajuda você a reentrar no estado de flow mais rápido.", metric: "Entrada no Flow", val: "2x mais rápido", icon: Zap }
    ]
  },
  ZH: {
    back: '返回主页', signIn: '登录', getStarted: '开始使用',
    badge: '可衡量的影响', title: '真实世界的', titleHighlight: '成果',
    subtitle: 'MindMark 如何改变高效团队处理干扰和任务切换的方式。',
    benefitTitle: '谁受益匪浅？',
    se: '软件工程师', seDesc: '在公关审查、会议和错误修复之间管理深度工作会话，而不会丢失复杂的逻辑。',
    pm: '产品经理', pmDesc: '在策略、利益相关者沟通和规范编写之间切换，同时为自己保持清晰的操作交接。',
    ops: 'SRE 和运维', opsDesc: '在班次变更或升级期间跟踪事件响应状态并清晰地交接上下文。',
    creative: '创意总监', creativeDesc: '在多个活动项目和反馈循环之间切换时，保留设计决策背后的“原因”。',
    ctaTitle: '准备好看到结果了吗？', ctaButton: '立即开始',
    footerMission: '为您的思维确切状态添加书签。高上下文工作的操作连续性。',
    outcomes: [
      { title: "每次重启可节省 15-20 分钟", desc: "消除“我刚才在做什么？”阶段。通过清晰的下一步行动和上下文摘要，您可以直接进入执行模式。", metric: "节省的专注时间", val: "2.5 小时/周", icon: Clock },
      { title: "降低认知负荷", desc: "将记忆活动任务的负担卸载到 MindMark。为实际解决问题释放您的工作记忆。", metric: "思维清晰度", val: "高", icon: Brain },
      { title: "零遗漏", desc: "在交接或下班过渡时，细小但关键的细节经常丢失。MindMark 确保每一个细节都得到妥善记录。", metric: "任务完成率", val: "100%", icon: Shield },
      { title: "即时进入心流状态", desc: "心流是脆弱的。我们结构化的恢复过程通过提供低摩擦的切入点，帮助您更快地重新进入心流状态。", metric: "进入心流", val: "快 2 倍", icon: Zap }
    ]
  },
  DE: {
    back: 'Zurück zum Dashboard', signIn: 'Anmelden', getStarted: 'Loslegen',
    badge: 'Messbarer Impact', title: 'Echte', titleHighlight: 'Ergebnisse',
    subtitle: 'Wie MindMark die Art und Weise verändert, wie Hochleistungsteams mit Unterbrechungen umgehen.',
    benefitTitle: 'Wer profitiert am meisten?',
    se: 'Software-Entwickler', seDesc: 'Verwalten Sie Deep-Work-Sessions ohne den Faden bei PR-Reviews oder Meetings zu verlieren.',
    pm: 'Produktmanager', pmDesc: 'Wechseln Sie zwischen Strategie und Kommunikation mit einer klaren operativen Übergabe.',
    ops: 'SRE & Ops', opsDesc: 'Verfolgen Sie Incident-Status und übergeben Sie Kontexte sauber bei Schichtwechseln.',
    creative: 'Kreativ-Leads', creativeDesc: 'Bewahren Sie das "Warum" hinter Designentscheidungen bei mehreren aktiven Projekten.',
    ctaTitle: 'Bereit für Ergebnisse?', ctaButton: 'Jetzt loslegen',
    footerMission: 'Ein Lesezeichen für Ihren Geisteszustand. Operative Kontinuität für komplexe Arbeit.',
    outcomes: [
      { title: "15-20 Min. pro Neustart sparen", desc: "Eliminieren Sie die 'Was habe ich getan?'-Phase. Steigen Sie direkt wieder in die Ausführung ein.", metric: "Fokuszeit gespart", val: "2.5 Std/Woche", icon: Clock },
      { title: "Kognitive Last reduziert", desc: "Entlasten Sie Ihr Arbeitsgedächtnis. MindMark merkt sich die aktiven Aufgaben für Sie.", metric: "Mentale Klarheit", val: "Hoch", icon: Brain },
      { title: "Null verlorene Fäden", desc: "MindMark stellt sicher, dass jedes Detail bei Übergaben oder Feierabend erhalten bleibt.", metric: "Abschlussquote", val: "100%", icon: Shield },
      { title: "Sofortiger Flow-Zustand", desc: "Unser strukturierter Prozess hilft Ihnen, schneller wieder in den Flow zu kommen.", metric: "Flow-Eintritt", val: "2x schneller", icon: Zap }
    ]
  }
};

export function Outcomes() {
  const { preferredLanguage } = useLanguage();
  const t = OUTCOMES_TRANSLATIONS[preferredLanguage] || OUTCOMES_TRANSLATIONS['EN'];

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

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {t.badge}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            {t.title} <span className="text-emerald-600 dark:text-emerald-400">{t.titleHighlight}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl theme-text-secondary"
          >
            {t.subtitle}
          </motion.p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.outcomes.map((outcome: any, index: number) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 h-full flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <outcome.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold theme-text-primary">{outcome.title}</h3>
                    <p className="theme-text-secondary leading-relaxed">
                      {outcome.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t theme-border flex items-center justify-between">
                  <span className="text-sm font-medium theme-text-secondary">{outcome.metric}</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{outcome.val}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-8 bg-slate-900 text-white lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">{t.benefitTitle}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">{t.se}</h4>
                <p className="text-sm text-slate-400">{t.seDesc}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">{t.pm}</h4>
                <p className="text-sm text-slate-400">{t.pmDesc}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">{t.ops}</h4>
                <p className="text-sm text-slate-400">{t.opsDesc}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">{t.creative}</h4>
                <p className="text-sm text-slate-400">{t.creativeDesc}</p>
              </div>
            </div>
          </Card>
          <Card className="p-8 bg-indigo-600 text-white flex flex-col justify-center text-center space-y-6">
            <BarChart3 className="w-12 h-12 mx-auto opacity-80" />
            <h3 className="text-2xl font-bold">{t.ctaTitle}</h3>
            <Button to="/signup" className="bg-white text-indigo-600 hover:bg-indigo-50 w-full">
              {t.ctaButton}
            </Button>
          </Card>
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
