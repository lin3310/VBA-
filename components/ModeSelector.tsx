
import React, { useState, useRef, useEffect } from 'react';
import { AppMode } from '../types';
import { ExplainIcon, SparklesIcon, DebugIcon, ChevronDownIcon } from './Icons';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const modeConfig = {
  [AppMode.EXPLAIN]: {
    name: '解讀程式碼',
    icon: (props: React.SVGProps<SVGSVGElement>) => <ExplainIcon {...props} />,
  },
  [AppMode.GENERATE]: {
    name: '製造程式碼',
    icon: (props: React.SVGProps<SVGSVGElement>) => <SparklesIcon {...props} />,
  },
  [AppMode.DEBUG]: {
    name: '偵錯程式碼',
    icon: (props: React.SVGProps<SVGSVGElement>) => <DebugIcon {...props} />,
  },
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const CurrentIcon = modeConfig[currentMode].icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelectMode = (mode: AppMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-bg-light border-2 border-brand-border rounded-lg text-lg font-semibold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <CurrentIcon className="w-6 h-6 text-brand-primary" />
          <span>{modeConfig[currentMode].name}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-brand-bg-light border border-brand-border rounded-md shadow-lg z-10">
          <ul className="py-1">
            {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((mode) => {
              const { name, icon: Icon } = modeConfig[mode];
              return (
                <li key={mode}>
                  <button
                    onClick={() => handleSelectMode(mode)}
                    className="w-full text-left px-4 py-3 text-md text-brand-text hover:bg-brand-primary hover:text-white flex items-center gap-3"
                  >
                    <Icon className="w-6 h-6" />
                    <span>{name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
