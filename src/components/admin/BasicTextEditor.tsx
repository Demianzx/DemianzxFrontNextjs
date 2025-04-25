"use client";

import React from 'react';

interface BasicTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const BasicTextEditor: React.FC<BasicTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  rows = 15
}) => {
  return (
    <div className="w-full border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-700 p-3">
        <span className="text-gray-400">Markdown Editor</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-gray-800 p-4 text-white focus:outline-none"
      />
    </div>
  );
};

export default BasicTextEditor;