import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Server, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const SECURITY_TRANSLATIONS: Record<string, any> = {
  English: {
    backHome: 'Home', backDashboard: 'Dashboard',
    title: 'Security & Privacy Policy',
    desc: 'How we protect your context and keep your data safe.',
    localTitle: 'Local First by Default',
    localDesc: 'MindMark operates entirely locally on your device by default. Data is stored in your browser\'s LocalStorage.',
    cloudTitle: 'Cloud Sync Security',
    cloudDesc: 'When using Cloud Sync, your data is securely stored using Google\'s Firebase infrastructure.',
    cloudPoints: [
      'Encryption in Transit: All data is encrypted via TLS (HTTPS).',
      'Encryption at Rest: Data is encrypted using AES-256.',
      'Strict Access Controls: Database rules prevent unauthorized access.'
    ],
    privacyTitle: 'Data Privacy',
    privacyDesc: 'We do not sell your data. We do not use your sessions to train AI models.',
    paymentTitle: 'Payment Security',
    paymentDesc: 'All payments are handled by Stripe. We do not store credit card info.'
  },
  French: {
    backHome: 'Accueil', backDashboard: 'Tableau de bord',
    title: 'Politique de Sécurité et Confidentialité',
    desc: 'Comment nous protégeons votre contexte et vos données.',
    localTitle: 'Local d\'abord par défaut',
    localDesc: 'MindMark fonctionne localement sur votre appareil. Les données sont stockées dans le LocalStorage de votre navigateur.',
    cloudTitle: 'Sécurité du Cloud Sync',
    cloudDesc: 'Avec Cloud Sync, vos données sont stockées sur l\'infrastructure Firebase de Google.',
    cloudPoints: [
      'Chiffrement en transit : Toutes les données sont chiffrées via TLS (HTTPS).',
      'Chiffrement au repos : Données chiffrées en AES-256.',
      'Contrôles d\'accès : Les règles de base de données empêchent les accès non autorisés.'
    ],
    privacyTitle: 'Confidentialité des données',
    privacyDesc: 'Nous ne vendons pas vos données. Nous n\'utilisons pas vos sessions pour entraîner des IA.',
    paymentTitle: 'Sécurité des paiements',
    paymentDesc: 'Tous les paiements sont gérés par Stripe. Nous ne stockons pas de cartes bancaires.'
  },
  Spanish: {
    backHome: 'Inicio', backDashboard: 'Panel',
    title: 'Política de Seguridad y Privacidad',
    desc: 'Cómo protegemos tu contexto y mantenemos tus datos seguros.',
    localTitle: 'Local primero por defecto',
    localDesc: 'MindMark funciona localmente en tu dispositivo. Los datos se guardan en el LocalStorage del navegador.',
    cloudTitle: 'Seguridad de Sincronización en la Nube',
    cloudDesc: 'Al usar Cloud Sync, tus datos se guardan de forma segura en la infraestructura Firebase de Google.',
    cloudPoints: [
      'Cifrado en tránsito: Datos cifrados vía TLS (HTTPS).',
      'Cifrado en reposo: Datos cifrados usando AES-256.',
      'Controles de acceso: Reglas estrictas para prevenir accesos no autorizados.'
    ],
    privacyTitle: 'Privacidad de Datos',
    privacyDesc: 'No vendemos tus datos. No usamos tus sesiones para entrenar modelos de IA.',
    paymentTitle: 'Seguridad de Pagos',
    paymentDesc: 'Todos los pagos son gestionados por Stripe. No guardamos información de tarjetas.'
  },
  Portuguese: {
    backHome: 'Início', backDashboard: 'Painel',
    title: 'Política de Segurança e Privacidade',
    desc: 'Como protegemos seu contexto e mantemos seus dados seguros.',
    localTitle: 'Local por Padrão',
    localDesc: 'O MindMark opera localmente no seu dispositivo por padrão. Os dados são armazenados no LocalStorage do navegador.',
    cloudTitle: 'Segurança do Cloud Sync',
    cloudDesc: 'Ao usar o Cloud Sync, seus dados são armazenados na infraestrutura Firebase do Google.',
    cloudPoints: [
      'Criptografia em Trânsito: Todos os dados são criptografados via TLS (HTTPS).',
      'Criptografia em Repouso: Dados criptografados usando AES-256.',
      'Controles de Acesso: Regras de banco de dados impedem acesso não autorizado.'
    ],
    privacyTitle: 'Privacidade de Dados',
    privacyDesc: 'Não vendemos seus dados. Não usamos suas sessões para treinar modelos de IA.',
    paymentTitle: 'Segurança de Pagamento',
    paymentDesc: 'Todos os pagamentos são processados pelo Stripe. Não armazenamos dados de cartão.'
  },
  Chinese: {
    backHome: '首页', backDashboard: '仪表板',
    title: '安全与隐私政策',
    desc: '我们如何保护您的上下文并确保您的数据安全。',
    localTitle: '默认本地优先',
    localDesc: 'MindMark 默认完全在您的设备本地运行。数据存储在浏览器的 LocalStorage 中。',
    cloudTitle: '云同步安全',
    cloudDesc: '使用云同步时，您的数据将安全地存储在 Google 的 Firebase 基础设施中。',
    cloudPoints: [
      '传输加密：所有数据通过 TLS (HTTPS) 加密。',
      '静态加密：数据使用 AES-256 加密。',
      '严格访问控制：数据库规则确保只有您可以访问自己的数据。'
    ],
    privacyTitle: '数据隐私',
    privacyDesc: '我们不出售您的数据。我们不使用您的会话内容训练 AI 模型。',
    paymentTitle: '支付安全',
    paymentDesc: '所有支付处理均由 Stripe 安全处理。我们不存储信用卡信息。'
  },
  German: {
    backHome: 'Startseite', backDashboard: 'Dashboard',
    title: 'Sicherheit & Datenschutz',
    desc: 'Wie wir Ihre Daten und Ihren Kontext schützen.',
    localTitle: 'Local First als Standard',
    localDesc: 'MindMark arbeitet standardmäßig lokal auf Ihrem Gerät. Daten werden im LocalStorage gespeichert.',
    cloudTitle: 'Cloud Sync Sicherheit',
    cloudDesc: 'Bei Cloud Sync werden Ihre Daten sicher in der Google Firebase Infrastruktur gespeichert.',
    cloudPoints: [
      'Verschlüsselung bei Übertragung: Alle Daten via TLS (HTTPS).',
      'Verschlüsselung im Ruhezustand: AES-256 Verschlüsselung.',
      'Zugriffskontrollen: Datenbank-Regeln verhindern unbefugten Zugriff.'
    ],
    privacyTitle: 'Datenschutz',
    privacyDesc: 'Wir verkaufen keine Daten. Wir trainieren keine KI mit Ihren Sitzungen.',
    paymentTitle: 'Zahlungssicherheit',
    paymentDesc: 'Zahlungen werden via Stripe abgewickelt. Wir speichern keine Kreditkartendaten.'
  }
};

export function SecurityPolicy() {
  const { isAuthenticated } = useAuth();
  const { preferredLanguage } = useLanguage();
  const t = SECURITY_TRANSLATIONS[preferredLanguage] || SECURITY_TRANSLATIONS['English'];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4 sm:px-6">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary pt-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="hover:text-indigo-600 transition-colors">
          {isAuthenticated ? t.backDashboard : t.backHome}
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="theme-text-primary">{t.title}</span>
      </div>

      <PageHeader 
        title={t.title} 
        description={t.desc}
      />

      <div className="space-y-8">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t.localTitle}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t.localDesc}
          </p>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t.cloudTitle}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t.cloudDesc}
          </p>
          <ul className="list-disc list-inside space-y-2 theme-text-secondary ml-4">
            {t.cloudPoints.map((point: string, i: number) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t.privacyTitle}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t.privacyDesc}
          </p>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">{t.paymentTitle}</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            {t.paymentDesc}
          </p>
        </Card>
      </div>
    </div>
  );
}
