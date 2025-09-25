import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PaletteIcon, CheckIcon } from './Icons';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (themeKey: string) => {
    setTheme(themeKey);
    setIsOpen(false);
  };
  
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-brand-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary"
        aria-label="Select Theme"
      >
        <PaletteIcon className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-brand-bg-light border border-brand-border rounded-md shadow-lg z-10">
          <ul className="py-1">
            {availableThemes.map((t) => (
              <li key={t.key}>
                <button
                  onClick={() => handleThemeChange(t.key)}
                  className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-primary hover:text-white flex justify-between items-center"
                >
                  <span>{t.name}</span>
                  {theme.key === t.key && <CheckIcon className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
