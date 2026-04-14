import React, { useState } from 'react';
import { Session, SessionLink, Priority, SessionStatus } from '../types';
import { Save, X, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionFormProps {
  initialData?: Session;
  onSubmit: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isEdit?: boolean;
}

export function SessionForm({ initialData, onSubmit, isEdit = false }: SessionFormProps) {
  const navigate = useNavigate();
  
  // Basic Fields
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [currentTask, setCurrentTask] = useState(initialData?.currentTask || '');
  const [pauseReason, setPauseReason] = useState(initialData?.pauseReason || '');
  const [nextStep, setNextStep] = useState(initialData?.nextStep || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [status, setStatus] = useState<SessionStatus>(initialData?.status || 'active');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  
  // Dynamic Links
  const [links, setLinks] = useState<SessionLink[]>(initialData?.links || []);

  const addLink = () => {
    setLinks([...links, { id: crypto.randomUUID(), label: '', url: '', comment: '' }]);
  };

  const updateLink = (id: string, field: keyof SessionLink, value: string) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
      
    onSubmit({
      title,
      category,
      description,
      currentTask,
      pauseReason,
      nextStep,
      notes,
      tags,
      links: links.filter(l => l.url.trim() !== ''),
      priority,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Session Title *
          </label>
          <input
            type="text"
            id="title"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
            placeholder="e.g., Q3 Marketing Strategy Refinement"
          />
        </div>

        {/* Category & Priority */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
            placeholder="e.g., Work, Personal, Side Project"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brief Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
            placeholder="What is this session about?"
          />
        </div>

        {/* Current Task & Pause Reason */}
        <div>
          <label htmlFor="currentTask" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Task (What were you doing?)
          </label>
          <textarea
            id="currentTask"
            rows={3}
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
            placeholder="e.g., Analyzing the user feedback from the last sprint."
          />
        </div>

        <div>
          <label htmlFor="pauseReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pause Reason (Why did you stop?)
          </label>
          <textarea
            id="pauseReason"
            rows={3}
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
            placeholder="e.g., Unexpected meeting, end of day, distraction."
          />
        </div>
      </div>

      {/* Next Step - Highlighted */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
        <label htmlFor="nextStep" className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">
          Exact Next Step *
        </label>
        <p className="text-xs text-indigo-700 dark:text-indigo-400 mb-3">
          What is the very first thing you need to do when you resume?
        </p>
        <input
          type="text"
          id="nextStep"
          required
          value={nextStep}
          onChange={(e) => setNextStep(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all text-lg font-medium"
          placeholder="e.g., Open the 'feedback.xlsx' and filter by 'critical' issues."
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
          placeholder="Any other details to help you remember the context..."
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
          placeholder="e.g., work, urgent, research"
        />
      </div>

      {/* Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reference Links
          </label>
          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Link
          </button>
        </div>
        
        {links.length > 0 ? (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                      className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      placeholder="Label (e.g., Figma File)"
                    />
                    <div className="relative">
                      <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="URL (https://...)"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={link.comment}
                    onChange={(e) => updateLink(link.id, 'comment', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="Optional comment..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="self-end sm:self-center p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">No links added yet.</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isEdit ? 'Save Changes' : 'Save Session'}
        </button>
      </div>
    </form>
  );
}
