
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon } from './Icons';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  isCode: boolean;
  placeholder: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, isCode, placeholder }) => {
  const [copied, setCopied] = useState(false);

  const cleanedOutput = output.replace(/```(vba|vb|VBA|VB)?\s*/, '').replace(/```$/, '');

  const handleCopy = () => {
    const textToCopy = isCode ? cleanedOutput : output;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    // Reset copied state if output changes
    setCopied(false);
  }, [output]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
  );
  
  const Placeholder = () => (
    <div className="flex items-center justify-center h-full text-brand-text-secondary">
      {placeholder}
    </div>
  );

  return (
    <div className="relative flex-grow w-full bg-brand-bg-light border-2 border-brand-border rounded-lg font-mono text-sm text-brand-text overflow-hidden">
      {output && !isLoading && (
         <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Copy to clipboard"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-gray-300" />}
          </button>
      )}

      <div className="h-full overflow-y-auto p-4">
        {isLoading ? <LoadingSpinner /> : (
            !output ? <Placeholder /> : (
                isCode ? (
                <pre><code className="language-vba">{cleanedOutput}</code></pre>
                ) : (
                <div className="prose prose-invert prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: formatMarkdown(output) }}></div>
                )
            )
        )}
      </div>
    </div>
  );
};

// A simple markdown to HTML converter
const formatMarkdown = (text: string) => {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="font-semibold text-lg mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-bold text-xl mb-3 border-b border-brand-border pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-extrabold text-2xl mb-4 border-b-2 border-brand-primary pb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-brand-bg-dark text-yellow-300 rounded px-1 py-0.5 font-mono text-xs">$1</code>')
    .replace(/```vba\n([\s\S]*?)```/g, '<pre class="bg-brand-bg-dark p-3 rounded-md overflow-x-auto"><code class="language-vba">$1</code></pre>')
    .replace(/\n/g, '<br />');
  return html;
};