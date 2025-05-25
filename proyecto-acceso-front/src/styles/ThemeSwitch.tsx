import { useEffect } from 'react';
import { useTheme } from '../styles/ThemeContext';

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-3 select-none cursor-pointer">
            {/* Ícono Sol */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-50' : 'opacity-100'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h1M3 12H4m15.364 6.364l.707.707M6.343 6.343l.707.707m0 10.606l-.707.707m12.021-12.02l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>

            <label className="relative inline-flex items-center w-14 h-8">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    aria-label="Toggle Dark Mode"
                />
                <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300"></div>
                <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''
                        }`}
                />
            </label>

            {/* Ícono Luna */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-50'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
        </div>
    );
}
