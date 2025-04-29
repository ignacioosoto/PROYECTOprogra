// src/components/ThemeSync.tsx
import { useEffect } from 'react';
import { useTheme } from '../styles/ThemeContext';

export default function ThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = ''; // elimina todas las clases anteriores
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    }
  }, [theme]);

  return null; // No renderiza nada en el DOM
}
