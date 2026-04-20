import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useSessions } from '../contexts/SessionContext';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Activity,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { format, startOfDay, subDays } from 'date-fns';
import { useLanguage } from '../hooks/useLanguage';

const ANALYTICS_TRANSLATIONS: Record<string, any> = {
  EN: {
    title: 'Advanced Analytics', desc: 'Deep insights into your productivity and context management.',
    pro: 'Pro Feature',
    total: 'Total Sessions', active: 'Active Now', completed: 'Completed', blocked: 'Blocked',
    trend: 'Creation Trend (Last 7 Days)',
    priorityDist: 'Priority Distribution',
    byCategory: 'Sessions by Category',
    topCategories: 'Top Categories'
  },
  FR: {
    title: 'Analyses Avancées', desc: 'Aperçus profonds de votre productivité et gestion du contexte.',
    pro: 'Fonction Pro',
    total: 'Total Sessions', active: 'Actives', completed: 'Terminées', blocked: 'Bloquées',
    trend: 'Tendance de création (7 jours)',
    priorityDist: 'Distribution par priorité',
    byCategory: 'Sessions par catégorie',
    topCategories: 'Top catégories'
  },
  ES: {
    title: 'Análisis Avanzado', desc: 'Información profunda sobre tu productividad y gestión.',
    pro: 'Función Pro',
    total: 'Total Sesiones', active: 'Activas Hoy', completed: 'Completadas', blocked: 'Bloqueadas',
    trend: 'Tendencia de creación (7 días)',
    priorityDist: 'Distribución de Prioridad',
    byCategory: 'Sesiones por Categoría',
    topCategories: 'Categorías Principales'
  },
  PT: {
    title: 'Análise Avançada', desc: 'Insights profundos sobre sua produtividade e gestão.',
    pro: 'Recurso Pro',
    total: 'Total de Sessões', active: 'Ativas Agora', completed: 'Concluídas', blocked: 'Bloqueadas',
    trend: 'Tendência de criação (7 dias)',
    priorityDist: 'Distribuição de Prioridade',
    byCategory: 'Sessões por Categoria',
    topCategories: 'Principais Categorias'
  },
  ZH: {
    title: '高级分析', desc: '深入了解您的生产力和上下文管理。',
    pro: 'Pro 功能',
    total: '总会话数', active: '当前活跃', completed: '已完成', blocked: '已受阻',
    trend: '创建趋势（过去 7 天）',
    priorityDist: '优先级分布',
    byCategory: '按类别划分的会话',
    topCategories: '热门类别'
  },
  DE: {
    title: 'Erweiterte Analysen', desc: 'Tiefe Einblicke in Ihre Produktivität.',
    pro: 'Pro-Funktion',
    total: 'Gesamt Sitzungen', active: 'Jetzt aktiv', completed: 'Erledigt', blocked: 'Blockiert',
    trend: 'Erstellungs-Trend (7 Tage)',
    priorityDist: 'Prioritäts-Verteilung',
    byCategory: 'Sitzungen nach Kategorie',
    topCategories: 'Top Kategorien'
  }
};

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

const getPriorityLabels = (preferredLanguage: string) => {
  const translations: Record<string, any> = {
    EN: { low: 'Low', medium: 'Medium', high: 'High' },
    FR: { low: 'Basse', medium: 'Moyenne', high: 'Haute' },
    ES: { low: 'Baja', medium: 'Media', high: 'Alta' },
    PT: { low: 'Baixa', medium: 'Média', high: 'Alta' },
    ZH: { low: '低', medium: '中', high: '高' },
    DE: { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' }
  };
  return translations[preferredLanguage] || translations['EN'];
};

export function AnalyticsDashboard() {
  const { sessions } = useSessions();
  const { preferredLanguage } = useLanguage();
  const t = ANALYTICS_TRANSLATIONS[preferredLanguage] || ANALYTICS_TRANSLATIONS['EN'];
  const priorityLabels = getPriorityLabels(preferredLanguage);

  const stats = useMemo(() => {
    const categoryData: Record<string, number> = {};
    const priorityData: Record<string, number> = { low: 0, medium: 0, high: 0 };
    const statusData: Record<string, number> = { active: 0, archived: 0, done: 0, blocked: 0 };
    
    // Time series data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(startOfDay(new Date()), i);
      return {
        date: format(date, 'MMM d'),
        fullDate: date,
        count: 0
      };
    }).reverse();

    sessions.forEach(session => {
      // Category
      categoryData[session.category] = (categoryData[session.category] || 0) + 1;
      
      // Priority
      priorityData[session.priority]++;
      
      // Status
      statusData[session.status]++;

      // Time series
      const sessionDate = startOfDay(new Date(session.createdAt));
      const dayIndex = last7Days.findIndex(d => d.fullDate.getTime() === sessionDate.getTime());
      if (dayIndex !== -1) {
        last7Days[dayIndex].count++;
      }
    });

    return {
      category: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
      priority: Object.entries(priorityData).map(([name, value]) => ({ 
        name: priorityLabels[name as keyof typeof priorityLabels] || name, 
        internalName: name,
        value 
      })),
      status: Object.entries(statusData).map(([name, value]) => ({ name, value })),
      timeSeries: last7Days,
      total: sessions.length,
      active: statusData.active,
      done: statusData.done,
      blocked: statusData.blocked
    };
  }, [sessions, priorityLabels]);

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title={t.title} 
        description={t.desc}
      >
        <Badge variant="indigo" size="md" icon={Activity} className="shrink-0">{t.pro}</Badge>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-sm font-medium theme-text-secondary uppercase tracking-wider sm:normal-case sm:tracking-normal">{t.total}</p>
            <p className="text-xl sm:text-2xl font-bold theme-text-primary">{stats.total}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-sm font-medium theme-text-secondary uppercase tracking-wider sm:normal-case sm:tracking-normal">{t.active}</p>
            <p className="text-xl sm:text-2xl font-bold theme-text-primary">{stats.active}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-sm font-medium theme-text-secondary uppercase tracking-wider sm:normal-case sm:tracking-normal">{t.completed}</p>
            <p className="text-xl sm:text-2xl font-bold theme-text-primary">{stats.done}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-sm font-medium theme-text-secondary uppercase tracking-wider sm:normal-case sm:tracking-normal">{t.blocked}</p>
            <p className="text-xl sm:text-2xl font-bold theme-text-primary">{stats.blocked}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold theme-text-primary">{t.trend}</h3>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  className="text-slate-500 dark:text-slate-400"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold theme-text-primary">{t.priorityDist}</h3>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priority}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  className="text-slate-500 dark:text-slate-400"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <Tooltip 
                  cursor={{ fill: 'currentColor', className: 'text-slate-100 dark:text-slate-800/50' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.priority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.internalName === 'high' ? '#f43f5e' : entry.internalName === 'medium' ? '#f59e0b' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 sm:p-8 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold theme-text-primary">{t.byCategory}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.category}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend verticalAlign="bottom" align="center" layout="horizontal" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold theme-text-primary uppercase tracking-widest">{t.topCategories}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                {stats.category.sort((a, b) => b.value - a.value).slice(0, 5).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-semibold theme-text-secondary truncate">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold theme-text-primary shrink-0">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
