
import React from 'react';
import { AppMode } from '../types';
import { SparklesIcon } from './Icons';

interface ActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  mode: AppMode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isLoading, mode }) => {
  const buttonText = 
    mode === AppMode.EXPLAIN ? '解讀程式碼' :
    mode === AppMode.GENERATE ? '製造程式碼' :
    '傳送訊息';

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-8 py-3 bg-brand-primary hover:bg-green-700 disabled:bg-brand-secondary disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          處理中...
        </>
      ) : (
        <>
          <SparklesIcon className="w-6 h-6 mr-2" />
          {buttonText}
        </>
      )}
    </button>
  );
};
