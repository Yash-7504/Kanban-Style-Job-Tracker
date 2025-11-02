'use client';

import { useTheme } from '@/contexts/ThemeContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 dark:from-indigo-600 dark:to-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl group"
      aria-label="Toggle theme"
    >
      {/* Toggle Circle */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        {theme === 'light' ? (
          <SunIcon width={16} height={16} color="#F59E0B" className="animate-pulse" />
        ) : (
          <MoonIcon width={16} height={16} color="#6366F1" className="animate-pulse" />
        )}
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <SunIcon
          width={14}
          height={14}
          color="white"
          className={`transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-70'}`}
        />
        <MoonIcon
          width={14}
          height={14}
          color="white"
          className={`transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-70'}`}
        />
      </div>
    </button>
  );
}