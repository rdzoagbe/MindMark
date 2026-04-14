import { useNavigate, useParams } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionForm } from '../components/SessionForm';
import { EmptyState } from '../components/EmptyState';
import { FileQuestion } from 'lucide-react';

export function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, updateSession } = useSessions();

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="py-20">
        <EmptyState
          icon={FileQuestion}
          title="Session Not Found"
          description="The session you are trying to edit does not exist or has been deleted."
          action={{
            label: "Go back home",
            onClick: () => navigate('/')
          }}
        />
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    await updateSession(session.id, data);
    navigate(`/session/${session.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <SessionForm 
        initialData={session} 
        onSubmit={handleSubmit} 
        onCancel={() => navigate(`/session/${session.id}`)} 
      />
    </div>
  );
}
