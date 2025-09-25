
import React from 'react';

interface CodeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, placeholder, disabled }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="flex-grow w-full bg-brand-bg-light border-2 border-brand-border rounded-lg p-4 font-mono text-sm text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow resize-none disabled:opacity-50"
      spellCheck="false"
    />
  );
};
