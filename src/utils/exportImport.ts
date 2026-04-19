import { Session } from '../types';

export const exportImport = {
  exportToJson: (sessions: Session[]) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
<<<<<<< HEAD
    downloadAnchorNode.setAttribute("download", `mindmark-backup-${new Date().toISOString().split('T')[0]}.json`);
=======
    downloadAnchorNode.setAttribute("download", `context-saver-backup-${new Date().toISOString().split('T')[0]}.json`);
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },

  importFromJson: (file: File): Promise<Session[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            resolve(data);
          } else {
            reject(new Error('Invalid backup file format. Expected an array of sessions.'));
          }
        } catch (error) {
          reject(new Error('Failed to parse backup file. Ensure it is a valid JSON.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }
};
