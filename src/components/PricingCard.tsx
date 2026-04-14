import { Check, Sparkles } from 'lucide-react';

interface FeatureItem {
  text: string;
  comingSoon?: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: (string | FeatureItem)[];
  highlight?: boolean;
  onUpgrade?: () => void;
  isCurrent?: boolean;
  ctaLabel?: string;
  footerNote?: string;
}

export function PricingCard({ title, price, description, features, highlight, onUpgrade, isCurrent, ctaLabel, footerNote }: PricingCardProps) {
  return (
    <div className={`flex flex-col p-8 rounded-[2.5rem] border transition-all duration-300 ${
      highlight 
        ? 'bg-white dark:bg-gray-800 border-indigo-500 shadow-2xl scale-105 z-10 ring-4 ring-indigo-50 dark:ring-indigo-900/20' 
        : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        {highlight && (
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        )}
      </div>
      
      <div className="mb-6">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{price}</span>
        {price.includes('€') && <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => {
          const isObject = typeof feature === 'object';
          const text = isObject ? feature.text : feature;
          const comingSoon = isObject ? feature.comingSoon : false;

          return (
            <li key={i} className={`flex items-start gap-3 text-sm ${comingSoon ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
              <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${comingSoon ? 'bg-gray-100 dark:bg-gray-800' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
                <Check className={`w-3 h-3 ${comingSoon ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span>{text}</span>
                {comingSoon && (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    Soon
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      
      <div className="space-y-4">
        <button
          onClick={onUpgrade}
          disabled={isCurrent}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
            isCurrent
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-default'
              : highlight
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {isCurrent ? 'Current Plan' : ctaLabel || 'Upgrade'}
        </button>
        
        {footerNote && (
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 italic">
            {footerNote}
          </p>
        )}
      </div>
    </div>
  );
}
