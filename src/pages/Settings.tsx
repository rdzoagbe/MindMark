import React, { useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../contexts/SessionContext';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { signOut } from '../services/authService';
import { Moon, Sun, Download, Upload, Monitor, Trash2, AlertTriangle, Sparkles, CreditCard, LogOut, User, Cloud, CheckCircle2, ChevronRight, Globe } from 'lucide-react';
import { exportImport } from '../utils/exportImport';
import { PlanBadge } from '../components/PlanBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';

const SETTINGS_TRANSLATIONS: Record<string, any> = {
  English: {
    title: 'Settings', desc: 'Manage your account, preferences, and data.', 
    account: 'Account', guest: 'Guest Mode', guestDesc: 'Your data is stored locally on this device.', signin: 'Sign In', createAcc: 'Create Account', signout: 'Sign Out',
    loggedInVia: 'Logged in via Email',
    subscription: 'Subscription', activeSub: 'Active subscription', limitedFeatures: 'Limited features', manageSub: 'Manage Subscription', planDesc: 'Update billing info or cancel your plan.', upgradePlan: 'Upgrade Plan',
    simulateTitle: 'Simulate Plan Access', simulateDesc: 'Developer tool to test feature gating without Stripe.',
    cloudSync: 'Cloud Sync', active: 'Active', available: 'Available', syncReady: 'Your data is being synced', syncReadyDesc: 'All your sessions are securely backed up and available across all your devices in real-time.', multiDevice: 'Multi-device Continuity', multiDeviceDesc: 'Upgrade to Pro and create an account to keep your context available across all your devices.', syncCreateAcc: 'Create account to sync across devices',
    localization: 'Localization', prefLang: 'Preferred Language', langDesc: 'Used for AI translation, grammar correction, and UI components.', saving: 'Saving...',
    appearance: 'Appearance', theme: 'Theme', themeDesc: 'Toggle between light and dark mode.', light: 'Light', dark: 'Dark',
    dataMgmt: 'Data Management', export: 'Export Data', exportDesc: 'Download all your sessions as a JSON file.', exportBtn: 'Export JSON', import: 'Import Data', importDesc: 'Restore sessions from a JSON file.', importBtn: 'Import JSON',
    dangerZone: 'Danger Zone', clearAll: 'Clear All Data', clearAllDesc: 'Permanently delete all sessions from this device.', clearConfirm: 'Are you sure you want to clear ALL sessions? This cannot be undone.', clearSuccess: 'All data cleared successfully.', clearError: 'Failed to clear data.',
    importSuccess: 'Sessions imported successfully!', importError: 'Failed to import sessions.'
  },
  French: {
    title: 'Paramètres', desc: 'Gérez votre compte, vos préférences et vos données.', 
    account: 'Compte', guest: 'Mode invité', guestDesc: 'Vos données sont stockées localement.', signin: 'Connexion', createAcc: 'Créer un compte', signout: 'Déconnexion',
    loggedInVia: 'Connecté via Email',
    subscription: 'Abonnement', activeSub: 'Abonnement actif', limitedFeatures: 'Fonctionnalités limitées', manageSub: 'Gérer l\'abonnement', planDesc: 'Mettez à jour les infos de facturation ou annulez.', upgradePlan: 'Améliorer le forfait',
    simulateTitle: 'Simuler l\'accès au forfait', simulateDesc: 'Outil de développement pour tester sans Stripe.',
    cloudSync: 'Synchronisation Cloud', active: 'Actif', available: 'Disponible', syncReady: 'Vos données sont synchronisées', syncReadyDesc: 'Toutes vos sessions sont sauvegardées et disponibles sur tous vos appareils.', multiDevice: 'Continuité multi-appareils', multiDeviceDesc: 'Passez à Pro pour garder votre contexte sur tous vos appareils.', syncCreateAcc: 'Créer un compte pour synchroniser',
    localization: 'Localisation', prefLang: 'Langue préférée', langDesc: 'Utilisée pour la traduction IA et l\'interface.', saving: 'Enregistrement...',
    appearance: 'Apparence', theme: 'Thème', themeDesc: 'Basculez entre le mode clair et sombre.', light: 'Clair', dark: 'Sombre',
    dataMgmt: 'Gestion des données', export: 'Exporter les données', exportDesc: 'Téléchargez vos sessions en JSON.', exportBtn: 'Exporter JSON', import: 'Importer les données', importDesc: 'Restaurer des sessions depuis JSON.', importBtn: 'Importer JSON',
    dangerZone: 'Zone de danger', clearAll: 'Effacer toutes les données', clearAllDesc: 'Supprimer définitivement toutes les sessions de cet appareil.', clearConfirm: 'Êtes-vous sûr ? Cela est irréversible.', clearSuccess: 'Données supprimées avec succès.', clearError: 'Échec de la suppression.',
    importSuccess: 'Sessions importées avec succès !', importError: 'Échec de l\'importation.'
  },
  Spanish: {
    title: 'Ajustes', desc: 'Gestiona tu cuenta, preferencias y datos.', 
    account: 'Cuenta', guest: 'Modo invitado', guestDesc: 'Tus datos se almacenan localmente.', signin: 'Iniciar sesión', createAcc: 'Crear cuenta', signout: 'Cerrar sesión',
    loggedInVia: 'Sesión iniciada vía Email',
    subscription: 'Suscripción', activeSub: 'Suscripción activa', limitedFeatures: 'Funciones limitadas', manageSub: 'Gestionar suscripción', planDesc: 'Actualiza facturación o cancela tu plan.', upgradePlan: 'Mejorar Plan',
    simulateTitle: 'Simular Acceso', simulateDesc: 'Herramienta de desarrollo para probar sin Stripe.',
    cloudSync: 'Sincronización Cloud', active: 'Activo', available: 'Disponible', syncReady: 'Tus datos se están sincronizando', syncReadyDesc: 'Tus sesiones están respaldadas y disponibles en tiempo real.', multiDevice: 'Continuidad multi-dispositivo', multiDeviceDesc: 'Mejora a Pro para tener tu contexto en todos tus dispositivos.', syncCreateAcc: 'Crea una cuenta para sincronizar',
    localization: 'Localización', prefLang: 'Idioma Preferido', langDesc: 'Usado para traducción IA y componentes UI.', saving: 'Guardando...',
    appearance: 'Apariencia', theme: 'Tema', themeDesc: 'Cambiar entre modo claro y oscuro.', light: 'Claro', dark: 'Oscuro',
    dataMgmt: 'Gestión de Datos', export: 'Exportar Datos', exportDesc: 'Descarga tus sesiones en un archivo JSON.', exportBtn: 'Exportar JSON', import: 'Importar Datos', importDesc: 'Restaura sesiones desde JSON.', importBtn: 'Importar JSON',
    dangerZone: 'Zona de Peligro', clearAll: 'Borrar Todos los Datos', clearAllDesc: 'Eliminar permanentemente todas las sesiones de este dispositivo.', clearConfirm: '¿Estás seguro? Esto no se puede deshacer.', clearSuccess: 'Datos borrados con éxito.', clearError: 'Error al borrar datos.',
    importSuccess: '¡Sesiones importadas con éxito!', importError: 'Error al importar sesiones.'
  },
  Portuguese: {
    title: 'Configurações', desc: 'Gerencie sua conta, preferências e dados.', 
    account: 'Conta', guest: 'Modo visitante', guestDesc: 'Seus dados são armazenados localmente.', signin: 'Entrar', createAcc: 'Criar conta', signout: 'Sair',
    loggedInVia: 'Logado via Email',
    subscription: 'Assinatura', activeSub: 'Assinatura ativa', limitedFeatures: 'Recursos limitados', manageSub: 'Gerenciar Assinatura', planDesc: 'Atualize faturamento ou cancele seu plano.', upgradePlan: 'Atualizar Plano',
    simulateTitle: 'Simular Acesso', simulateDesc: 'Ferramenta de desenvolvedor para testar sem Stripe.',
    cloudSync: 'Cloud Sync', active: 'Ativo', available: 'Disponível', syncReady: 'Seus dados estão sendo sincronizados', syncReadyDesc: 'Todas as suas sessões estão seguras e disponíveis em todos os dispositivos.', multiDevice: 'Continuidade multi-dispositivo', multiDeviceDesc: 'Mude para Pro para manter seu contexto em todos os dispositivos.', syncCreateAcc: 'Crie conta para sincronizar',
    localization: 'Localização', prefLang: 'Idioma Preferido', langDesc: 'Usado para tradução de IA e componentes.', saving: 'Salvando...',
    appearance: 'Aparência', theme: 'Tema', themeDesc: 'Alternar entre modo claro e escuro.', light: 'Claro', dark: 'Escuro',
    dataMgmt: 'Gerenciamento de Dados', export: 'Exportar Dados', exportDesc: 'Baixe todas as suas sessões como JSON.', exportBtn: 'Exportar JSON', import: 'Importar Dados', importDesc: 'Restaure sessões de um arquivo JSON.', importBtn: 'Importar JSON',
    dangerZone: 'Zona de Perigo', clearAll: 'Limpar todos os dados', clearAllDesc: 'Excluir permanentemente todas as sessões deste dispositivo.', clearConfirm: 'Tem certeza? Isso não pode ser desfeito.', clearSuccess: 'Dados limpos com sucesso.', clearError: 'Falha ao limpar dados.',
    importSuccess: 'Sessões importadas com sucesso!', importError: 'Falha ao importar sessões.'
  },
  Chinese: {
    title: '设置', desc: '管理您的帐户、偏好和数据。', 
    account: '帐户', guest: '访客模式', guestDesc: '您的数据本地存储。', signin: '登录', createAcc: '创建帐户', signout: '登出',
    loggedInVia: '通过电子邮件登录',
    subscription: '订阅', activeSub: '有效订阅', limitedFeatures: '功能受限', manageSub: '管理订阅', planDesc: '更新账单信息或取消计划。', upgradePlan: '升级计划',
    simulateTitle: '模拟计划访问', simulateDesc: '开发人员工具，用于在没有 Stripe 的情况下测试功能门控。',
    cloudSync: '云同步', active: '激活', available: '可用', syncReady: '您的数据正在同步', syncReadyDesc: '您的所有会话均已安全备份并实时在所有设备上可用。', multiDevice: '多设备连续性', multiDeviceDesc: '升级到 Pro 并创建帐户以在所有设备上保持上下文。', syncCreateAcc: '创建帐户以跨设备同步',
    localization: '本地化', prefLang: '首选语言', langDesc: '用于 AI 翻译、语法纠正和 UI 组件。', saving: '保存中...',
    appearance: '外观', theme: '主题', themeDesc: '在明亮和黑暗模式之间切换。', light: '明亮', dark: '黑暗',
    dataMgmt: '数据管理', export: '导出数据', exportDesc: '将您的所有会话下载为 JSON 文件。', exportBtn: '导出 JSON', import: '导入数据', importDesc: '从 JSON 文件恢复会话。', importBtn: '导入 JSON',
    dangerZone: '危险区域', clearAll: '清除所有数据', clearAllDesc: '永久删除此设备上的所有会话。', clearConfirm: '您确定要清除所有会话吗？此操作无法撤销。', clearSuccess: '所有数据已成功清除。', clearError: '清除数据失败。',
    importSuccess: '会话已成功导入！', importError: '导入会话失败。'
  },
  German: {
    title: 'Einstellungen', desc: 'Verwalten Sie Ihr Konto, Einstellungen und Daten.', 
    account: 'Konto', guest: 'Gastmodus', guestDesc: 'Ihre Daten werden lokal gespeichert.', signin: 'Anmelden', createAcc: 'Konto erstellen', signout: 'Abmelden',
    loggedInVia: 'Eingeloggt per Email',
    subscription: 'Abonnement', activeSub: 'Aktives Abo', limitedFeatures: 'Eingeschränkt', manageSub: 'Abo verwalten', planDesc: 'Zahlungsinfo ändern oder kündigen.', upgradePlan: 'Upgrade Plan',
    simulateTitle: 'Plan-Zugang simulieren', simulateDesc: 'Entwickler-Tool zum Testen ohne Stripe.',
    cloudSync: 'Cloud Sync', active: 'Aktiv', available: 'Verfügbar', syncReady: 'Daten werden synchronisiert', syncReadyDesc: 'Alle Sitzungen sind sicher gesichert und auf allen Geräten verfügbar.', multiDevice: 'Geräteübergreifend', multiDeviceDesc: 'Upgrade auf Pro für Synchronisierung.', syncCreateAcc: 'Konto zur Synchronisierung erstellen',
    localization: 'Lokalisierung', prefLang: 'Bevorzugte Sprache', langDesc: 'Nutzung für KI-Übersetzung und UI.', saving: 'Speichern...',
    appearance: 'Erscheinungsbild', theme: 'Design', themeDesc: 'Zwischen Hell und Dunkel wechseln.', light: 'Hell', dark: 'Dunkel',
    dataMgmt: 'Datenverwaltung', export: 'Daten exportieren', exportDesc: 'Alle Sitzungen als JSON laden.', exportBtn: 'JSON Export', import: 'Daten importieren', importDesc: 'Sitzungen aus JSON laden.', importBtn: 'JSON Import',
    dangerZone: 'Gefahrenzone', clearAll: 'Alle Daten löschen', clearAllDesc: 'Alle Sitzungen unwiderruflich löschen.', clearConfirm: 'Sind Sie sicher? Dies kann nicht rückgängig gemacht werden.', clearSuccess: 'Daten gelöscht.', clearError: 'Fehler beim Löschen.',
    importSuccess: 'Sitzungen erfolgreich importiert!', importError: 'Import fehlgeschlagen.'
  }
};

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { sessions, importSessions, clearAllData } = useSessions();
  const { currentPlan, isFree, upgrade } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const { preferredLanguage, handleLanguageChange, isSavingLanguage, LANGUAGES } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [managingSubscription, setManagingSubscription] = useState(false);

  const t = SETTINGS_TRANSLATIONS[preferredLanguage] || SETTINGS_TRANSLATIONS['English'];

  const handleExport = () => {
    exportImport.exportToJson(sessions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await exportImport.importFromJson(file);
      importSessions(imported);
      setImportMessage({ type: 'success', text: t.importSuccess });
    } catch (error) {
      setImportMessage({ type: 'error', text: error instanceof Error ? error.message : t.importError });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => setImportMessage(null), 5000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm(t.clearConfirm)) {
      try {
        await clearAllData();
        localStorage.removeItem('mindmark-onboarding-completed');
        setImportMessage({ type: 'success', text: t.clearSuccess });
        setTimeout(() => setImportMessage(null), 5000);
      } catch (error) {
        setImportMessage({ type: 'error', text: error instanceof Error ? error.message : t.clearError });
        setTimeout(() => setImportMessage(null), 5000);
      }
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setManagingSubscription(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Billing portal is only available on full-stack deployments. Static hosting (like GitHub Pages) does not support the required Node.js backend.');
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error managing subscription:', error);
      setImportMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to reach billing portal.' 
      });
      setTimeout(() => setImportMessage(null), 5000);
    } finally {
      setManagingSubscription(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="theme-text-primary">{t.title}</span>
      </div>

      <PageHeader 
        title={t.title} 
        description={t.desc}
      />

      <Card padding="none" className="divide-y theme-border">
        {/* Account Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t.account}</h2>
          </div>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-semibold theme-text-primary">{user?.email}</p>
                  <p className="text-sm theme-text-secondary">{t.loggedInVia}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                icon={LogOut}
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-200 dark:border-rose-900/30"
              >
                {t.signout}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t.guest}</p>
                <p className="text-sm theme-text-secondary">{t.guestDesc}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => navigate('/login')}>
                  {t.signin}
                </Button>
                <Button size="md" onClick={() => navigate('/signup')}>
                  {t.createAcc}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t.subscription}</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${!isFree ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                {!isFree ? <Sparkles className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold theme-text-primary capitalize">
                    {currentPlan} Plan
                  </p>
                  <PlanBadge plan={currentPlan} size="sm" />
                </div>
                <p className="text-sm theme-text-secondary">
                  {!isFree ? t.activeSub : t.limitedFeatures}
                </p>
              </div>
            </div>
            {!isFree ? (
              <div className="flex flex-col items-end gap-2">
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={handleManageSubscription}
                  loading={managingSubscription}
                >
                  {t.manageSub}
                </Button>
                <p className="text-xs theme-text-secondary text-right">
                  {t.planDesc}
                </p>
              </div>
            ) : (
              <Button size="md" onClick={() => navigate('/pricing')} icon={Sparkles}>
                {t.upgradePlan}
              </Button>
            )}
          </div>

          {/* Developer Fallback for Testing */}
          <div className="mt-8 pt-8 border-t theme-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t.simulateTitle}</p>
                <p className="text-sm theme-text-secondary">{t.simulateDesc}</p>
              </div>
              <div className="relative">
                <select
                  value={currentPlan}
                  onChange={(e) => upgrade(e.target.value as any)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm font-medium theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                >
                  <option value="free">Free Plan</option>
                  <option value="plus">Plus Plan</option>
                  <option value="premium">Premium Plan</option>
                  <option value="pro">Pro Plan</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Sync */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Cloud className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold theme-text-primary">{t.cloudSync}</h2>
            </div>
            {isAuthenticated ? (
              <Badge variant="green" icon={CheckCircle2}>{t.active}</Badge>
            ) : (
              <Badge variant="indigo">{t.available}</Badge>
            )}
          </div>
          
          <div className="text-center space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${isAuthenticated ? 'text-emerald-500' : 'text-indigo-500'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold theme-text-primary">
                {isAuthenticated ? t.syncReady : t.multiDevice}
              </p>
              <p className="text-sm theme-text-secondary max-w-md mx-auto leading-relaxed">
                {isAuthenticated 
                  ? t.syncReadyDesc
                  : t.multiDeviceDesc}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t.syncCreateAcc} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Appearance & Localization */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t.localization}</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border mb-6">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">{t.prefLang}</p>
              <p className="text-sm theme-text-secondary">{t.langDesc}</p>
            </div>
            <div className="flex items-center gap-4">
              {isSavingLanguage && <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{t.saving}</span>}
              <div className="relative">
                <select
                  value={preferredLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-4 py-2 pr-10 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm font-medium theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer min-w-[140px]"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8 mt-12">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t.appearance}</h2>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">{t.theme}</p>
              <p className="text-sm theme-text-secondary">{t.themeDesc}</p>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <Sun className="w-4 h-4" />
                {t.light}
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-900 text-indigo-400 shadow-sm' 
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <Moon className="w-4 h-4" />
                {t.dark}
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center theme-text-secondary">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t.dataMgmt}</h2>
          </div>
          
          <div className="space-y-4">
            {importMessage && (
              <div className={`p-4 rounded-xl text-sm font-medium ${importMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {importMessage.text}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t.export}</p>
                <p className="text-sm theme-text-secondary">{t.exportDesc}</p>
              </div>
              <Button variant="outline" size="md" icon={Download} onClick={handleExport}>
                {t.exportBtn}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t.import}</p>
                <p className="text-sm theme-text-secondary">{t.importDesc}</p>
              </div>
              <Button variant="outline" size="md" icon={Upload} onClick={handleImportClick}>
                {t.importBtn}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-8 sm:p-10 bg-rose-50/50 dark:bg-rose-900/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">{t.dangerZone}</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-rose-200 dark:border-rose-900/20">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">{t.clearAll}</p>
              <p className="text-sm theme-text-secondary">{t.clearAllDesc}</p>
            </div>
            <Button variant="danger" size="md" icon={Trash2} onClick={handleClearAllData}>
              {t.clearAll}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
