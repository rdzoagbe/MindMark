export type SessionStatus = 'active' | 'archived' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface SessionLink {
  id: string;
  label: string;
  url: string;
  comment?: string;
}

export interface Session {
  id: string;
  title: string;
  category: string;
  description: string;
  currentTask: string;
  pauseReason: string;
  nextStep: string;
  notes: string;
  tags: string[];
  links: SessionLink[];
  priority: Priority;
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
}
