
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppMode, Message, Lang } from './types';
import { explainVbaCode, generateVbaCode, startDebugChat } from './services/geminiService';
import { ModeSelector } from './components/ModeSelector';
import { CodeInput } from './components/CodeInput';
import { OutputDisplay } from './components/OutputDisplay';
import { ActionButton } from './components/ActionButton';
import { GithubIcon, SparklesIcon } from './components/Icons';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import type { Chat } from '@google/genai';

// Localization
// ------------

const translations = {
  'en': {
    title: "VBA Code Explainer & Generator",
    modeExplain: "Explain Code",
    modeGenerate: "Generate Code",
    modeDebug: "Debug Code",
    inputHeaderExplain: "VBA Code Input",
    inputHeaderGenerate: "Feature Description",
    outputHeaderExplain: "AI Code Explanation",
    outputHeaderGenerate: "AI Generated Code",
    placeholderExplain: "Paste your VBA code here...\n\nSub HelloWorld()\n    MsgBox \"Hello, World!\"\nEnd Sub",
    placeholderGenerate: "Describe the functionality you need here...\n\nFor example: Create a VBA macro that changes the background color of cell A1 on worksheet \"Sheet1\" to yellow.",
    placeholderDebug: "Enter your question or paste code here (Shift+Enter for new line)...",
    actionButtonExplain: "Explain Code",
    actionButtonGenerate: "Generate Code",
    actionButtonDebug: "Send Message",
    actionButtonLoading: "Processing...",
    errorPrefix: "An error occurred:",
    emptyInputError: "Please enter some content.",
    debugInitError: "Debug mode has not been initialized.",
    outputPlaceholder: "AI response will be displayed here...",
  },
  'zh-TW': {
    title: "VBA 語言解讀與製造",
    modeExplain: "解讀程式碼",
    modeGenerate: "製造程式碼",
    modeDebug: "偵錯程式碼",
    inputHeaderExplain: "VBA 程式碼輸入",
    inputHeaderGenerate: "功能描述",
    outputHeaderExplain: "AI 程式碼解釋",
    outputHeaderGenerate: "AI 產生程式碼",
    placeholderExplain: "在這裡貼上您的 VBA 程式碼...\n\nSub HelloWorld()\n    MsgBox \"Hello, World!\"\nEnd Sub",
    placeholderGenerate: "在這裡描述您需要的功能...\n\n例如：建立一個 VBA 巨集，它會將工作表 \"Sheet1\" 中 A1 儲存格的背景顏色變更為黃色。",
    placeholderDebug: "在這裡輸入您的問題或貼上程式碼 (Shift+Enter for new line)...",
    actionButtonExplain: "解讀程式碼",
    actionButtonGenerate: "製造程式碼",
    actionButtonDebug: "傳送訊息",
    actionButtonLoading: "處理中...",
    errorPrefix: "發生錯誤：",
    emptyInputError: "請輸入內容。",
    debugInitError: "偵錯模式尚未初始化。",
    outputPlaceholder: "AI 的回應將會顯示在這裡...",
  },
  'zh-CN': {
    title: "VBA 语言解读与生成",
    modeExplain: "解读代码",
    modeGenerate: "生成代码",
    modeDebug: "调试代码",
    inputHeaderExplain: "VBA 代码输入",
    inputHeaderGenerate: "功能描述",
    outputHeaderExplain: "AI 代码解释",
    outputHeaderGenerate: "AI 生成代码",
    placeholderExplain: "在此处粘贴您的 VBA 代码...\n\nSub HelloWorld()\n    MsgBox \"Hello, World!\"\nEnd Sub",
    placeholderGenerate: "在此处描述您需要的功能...\n\n例如：创建一个 VBA 宏，它会将工作表 \"Sheet1\" 中 A1 单元格的背景颜色更改为黄色。",
    placeholderDebug: "在此处输入您的问题或粘贴代码 (Shift+Enter 换行)...",
    actionButtonExplain: "解读代码",
    actionButtonGenerate: "生成代码",
    actionButtonDebug: "发送消息",
    actionButtonLoading: "处理中...",
    errorPrefix: "发生错误：",
    emptyInputError: "请输入内容。",
    debugInitError: "调试模式尚未初始化。",
    outputPlaceholder: "AI 的回应将显示在此处...",
  }
};

const getLang = (): Lang => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh-cn') || lang.startsWith('zh-sg')) {
    return 'zh-CN';
  }
  if (lang.startsWith('zh')) {
    return 'zh-TW';
  }
  return 'en';
};


// ChatView component for Debug Mode
// ---------------------------------

interface ChatViewProps {
  messages: Message[];
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder: string;
  buttonText: string;
  buttonLoadingText: string;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isModel = message.role === 'model';
  // A simple markdown to HTML converter for chat.
  const formatChatMessage = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-brand-bg-dark text-yellow-300 rounded px-1 py-0.5 font-mono text-xs">$1</code>')
      .replace(/```(vba|vb)?\n([\s\S]*?)```/g, '<pre class="bg-brand-bg-dark p-3 my-2 rounded-md overflow-x-auto"><code class="language-vba">$2</code></pre>')
      .replace(/\n/g, '<br />');
    return html;
  };

  return (
    <div className={`flex items-start gap-4 my-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>}
      <div
        className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-lg ${isModel ? 'bg-brand-bg-light' : 'bg-brand-secondary text-white'}`}
        dangerouslySetInnerHTML={{ __html: formatChatMessage(message.content) }}
      />
    </div>
  );
};

const ChatView: React.FC<ChatViewProps> = ({ messages, input, onInputChange, onSubmit, isLoading, placeholder, buttonText, buttonLoadingText }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full mt-6 flex-grow">
      <div className="flex-grow overflow-y-auto pr-4 -mr-4 h-0">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
           <div className="flex items-start gap-4 my-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="max-w-xl lg:max-w-2xl px-4 py-3 rounded-lg bg-brand-bg-light">
              <div className="flex items-center gap-2 text-brand-text-secondary">
                 <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
              </div>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-6 flex flex-col items-center">
         <div className="w-full flex flex-col gap-4">
             <CodeInput
                value={input}
                onChange={onInputChange}
                placeholder={placeholder}
                disabled={isLoading}
             />
             <div className="self-center">
                <ActionButton
                    onClick={onSubmit}
                    isLoading={isLoading}
                    text={buttonText}
                    loadingText={buttonLoadingText}
                />
             </div>
         </div>
      </div>
    </div>
  );
};


// Main App Component
// ------------------

const App: React.FC = () => {
  const [lang] = useState<Lang>(getLang());
  const t = translations[lang];

  const [mode, setMode] = useState<AppMode>(AppMode.EXPLAIN);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    if (mode === AppMode.DEBUG && !chat) {
      const newChat = startDebugChat(lang);
      setChat(newChat);
      setIsLoading(true);
      
      (async () => {
          try {
              const stream = await newChat.sendMessageStream({ message: "Hello" });
              let text = '';
              for await (const chunk of stream) {
                  text += chunk.text;
              }
              setMessages([{ role: 'model', content: text }]);
          } catch(err) {
              setError(err instanceof Error ? err.message : 'An unknown error occurred.');
          } finally {
              setIsLoading(false);
          }
      })();
    }
  }, [mode, chat, lang]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
    setMessages([]);
    if (newMode !== AppMode.DEBUG) {
        setChat(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) {
      setError(t.emptyInputError);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (mode === AppMode.DEBUG) {
      if (!chat) {
        setError(t.debugInitError);
        setIsLoading(false);
        return;
      }
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput(''); // Clear input after sending

      try {
        const stream = await chat.sendMessageStream({ message: input });
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', content: '' }]);
        
        for await (const chunk of stream) {
          modelResponse += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = modelResponse;
            return newMessages;
          });
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        setMessages(prev => prev.filter(m => m.role === 'user' || m.content !== '')); 
      } finally {
        setIsLoading(false);
      }

    } else { // EXPLAIN or GENERATE
      setOutput('');
      try {
        let result;
        if (mode === AppMode.EXPLAIN) {
          result = await explainVbaCode(input, lang);
        } else {
          result = await generateVbaCode(input, lang);
        }
        setOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [input, mode, chat, lang, t]);

  const getInputPlaceholder = () => {
    return mode === AppMode.EXPLAIN ? t.placeholderExplain : t.placeholderGenerate;
  };
  
  const getActionButtonText = () => {
    if (mode === AppMode.EXPLAIN) return t.actionButtonExplain;
    if (mode === AppMode.GENERATE) return t.actionButtonGenerate;
    return t.actionButtonDebug;
  }

  const renderContent = () => {
    if (mode === AppMode.DEBUG) {
        return (
            <ChatView
                messages={messages}
                input={input}
                onInputChange={(e) => setInput(e.target.value)}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                placeholder={t.placeholderDebug}
                buttonText={t.actionButtonDebug}
                buttonLoadingText={t.actionButtonLoading}
            />
        );
    }

    return (
        <>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold mb-3 text-brand-text-secondary">
                  {mode === AppMode.EXPLAIN ? t.inputHeaderExplain : t.inputHeaderGenerate}
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
                  {mode === AppMode.EXPLAIN ? t.outputHeaderExplain : t.outputHeaderGenerate}
                </h2>
                <OutputDisplay
                  output={output}
                  isLoading={isLoading}
                  isCode={mode === AppMode.GENERATE}
                  placeholder={t.outputPlaceholder}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <ActionButton
                onClick={handleSubmit}
                isLoading={isLoading}
                text={getActionButtonText()}
                loadingText={t.actionButtonLoading}
              />
            </div>
        </>
    );
  };

  const modeNames = {
    [AppMode.EXPLAIN]: t.modeExplain,
    [AppMode.GENERATE]: t.modeGenerate,
    [AppMode.DEBUG]: t.modeDebug,
  };

  return (
    <div className="min-h-screen bg-brand-bg-dark text-brand-text font-sans flex flex-col">
      <header className="w-full bg-brand-bg-light border-b border-brand-border p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-brand-primary" />
          <h1 className="text-2xl font-bold text-brand-text tracking-wide">{t.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <a href="https://github.com/google/labs-prototypes" target="_blank" rel="noopener noreferrer" className="text-brand-text-secondary hover:text-brand-text transition-colors">
            <GithubIcon className="w-7 h-7" />
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <ModeSelector currentMode={mode} onModeChange={handleModeChange} modeNames={modeNames} />
        
        {renderContent()}

        {error && <p className="text-red-400 mt-4 text-center">{t.errorPrefix} {error}</p>}
      </main>
    </div>
  );
};

export default App;