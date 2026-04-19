import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
<<<<<<< HEAD
    const stored = localStorage.getItem('mindmark-theme');
=======
    const stored = localStorage.getItem('context-saver-theme');
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
<<<<<<< HEAD
    localStorage.setItem('mindmark-theme', theme);
=======
    localStorage.setItem('context-saver-theme', theme);
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
