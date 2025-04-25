"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const SimpleMarkdownEditor: React.FC<SimpleMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your markdown content here...',
  height = 400
}) => {
  const [isPreview, setIsPreview] = useState(false);
  
  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 p-2 flex justify-between items-center">
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => {
              onChange(value + '# ');
            }}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Heading"
          >
            H
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value + '**bold**');
            }}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded font-bold"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value + '*italic*');
            }}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded italic"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value + '[link](https://)');
            }}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value + '\n```\ncode\n```\n');
            }}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Code"
          >
            {'</>'}
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value + '\n- Item 1\n- Item 2\n- Item 3\n');
            }}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="List"
          >
            •
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1 rounded ${
            isPreview ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      
      {/* Editor/Preview area */}
      {isPreview ? (
        <div 
          className="bg-gray-800 p-4 prose prose-invert max-w-none overflow-auto"
          style={{ minHeight: height }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {value || '*No content*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800 p-4 text-white border-none focus:outline-none focus:ring-0"
          style={{ minHeight: height }}
        />
      )}
    </div>
  );
};

export default SimpleMarkdownEditor;