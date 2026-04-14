import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '../types';
import { Clock, ArrowRightCircle } from 'lucide-react';

interface SessionCardProps {
  session: Session;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const date = new Date(session.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const priorityColors = {
    low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <Link
      to={`/session/${session.id}`}
      className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            {session.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {session.category}
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {session.title}
            </h3>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${priorityColors[session.priority]}`}>
            {session.priority}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-5 min-h-[2.5rem]">
          {session.description || session.currentTask || 'No description provided.'}
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 flex items-start gap-3 border border-indigo-100 dark:border-indigo-800/50">
          <ArrowRightCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 line-clamp-1">
            <span className="text-indigo-700 dark:text-indigo-300 font-bold mr-1.5 uppercase text-[10px] tracking-wider">Next:</span>
            {session.nextStep}
          </div>
        </div>
        
        <div className="mt-5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {session.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                #{tag}
              </span>
            ))}
            {session.tags && session.tags.length > 2 && (
              <span className="text-[10px] text-gray-400">+{session.tags.length - 2} more</span>
            )}
          </div>
          <span className="flex items-center text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
            <Clock className="w-3 h-3 mr-1" />
            {date}
          </span>
        </div>
      </div>
    </Link>
  );
};
