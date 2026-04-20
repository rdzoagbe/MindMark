import { Inbox, Plus, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

interface EmptyStateProps {
  isSearch?: boolean;
  onClearSearch?: () => void;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    to?: string;
    icon?: LucideIcon;
  };
}

const EMPTY_TRANSLATIONS: Record<string, any> = {
  English: {
    searchTitle: 'No matches found',
    searchDesc: 'We couldn\'t find any sessions matching your search. Try a different search term or clear filters.',
    clearSearch: 'Clear Search',
    defaultTitle: 'Your future self will thank you',
    defaultDesc: 'MindMark helps you save what you were doing, why you paused, and what to do next. Capture your first context before you step away.',
    createFirst: 'Create your first session',
    viewPlans: 'View Plans'
  },
  French: {
    searchTitle: 'Aucun résultat trouvé',
    searchDesc: 'Nous n\'avons trouvé aucune session correspondant à votre recherche. Essayez un autre terme ou effacez les filtres.',
    clearSearch: 'Effacer la recherche',
    defaultTitle: 'Votre futur moi vous remerciera',
    defaultDesc: 'MindMark vous aide à sauvegarder ce que vous faisiez et pourquoi vous vous êtes arrêté. Capturez votre premier contexte.',
    createFirst: 'Créer votre première session',
    viewPlans: 'Voir les forfaits'
  },
  Spanish: {
    searchTitle: 'No se encontraron coincidencias',
    searchDesc: 'No pudimos encontrar ninguna sesión que coincida con tu búsqueda. Intenta con otro término.',
    clearSearch: 'Borrar búsqueda',
    defaultTitle: 'Tu yo del futuro te lo agradecerá',
    defaultDesc: 'MindMark te ayuda a guardar lo que estabas haciendo y por qué te detuviste. Captura tu primer contexto.',
    createFirst: 'Crear tu primera sesión',
    viewPlans: 'Ver planes'
  },
  Portuguese: {
    searchTitle: 'Nenhum resultado encontrado',
    searchDesc: 'Não encontramos nenhuma sessão que corresponda à sua busca. Tente outro termo ou limpe os filtros.',
    clearSearch: 'Limpar busca',
    defaultTitle: 'Seu eu do futuro vai te agradecer',
    defaultDesc: 'O MindMark ajuda você a salvar o que estava fazendo e por que parou. Capture seu primeiro contexto.',
    createFirst: 'Criar sua primeira sessão',
    viewPlans: 'Ver planos'
  },
  Chinese: {
    searchTitle: '未找到匹配项',
    searchDesc: '我们找不到与您的搜索匹配的任何会话。请尝试其他搜索词或清除过滤器。',
    clearSearch: '清除搜索',
    defaultTitle: '未来的你会感谢现在的自己',
    defaultDesc: 'MindMark 帮助您保存正在执行的操作、暂停的原因以及下一步该怎么做。在离开前捕捉第一个上下文。',
    createFirst: '创建您的第一个会话',
    viewPlans: '查看计划'
  },
  German: {
    searchTitle: 'Keine Treffer gefunden',
    searchDesc: 'Wir konnten keine Sitzungen finden, die Ihrer Suche entsprechen. Versuchen Sie es mit einem anderen Begriff.',
    clearSearch: 'Suche löschen',
    defaultTitle: 'Ihr zukünftiges Ich wird es Ihnen danken',
    defaultDesc: 'MindMark hilft Ihnen festzuhalten, was Sie gerade tun und warum Sie aufhören. Erfassen Sie Ihren ersten Kontext.',
    createFirst: 'Erste Sitzung erstellen',
    viewPlans: 'Pläne ansehen'
  }
};

export function EmptyState({ 
  isSearch, 
  onClearSearch,
  icon: Icon = Inbox,
  title,
  description,
  action
}: EmptyStateProps) {
  const { preferredLanguage } = useLanguage();
  const t = EMPTY_TRANSLATIONS[preferredLanguage] || EMPTY_TRANSLATIONS['English'];
  
  const displayTitle = title || (isSearch ? t.searchTitle : t.defaultTitle);
  const displayDescription = description || (isSearch ? t.searchDesc : t.defaultDesc);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-8 theme-surface rounded-[2rem] border theme-border shadow-sm overflow-hidden relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-8 shadow-inner">
          <Icon className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold theme-text-primary mb-3 tracking-tight">
          {displayTitle}
        </h3>
        <p className="theme-text-secondary text-base max-w-md mx-auto mb-10 leading-relaxed">
          {displayDescription}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {action ? (
            action.to ? (
              <Button
                to={action.to}
                icon={action.icon}
                size="lg"
                className="px-8"
              >
                {action.label}
              </Button>
            ) : (
              <Button
                onClick={action.onClick}
                icon={action.icon}
                size="lg"
                className="px-8"
              >
                {action.label}
              </Button>
            )
          ) : isSearch ? (
            <Button
              onClick={onClearSearch}
              variant="outline"
              size="lg"
              className="px-8"
            >
              {t.clearSearch}
            </Button>
          ) : (
            <>
              <Button
                to="/create"
                icon={Plus}
                size="lg"
                className="px-8 shadow-lg shadow-indigo-500/20"
              >
                {t.createFirst}
              </Button>
              <Button
                to="/pricing"
                variant="ghost"
                size="lg"
                className="px-8"
              >
                {t.viewPlans}
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
