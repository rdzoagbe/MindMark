import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Save, AlertCircle, Pin, PinOff, PlayCircle, Shield, ShieldAlert, Sparkles, Clipboard, Loader2 } from 'lucide-react';
import { Session, SessionLink, Priority, SessionStatus } from '../types';
import { sessionValidation } from '../utils/sessionValidation';
import { normalizeUrl, isValidUrl } from '../utils/normalizeUrl';
import { FeatureGate } from './FeatureGate';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { grammarService } from '../utils/grammarService';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const FORM_TRANSLATIONS: Record<string, any> = {
  English: {
    editTitle: 'Edit Session', newTitle: 'New Session',
    harvesting: 'Harvesting clipboard context...',
    subTitle: "Capture what you're doing so you can resume instantly later.",
    autoHarvest: 'Auto-Harvesting Active', cancel: 'Cancel', save: 'Save Session', polishing: 'Polishing AI...',
    labelTitle: 'Session Title', placeholderTitle: 'e.g., Designing User Dashboard',
    labelCategory: 'Category / Matter', placeholderCategory: 'e.g., Client Smith, Project X',
    labelPriority: 'Priority', low: 'Low Priority', medium: 'Medium Priority', high: 'High Priority',
    labelDueDate: 'Due Date / Deadline',
    labelConfidential: 'Confidentiality', confidentialMode: 'Confidential Mode', confidentialDesc: 'Disables AI processing for this session.',
    labelCurrentTask: 'Current Task', placeholderCurrentTask: 'What were you working on right now?',
    labelPauseReason: 'Pause Reason', placeholderPauseReason: 'e.g., Lunch break, Meeting, End of day',
    labelNextStep: 'The Exact Next Step', crucial: 'Crucial', placeholderNextStep: 'What is the very first thing you should do when you return?',
    labelNotes: 'Additional Notes', placeholderNotes: 'Any other details, thoughts, or context...',
    labelStatus: 'Status', active: 'Active', blocked: 'Blocked', done: 'Done', archived: 'Archived',
    labelPin: 'Pin Session',
    labelTags: 'Tags', placeholderTags: 'e.g., design, coding, research', tagsDesc: 'Separate tags with commas',
    labelLinks: 'Reference Links', placeholderLinkLabel: 'Link Label (e.g., Figma File)', noLinks: 'No links added yet.'
  },
  French: {
    editTitle: 'Modifier la session', newTitle: 'Nouvelle session',
    harvesting: 'Récupération du contexte...',
    subTitle: "Capturez ce que vous faites pour reprendre instantanément plus tard.",
    autoHarvest: 'Récupération auto active', cancel: 'Annuler', save: 'Enregistrer', polishing: 'Polissage IA...',
    labelTitle: 'Titre de la session', placeholderTitle: 'ex: Conception du tableau de bord',
    labelCategory: 'Catégorie / Dossier', placeholderCategory: 'ex: Client Smith, Projet X',
    labelPriority: 'Priorité', low: 'Priorité Basse', medium: 'Priorité Moyenne', high: 'Priorité Haute',
    labelDueDate: 'Date d\'échéance / Date limite',
    labelConfidential: 'Confidentialité', confidentialMode: 'Mode Confidentiel', confidentialDesc: 'Désactive le traitement IA pour cette session.',
    labelCurrentTask: 'Tâche actuelle', placeholderCurrentTask: 'Sur quoi travailliez-vous à l\'instant ?',
    labelPauseReason: 'Raison de la pause', placeholderPauseReason: 'ex: Pause déjeuner, Réunion, Fin de journée',
    labelNextStep: 'L\'étape suivante exacte', crucial: 'Crucial', placeholderNextStep: 'Quelle est la toute première chose à faire à votre retour ?',
    labelNotes: 'Notes additionnelles', placeholderNotes: 'Autres détails, pensées ou contexte...',
    labelStatus: 'Statut', active: 'Actif', blocked: 'Bloqué', done: 'Terminé', archived: 'Archivé',
    labelPin: 'Épingler la session',
    labelTags: 'Tags', placeholderTags: 'ex: design, code, recherche', tagsDesc: 'Séparez les tags par des virgules',
    labelLinks: 'Liens de référence', placeholderLinkLabel: 'Nom du lien (ex: Fichier Figma)', noLinks: 'Aucun lien ajouté.'
  },
  Spanish: {
    editTitle: 'Editar Sesión', newTitle: 'Nueva Sesión',
    harvesting: 'Cosechando contexto del portapapeles...',
    subTitle: "Captura lo que estás haciendo para reanudar al instante más tarde.",
    autoHarvest: 'Auto-cosecha activa', cancel: 'Cancelar', save: 'Guardar Sesión', polishing: 'Pulido IA...',
    labelTitle: 'Título de la Sesión', placeholderTitle: 'ej: Diseño del Panel de Usuario',
    labelCategory: 'Categoría / Materia', placeholderCategory: 'ej: Cliente Smith, Proyecto X',
    labelPriority: 'Prioridad', low: 'Prioridad Baja', medium: 'Prioridad Media', high: 'Prioridad Alta',
    labelDueDate: 'Fecha de entrega / Límite',
    labelConfidential: 'Confidencialidad', confidentialMode: 'Modo Confidencial', confidentialDesc: 'Desactiva el procesamiento de IA.',
    labelCurrentTask: 'Tarea Actual', placeholderCurrentTask: '¿En qué estabas trabajando ahora mismo?',
    labelPauseReason: 'Razón de la Pausa', placeholderPauseReason: 'ej: Almuerzo, Reunión, Fin del día',
    labelNextStep: 'El Siguiente Paso Exacto', crucial: 'Crucial', placeholderNextStep: '¿Qué es lo primero que debes hacer al volver?',
    labelNotes: 'Notas Adicionales', placeholderNotes: 'Cualquier otro detalle o pensamiento...',
    labelStatus: 'Estado', active: 'Activo', blocked: 'Bloqueado', done: 'Hecho', archived: 'Archivado',
    labelPin: 'Anclar Sesión',
    labelTags: 'Etiquetas', placeholderTags: 'ej: diseño, código, investigación', tagsDesc: 'Separa las etiquetas con comas',
    labelLinks: 'Enlaces de Referencia', placeholderLinkLabel: 'Nombre (ej: Archivo Figma)', noLinks: 'No hay enlaces todavía.'
  },
  Portuguese: {
    editTitle: 'Editar Sessão', newTitle: 'Nova Sessão',
    harvesting: 'Colhendo contexto da área de transferência...',
    subTitle: "Capture o que você está fazendo para retomar instantaneamente depois.",
    autoHarvest: 'Auto-colheita ativa', cancel: 'Cancelar', save: 'Salvar Sessão', polishing: 'Polimento IA...',
    labelTitle: 'Título da Sessão', placeholderTitle: 'ex: Criando Dashboard',
    labelCategory: 'Categoria / Assunto', placeholderCategory: 'ex: Cliente Smith, Projeto X',
    labelPriority: 'Prioridade', low: 'Prioridade Baixa', medium: 'Prioridade Média', high: 'Prioridade Alta',
    labelDueDate: 'Prazo / Data de entrega',
    labelConfidential: 'Confidencialidade', confidentialMode: 'Modo Confidencial', confidentialDesc: 'Desativa o processamento de IA.',
    labelCurrentTask: 'Tarefa Atual', placeholderCurrentTask: 'No que você estava trabalhando agora mesmo?',
    labelPauseReason: 'Motivo da Pausa', placeholderPauseReason: 'ex: Almoço, Reunião, Fim do dia',
    labelNextStep: 'O Próximo Passo Exato', crucial: 'Crucial', placeholderNextStep: 'Qual é a primeira coisa a fazer ao voltar?',
    labelNotes: 'Notas Adicionais', placeholderNotes: 'Outros detalhes ou pensamentos...',
    labelStatus: 'Status', active: 'Ativo', blocked: 'Bloqueado', done: 'Concluído', archived: 'Arquivado',
    labelPin: 'Fixar Sessão',
    labelTags: 'Tags', placeholderTags: 'ex: design, código, pesquisa', tagsDesc: 'Separe as tags com vírgulas',
    labelLinks: 'Links de Referência', placeholderLinkLabel: 'Nome (ex: Arquivo Figma)', noLinks: 'Nenhum link adicionado.'
  },
  Chinese: {
    editTitle: '编辑会话', newTitle: '新会话',
    harvesting: '正在获取剪贴板上下文...',
    subTitle: "记录您正在做的事情，以便以后立即恢复。",
    autoHarvest: '自动获取已激活', cancel: '取消', save: '保存会话', polishing: 'AI 润色中...',
    labelTitle: '会话标题', placeholderTitle: '例如：设计用户仪表板',
    labelCategory: '类别 / 事项', placeholderCategory: '例如：客户史密斯，项目 X',
    labelPriority: '优先级', low: '低优先级', medium: '中优先级', high: '高优先级',
    labelDueDate: '截止日期',
    labelConfidential: '机密性', confidentialMode: '机密模式', confidentialDesc: '对此会话禁用 AI 处理。',
    labelCurrentTask: '当前任务', placeholderCurrentTask: '您刚才在做什么工作？',
    labelPauseReason: '暂停原因', placeholderPauseReason: '例如：午休、会议、下班',
    labelNextStep: '确切的下一步', crucial: '至关重要', placeholderNextStep: '您回来后应该做的第一件事是什么？',
    labelNotes: '备注', placeholderNotes: '任何其他细节、想法或上下文...',
    labelStatus: '状态', active: '进行中', blocked: '已受阻', done: '已完成', archived: '已归档',
    labelPin: '固定会话',
    labelTags: '标签', placeholderTags: '例如：设计、编程、研究', tagsDesc: '用逗号分隔标签',
    labelLinks: '参考链接', placeholderLinkLabel: '链接标签（例如：Figma 文件）', noLinks: '尚未添加链接。'
  },
  German: {
    editTitle: 'Sitzung bearbeiten', newTitle: 'Neue Sitzung',
    harvesting: 'Zwischenablage wird gelesen...',
    subTitle: "Halten Sie fest, was Sie tun, um später sofort wieder einzusteigen.",
    autoHarvest: 'Auto-Harvesting aktiv', cancel: 'Abbrechen', save: 'Sitzung speichern', polishing: 'KI poliert...',
    labelTitle: 'Sitzungstitel', placeholderTitle: 'z.B. Dashboard-Design',
    labelCategory: 'Kategorie / Betreff', placeholderCategory: 'z.B. Kunde Müller, Projekt X',
    labelPriority: 'Priorität', low: 'Niedrige Priorität', medium: 'Mittlere Priorität', high: 'Hohe Priorität',
    labelDueDate: 'Fälligkeitsdatum',
    labelConfidential: 'Vertraulichkeit', confidentialMode: 'Vertraulichkeitsmodus', confidentialDesc: 'KI-Verarbeitung für diese Sitzung deaktivieren.',
    labelCurrentTask: 'Aktuelle Aufgabe', placeholderCurrentTask: 'Woran haben Sie gerade gearbeitet?',
    labelPauseReason: 'Pausengrund', placeholderPauseReason: 'z.B. Mittagspause, Meeting, Feierabend',
    labelNextStep: 'Der exakte nächste Schritt', crucial: 'Wichtig', placeholderNextStep: 'Was ist das Erste, das Sie bei Ihrer Rückkehr tun sollten?',
    labelNotes: 'Zusätzliche Notizen', placeholderNotes: 'Weitere Details, Gedanken oder Kontext...',
    labelStatus: 'Status', active: 'Aktiv', blocked: 'Blockiert', done: 'Erledigt', archived: 'Archiviert',
    labelPin: 'Sitzung anheften',
    labelTags: 'Tags', placeholderTags: 'z.B. Design, Coding, Recherche', tagsDesc: 'Tags mit Kommas trennen',
    labelLinks: 'Referenz-Links', placeholderLinkLabel: 'Link-Name (z.B. Figma-Datei)', noLinks: 'Noch keine Links hinzugefügt.'
  }
};

interface SessionFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SessionForm({ initialData, onSubmit, onCancel }: SessionFormProps) {
  const { user } = useAuth();
  const { preferredLanguage } = useLanguage();
  const t = FORM_TRANSLATIONS[preferredLanguage] || FORM_TRANSLATIONS['English'];

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Work',
    currentTask: initialData?.currentTask || '',
    pauseReason: initialData?.pauseReason || '',
    nextStep: initialData?.nextStep || '',
    notes: initialData?.notes || '',
    tags: initialData?.tags?.join(', ') || '',
    priority: initialData?.priority || 'medium' as Priority,
    status: initialData?.status || 'active' as SessionStatus,
    pinned: initialData?.pinned || false,
    links: initialData?.links || [] as SessionLink[],
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    isConfidential: initialData?.isConfidential || false,
    duration: initialData?.duration || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automated Context Harvesting
  useEffect(() => {
    if (initialData?.id) return; // Don't harvest if editing

    const harvestContext = async () => {
      setIsHarvesting(true);
      try {
        // 1. Pre-fill Title if empty using timestamp
        if (!formData.title) {
          const now = new Date();
          const autoTitle = `Session ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          setFormData(prev => ({ ...prev, title: autoTitle }));
        }

        // 2. Read Clipboard
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          if (isValidUrl(clipboardText)) {
            // If clipboard is a URL, add it as a link
             setFormData(prev => ({
              ...prev,
              links: [...prev.links, { id: crypto.randomUUID(), label: 'Harvested Link', url: clipboardText, comment: 'Auto-captured from clipboard' }],
              pauseReason: `Researching ${clipboardText}`
            }));
          } else if (clipboardText.length > 5 && !formData.pauseReason) {
             setFormData(prev => ({ ...prev, pauseReason: clipboardText.slice(0, 100) }));
          }
        }
      } catch (err) {
        console.warn('Clipboard access denied or unavailable:', err);
      } finally {
        setIsHarvesting(false);
      }
    };

    harvestContext();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      // Normalize and validate links
      const normalizedLinks = formData.links.map(link => ({
        ...link,
        url: normalizeUrl(link.url)
      }));

      const linkErrors: Record<string, string> = {};
      normalizedLinks.forEach((link, index) => {
        if (link.url && !isValidUrl(link.url)) {
          linkErrors[`link-${index}`] = 'Invalid URL';
        }
      });

      // Multilingual Grammar Correction & Translation for Next Step
      let polishedNextStep = formData.nextStep;
      if (polishedNextStep && !formData.isConfidential) {
         polishedNextStep = await grammarService.polishString(polishedNextStep, user?.uid);
      }

      const dataToValidate = {
        ...formData,
        nextStep: polishedNextStep,
        tags: tagsArray,
        links: normalizedLinks,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      };

      const validation = sessionValidation.validate(dataToValidate);
      
      if (!validation.isValid || Object.keys(linkErrors).length > 0) {
        setErrors({ ...validation.errors, ...linkErrors });
        setIsSubmitting(false);
        return;
      }

      onSubmit(dataToValidate);
    } catch (err) {
      console.error("Submit processing error:", err);
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { id: crypto.randomUUID(), label: '', url: '', comment: '' }],
    }));
  };

  const updateLink = (id: string, field: keyof SessionLink, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    }));
  };

  const removeLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-12">
      <PageHeader 
        title={initialData?.id ? t.editTitle : t.newTitle} 
        description={isHarvesting ? t.harvesting : t.subTitle}
      >
        <div className="flex items-center gap-3">
          {isHarvesting && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              {t.autoHarvest}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t.cancel}
          </Button>
          <Button
            type="submit"
            icon={isSubmitting ? Loader2 : Save}
            size="lg"
            className={`px-8 ${isSubmitting ? 'animate-pulse' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t.polishing : t.save}
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelTitle}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${errors.title ? 'border-rose-500' : 'theme-border'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-semibold theme-text-primary placeholder:text-slate-400`}
                placeholder={t.placeholderTitle}
              />
              {errors.title && <p className="text-rose-500 text-xs font-medium ml-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelCategory}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                  placeholder={t.placeholderCategory}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelPriority}</label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary appearance-none cursor-pointer"
                  >
                    <option value="low">{t.low}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="high">{t.high}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Plus className="w-4 h-4 rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelDueDate}</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelConfidential}</label>
                <FeatureGate feature="confidentiality" inline>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border theme-border rounded-xl">
                    <div className="flex items-center gap-2">
                      {formData.isConfidential ? <ShieldAlert className="w-4 h-4 text-amber-500" /> : <Shield className="w-4 h-4 text-slate-400" />}
                      <span className="text-sm font-medium theme-text-primary">{t.confidentialMode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isConfidential: !formData.isConfidential })}
                      className={`w-10 h-5 rounded-full transition-all relative ${formData.isConfidential ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.isConfidential ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] theme-text-secondary ml-1 mt-1">{t.confidentialDesc}</p>
                </FeatureGate>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelCurrentTask}</label>
              <textarea
                value={formData.currentTask}
                onChange={(e) => setFormData({ ...formData, currentTask: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[100px] leading-relaxed theme-text-primary font-medium placeholder:text-slate-400"
                placeholder={t.placeholderCurrentTask}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelPauseReason}</label>
              <input
                type="text"
                value={formData.pauseReason}
                onChange={(e) => setFormData({ ...formData, pauseReason: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
                placeholder={t.placeholderPauseReason}
              />
            </div>
          </Card>

          {/* Next Step - Highlighted */}
          <div className="p-8 bg-indigo-600 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <PlayCircle className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-medium text-indigo-200 uppercase tracking-wider ml-1">{t.labelNextStep}</label>
                <Badge variant="indigo" className="bg-white/20 text-white border-transparent">{t.crucial}</Badge>
              </div>
              <textarea
                value={formData.nextStep}
                onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                className={`w-full px-6 py-4 bg-white/10 border ${errors.nextStep ? 'border-rose-300' : 'border-transparent'} rounded-xl focus:ring-4 focus:ring-white/20 outline-none transition-all text-white placeholder:text-indigo-200 font-semibold text-2xl leading-relaxed backdrop-blur-sm`}
                placeholder={t.placeholderNextStep}
                rows={3}
              />
              {errors.nextStep && <p className="text-rose-200 text-xs font-medium ml-1 mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.nextStep}</p>}
            </div>
          </div>

          {/* Notes */}
          <Card className="space-y-4">
            <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelNotes}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm min-h-[120px] leading-relaxed theme-text-primary font-medium placeholder:text-slate-400"
              placeholder={t.placeholderNotes}
            />
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status & Pin */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelStatus}</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as SessionStatus })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary appearance-none cursor-pointer"
                >
                  <option value="active">{t.active}</option>
                  <option value="blocked">{t.blocked}</option>
                  <option value="done">{t.done}</option>
                  <option value="archived">{t.archived}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Plus className="w-4 h-4 rotate-45" />
                </div>
              </div>
            </div>

            <FeatureGate feature="pinned_sessions" inline>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${formData.pinned ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-400 border theme-border'}`}>
                    {formData.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-semibold theme-text-secondary">{t.labelPin}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.pinned ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.pinned ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </FeatureGate>
          </Card>

          {/* Tags */}
          <Card className="space-y-4">
            <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelTags}</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium theme-text-primary placeholder:text-slate-400"
              placeholder={t.placeholderTags}
            />
            <p className="text-xs theme-text-secondary ml-1 font-medium italic">{t.tagsDesc}</p>
          </Card>

          {/* Links */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.labelLinks}</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={addLink}
              />
            </div>

            <div className="space-y-4">
              {formData.links.map((link) => (
                <div key={link.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border space-y-3 relative group hover:border-indigo-500/50 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-800 border theme-border text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 theme-text-primary placeholder:text-slate-400"
                      placeholder={t.placeholderLinkLabel}
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 theme-text-primary font-medium placeholder:text-slate-400"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.links.length === 0 && (
                <div className="text-center py-6 border border-dashed theme-border rounded-xl">
                  <p className="text-sm theme-text-secondary italic font-medium">{t.noLinks}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
