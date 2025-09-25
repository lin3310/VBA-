import React, { useState, useCallback } from 'react';
import { AppMode } from './types';
import { explainVbaCode, generateVbaCode } from './services/geminiService';
import { ModeSelector } from './components/ModeSelector';
import { CodeInput } from './components/CodeInput';
import { OutputDisplay } from './components/OutputDisplay';
import { ActionButton } from './components/ActionButton';
import { GithubIcon, SparklesIcon } from './components/Icons';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLAIN);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) {
      setError('請輸入內容。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      let result;
      if (mode === AppMode.EXPLAIN) {
        result = await explainVbaCode(input);
      } else {
        result = await generateVbaCode(input);
      }
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤。');
    } finally {
      setIsLoading(false);
    }
  }, [input, mode]);

  const getInputPlaceholder = () => {
    return mode === AppMode.EXPLAIN
      ? '在這裡貼上您的 VBA 程式碼...\n\nSub HelloWorld()\n    MsgBox "Hello, World!"\nEnd Sub'
      : '在這裡描述您需要的功能...\n\n例如：建立一個 VBA 巨集，它會將工作表 "Sheet1" 中 A1 儲存格的背景顏色變更為黃色。';
  };

  return (
    <div className="min-h-screen bg-brand-bg-dark text-brand-text font-sans flex flex-col">
      <header className="w-full bg-brand-bg-light border-b border-brand-border p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-brand-primary" />
          <h1 className="text-2xl font-bold text-white tracking-wide">VBA 語言解讀與製造</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <a href="https://github.com/google/labs-prototypes" target="_blank" rel="noopener noreferrer" className="text-brand-text-secondary hover:text-white transition-colors">
            <GithubIcon className="w-7 h-7" />
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-3 text-brand-text-secondary">
              {mode === AppMode.EXPLAIN ? 'VBA 程式碼輸入' : '功能描述'}
            </h2>
            <CodeInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getInputPlaceholder()}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col">
             <h2 className="text-lg font-semibold mb-3 text-brand-text-secondary">
              {mode === AppMode.EXPLAIN ? 'AI 程式碼解釋' : 'AI 產生程式碼'}
            </h2>
            <OutputDisplay
              output={output}
              isLoading={isLoading}
              isCode={mode === AppMode.GENERATE}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <ActionButton
            onClick={handleSubmit}
            isLoading={isLoading}
            mode={mode}
          />
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;