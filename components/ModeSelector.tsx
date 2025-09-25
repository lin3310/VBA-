
import React from 'react';
import { AppMode } from '../types';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const getButtonClasses = (mode: AppMode) => {
    const baseClasses = 'px-6 py-2 text-lg font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-dark focus:ring-brand-primary';
    if (currentMode === mode) {
      return `${baseClasses} bg-brand-primary text-white shadow-lg`;
    }
    return `${baseClasses} bg-brand-bg-light text-brand-text-secondary hover:bg-gray-700 hover:text-white`;
  };

  return (
    <div className="flex justify-center bg-brand-bg-light p-2 rounded-lg shadow-inner w-full max-w-md mx-auto">
      <button
        onClick={() => onModeChange(AppMode.EXPLAIN)}
        className={getButtonClasses(AppMode.EXPLAIN)}
      >
        解讀程式碼
      </button>
      <button
        onClick={() => onModeChange(AppMode.GENERATE)}
        className={getButtonClasses(AppMode.GENERATE)}
      >
        製造程式碼
      </button>
    </div>
  );
};
