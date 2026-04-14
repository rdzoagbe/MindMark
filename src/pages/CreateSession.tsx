import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionForm } from '../components/SessionForm';

export function CreateSession() {
  const navigate = useNavigate();
  const { addSession } = useSessions();

  const handleSubmit = (data: any) => {
    const newSession = addSession(data);
    navigate(`/session/${newSession.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Capture Context</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Save your current state so you can resume instantly later.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <SessionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
