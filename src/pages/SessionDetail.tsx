import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { 
  ArrowLeft, Edit2, Trash2, Clock, Calendar, 
  ArrowRightCircle, CheckCircle2, Archive, Copy, 
  ExternalLink, Tag, Info, AlertCircle, MessageSquare
} from 'lucide-react';

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, deleteSession, updateSession, duplicateSession } = useSessions();

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Session not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(session.id);
      navigate('/');
    }
  };

  const handleArchive = () => {
    updateSession(session.id, { status: 'archived' });
    navigate('/');
  };

  const handleDuplicate = () => {
    const newSession = duplicateSession(session.id);
    if (newSession) {
      navigate(`/session/${newSession.id}`);
    }
  };

  const handleComplete = () => {
    updateSession(session.id, { status: 'completed' });
    navigate('/');
  };

  const createdDate = new Date(session.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const updatedTime = new Date(session.updatedAt).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            className="p-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
            title="Duplicate Session"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleArchive}
            className="p-2.5 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all"
            title="Archive Session"
          >
            <Archive className="w-4 h-4" />
          </button>
          <Link
            to={`/edit/${session.id}`}
            className="p-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
            title="Edit Session"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
            title="Delete Session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-6">
            {session.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {session.category}
              </span>
            )}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              session.priority === 'high' ? 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
              session.priority === 'medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
              'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            }`}>
              {session.priority} Priority
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {session.title}
          </h1>
          {session.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {session.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Created on {createdDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Last updated at {updatedTime}
            </span>
          </div>
        </div>

        {/* Next Step Highlight */}
        <div className="bg-indigo-600 dark:bg-indigo-500 p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <h2 className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <ArrowRightCircle className="w-5 h-5" />
            Exact Next Step
          </h2>
          <p className="text-2xl sm:text-3xl font-bold leading-tight relative z-10">
            {session.nextStep}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Current Task & Pause Reason */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <section>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-500" />
                  Where I left off
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {session.currentTask || 'No task details provided.'}
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Why I stopped
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {session.pauseReason || 'No reason provided.'}
                </p>
              </section>
            </div>

            {/* Notes */}
            {session.notes && (
              <section>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  Additional Notes
                </h3>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {session.notes}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Links */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-indigo-500" />
                References
              </h3>
              {session.links && session.links.length > 0 ? (
                <div className="space-y-3">
                  {session.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all group shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {link.label || 'Link'}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </div>
                      {link.comment && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {link.comment}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No reference links.</p>
              )}
            </section>

            {/* Tags */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {session.tags && session.tags.length > 0 ? (
                  session.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No tags.</p>
                )}
              </div>
            </section>
          </div>
        </div>
        
        {/* Action Footer */}
        <div className="p-8 sm:p-10 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Ready to close this context?
          </div>
          <button
            onClick={handleComplete}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Mark as Done & Archive
          </button>
        </div>
      </div>
    </div>
  );
}
