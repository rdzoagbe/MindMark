import { useNavigate, useParams } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionForm } from '../components/SessionForm';

export function EditSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, updateSession } = useSessions();

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

  const handleSubmit = (data: any) => {
    updateSession(session.id, data);
    navigate(`/session/${session.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Session</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Update the context or next steps for this task.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <SessionForm initialData={session} onSubmit={handleSubmit} isEdit />
      </div>
    </div>
  );
}
