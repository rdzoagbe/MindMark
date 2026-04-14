import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionForm } from '../components/SessionForm';
import { analytics } from '../services/analytics';

export function CreateSession() {
  const navigate = useNavigate();
  const { addSession } = useSessions();

  const handleSubmit = async (data: any) => {
    await addSession(data);
    analytics.track('session_created', { category: data.category, priority: data.priority });
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <SessionForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/')} 
      />
    </div>
  );
}
