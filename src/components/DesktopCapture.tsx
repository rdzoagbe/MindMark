import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  FileUp, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  File as FileIcon,
  X
} from 'lucide-react';
import { useSessions } from '../contexts/SessionContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

declare global {
  interface Window {
    electronAPI?: {
      getActiveWindow: () => Promise<string>;
    };
  }
}

export function DesktopCapture() {
  const { addSession } = useSessions();
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [dropState, setDropState] = useState<'idle' | 'hovering' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Poll for active window if in Electron
  useEffect(() => {
    if (!window.electronAPI) return;

    const interval = setInterval(async () => {
      const windowTitle = await window.electronAPI!.getActiveWindow();
      setActiveWindow(windowTitle);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCaptureActiveWindow = async () => {
    if (!activeWindow) return;
    
    setIsCapturing(true);
    try {
      await addSession({
        title: `Desktop: ${activeWindow}`,
        category: 'Desktop Capture',
        currentTask: 'Researching in desktop application',
        pauseReason: 'Desktop Context Captured',
        nextStep: 'Resume context from local session',
        notes: `Captured from active desktop window: ${activeWindow}`,
        tags: ['desktop', 'local-capture'],
        links: [],
        priority: 'medium',
        status: 'active',
        pinned: false
      });
      setDropState('success');
      setTimeout(() => setDropState('idle'), 3000);
    } catch (error) {
      setDropState('error');
      setErrorMessage('Failed to capture session');
    } finally {
      setIsCapturing(false);
    }
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDropState('processing');
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(f => 
      f.name.endsWith('.pdf') || 
      f.name.endsWith('.docx') || 
      f.name.endsWith('.doc')
    );

    if (validFiles.length === 0) {
      setErrorMessage('Please drop only .pdf or .docx files');
      setDropState('error');
      setTimeout(() => setDropState('idle'), 3000);
      return;
    }

    try {
      for (const file of validFiles) {
        await addSession({
          title: `Local File: ${file.name}`,
          category: 'File Capture',
          currentTask: `Reviewing ${file.name}`,
          pauseReason: 'Local File Context',
          nextStep: 'Continue analysis of local document',
          notes: `Metadata captured from local file drop. Name: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB, Last Modified: ${new Date(file.lastModified).toLocaleString()}`,
          tags: ['local-file', 'research'],
          links: [],
          priority: 'medium',
          status: 'active',
          pinned: false
        });
      }
      setDropState('success');
      setTimeout(() => setDropState('idle'), 3000);
    } catch (error) {
      setDropState('error');
      setErrorMessage('Failed to process files');
    }
  }, [addSession]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold theme-text-primary">Desktop Capture</h2>
            <p className="text-xs theme-text-secondary">Capture context from other desktop apps</p>
          </div>
        </div>
        {window.electronAPI ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Connected to Desktop
          </div>
        ) : (
          <div className="text-[10px] theme-text-secondary uppercase tracking-widest font-bold">
            Web Mode Only
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Window Capture */}
        <Card className="p-6 space-y-4 border-dashed relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold theme-text-secondary uppercase tracking-widest">Active App</span>
          </div>
          
          <div className="min-h-[60px] flex flex-col justify-center">
            {activeWindow ? (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold theme-text-primary line-clamp-2"
              >
                {activeWindow}
              </motion.p>
            ) : (
              <p className="text-sm theme-text-secondary italic">
                {window.electronAPI ? 'Searching for active application...' : 'Install MindMark Desktop to capture apps'}
              </p>
            )}
          </div>

          <Button 
            variant={activeWindow ? 'primary' : 'ghost'} 
            className="w-full"
            disabled={!activeWindow || isCapturing}
            onClick={handleCaptureActiveWindow}
            icon={Plus}
          >
            {isCapturing ? 'Capturing...' : 'Capture Active Session'}
          </Button>
        </Card>

        {/* File Drop Area */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDropState('hovering'); }}
          onDragLeave={() => setDropState('idle')}
          onDrop={onDrop}
        >
          <Card 
            className={`h-full space-y-4 border-dashed transition-all duration-300 relative ${
              dropState === 'hovering' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                dropState === 'hovering' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                <FileUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold theme-text-secondary uppercase tracking-widest">Local Files</span>
            </div>

            <div className="text-center py-2">
              <AnimatePresence mode="wait">
                {dropState === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <p className="text-xs font-bold text-emerald-600">Session Recorded!</p>
                  </motion.div>
                ) : dropState === 'error' ? (
                  <motion.div 
                    key="error"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                    <p className="text-xs font-bold text-rose-600 truncate max-w-full px-2">{errorMessage}</p>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="space-y-1">
                    <p className="text-sm font-semibold theme-text-primary">Drop PDF or DOCX</p>
                    <p className="text-[10px] theme-text-secondary">Extract metadata for local session</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border theme-border">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border theme-border">
                <FileIcon className="w-3.5 h-3.5 text-indigo-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
