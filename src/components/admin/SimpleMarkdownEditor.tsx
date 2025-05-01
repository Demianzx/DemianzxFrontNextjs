"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

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
  
  // Función para insertar texto en el cursor actual
  const insertText = (textToInsert: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Diferentes comportamientos dependiendo del botón
    let newText = '';
    
    if (textToInsert === '# ') {
      // Para headings, añadir al principio de la línea
      const textBeforeCursor = value.substring(0, start);
      const textAfterCursor = value.substring(end);
      
      // Encontrar el inicio de la línea actual
      const lastNewLineIndex = textBeforeCursor.lastIndexOf('\n');
      const lineStart = lastNewLineIndex === -1 ? 0 : lastNewLineIndex + 1;
      
      // Construir el nuevo texto
      newText = 
        textBeforeCursor.substring(0, lineStart) + 
        textToInsert + 
        textBeforeCursor.substring(lineStart) +
        selectedText + 
        textAfterCursor;
      
      // Ajustar la posición del cursor
      setTimeout(() => {
        textarea.selectionStart = lineStart + textToInsert.length;
        textarea.selectionEnd = lineStart + textToInsert.length + selectedText.length;
        textarea.focus();
      }, 0);
    } else if (textToInsert === '\n- ') {
      // Para listas, crear una nueva línea si no estamos al principio de una
      const currentPosition = value.substring(0, start);
      const isStartOfLine = currentPosition.endsWith('\n') || currentPosition.length === 0;
      
      if (isStartOfLine) {
        newText = value.substring(0, start) + '- ' + selectedText + value.substring(end);
        setTimeout(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = start + 2 + selectedText.length;
          textarea.focus();
        }, 0);
      } else {
        newText = value.substring(0, start) + '\n- ' + selectedText + value.substring(end);
        setTimeout(() => {
          textarea.selectionStart = start + 3;
          textarea.selectionEnd = start + 3 + selectedText.length;
          textarea.focus();
        }, 0);
      }
    } else if (textToInsert === '\n\n```\n\n```\n\n') {
      // Para bloques de código, insertar y poner el cursor entre los bloques
      newText = value.substring(0, start) + textToInsert + value.substring(end);
      setTimeout(() => {
        textarea.selectionStart = start + 5;
        textarea.selectionEnd = start + 5;
        textarea.focus();
      }, 0);
    } else if (textToInsert === '[link](https://)') {
      // Para links, seleccionar "link" para sustituir fácilmente
      newText = value.substring(0, start) + textToInsert + value.substring(end);
      setTimeout(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 5;
        textarea.focus();
      }, 0);
    } else if (textToInsert === '**bold**' || textToInsert === '*italic*') {
      // Para formatos de texto, envolver el texto seleccionado
      if (selectedText) {
        // Si hay texto seleccionado, envolverlo
        if (textToInsert === '**bold**') {
          newText = value.substring(0, start) + '**' + selectedText + '**' + value.substring(end);
          setTimeout(() => {
            textarea.selectionStart = start + 2;
            textarea.selectionEnd = start + 2 + selectedText.length;
            textarea.focus();
          }, 0);
        } else {
          newText = value.substring(0, start) + '*' + selectedText + '*' + value.substring(end);
          setTimeout(() => {
            textarea.selectionStart = start + 1;
            textarea.selectionEnd = start + 1 + selectedText.length;
            textarea.focus();
          }, 0);
        }
      } else {
        // Si no hay texto seleccionado, insertar el texto de ejemplo
        newText = value.substring(0, start) + textToInsert + value.substring(end);
        
        // Seleccionar el texto de ejemplo para facilitar su edición
        const textLength = textToInsert === '**bold**' ? 4 : 6;
        setTimeout(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = start + textLength;
          textarea.focus();
        }, 0);
      }
    } else {
      // Para otros casos, simplemente insertar el texto
      newText = value.substring(0, start) + textToInsert + value.substring(end);
      setTimeout(() => {
        textarea.selectionStart = start + textToInsert.length;
        textarea.selectionEnd = start + textToInsert.length;
        textarea.focus();
      }, 0);
    }
    
    onChange(newText);
  };
  
  // Estilos CSS personalizados para la vista previa
  const previewStyles = `
    .markdown-preview {
      color: #ffffff;
      line-height: 1.6;
    }
    .markdown-preview h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #374151;
      padding-bottom: 0.5rem;
    }
    .markdown-preview h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .markdown-preview h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.75rem;
    }
    .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    .markdown-preview p {
      margin-bottom: 1rem;
    }
    .markdown-preview ul, .markdown-preview ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    .markdown-preview ul {
      list-style-type: disc;
    }
    .markdown-preview ol {
      list-style-type: decimal;
    }
    .markdown-preview li {
      margin-bottom: 0.25rem;
    }
    .markdown-preview a {
      color: #a78bfa;
      text-decoration: underline;
    }
    .markdown-preview a:hover {
      color: #c4b5fd;
    }
    .markdown-preview blockquote {
      border-left: 4px solid #8b5cf6;
      padding-left: 1rem;
      margin-left: 0;
      margin-right: 0;
      font-style: italic;
      color: #d1d5db;
    }
    .markdown-preview pre {
      background-color: #1e293b;
      padding: 1rem;
      border-radius: 0.375rem;
      overflow-x: auto;
      margin-bottom: 1rem;
    }
    .markdown-preview code {
      background-color: #1e293b;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.9rem;
      color: #f472b6;
    }
    .markdown-preview pre code {
      padding: 0;
      background-color: transparent;
    }
    .markdown-preview table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1rem;
    }
    .markdown-preview table th, .markdown-preview table td {
      border: 1px solid #4b5563;
      padding: 0.5rem;
    }
    .markdown-preview table th {
      background-color: #1e293b;
    }
    .markdown-preview img {
      max-width: 100%;
      height: auto;
      border-radius: 0.375rem;
    }
    .markdown-preview hr {
      border: 0;
      border-top: 1px solid #4b5563;
      margin: 1.5rem 0;
    }
  `;
  
  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 p-2 flex justify-between items-center">
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => insertText('# ')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Heading"
          >
            H
          </button>
          <button
            type="button"
            onClick={() => insertText('**bold**')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded font-bold"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertText('*italic*')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded italic"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertText('[link](https://)')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => insertText('\n\n```\n\n```\n\n')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Code"
          >
            {'</>'}
          </button>
          <button
            type="button"
            onClick={() => insertText('\n- ')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => insertText('\n> ')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Quote"
          >
            "
          </button>
          <button
            type="button"
            onClick={() => insertText('\n---\n')}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Horizontal Rule"
          >
            —
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
          className="bg-gray-800 p-4 overflow-auto markdown-preview"
          style={{ minHeight: height }}
        >
          <style>{previewStyles}</style>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {value || '*No content*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800 p-4 text-white border-none focus:outline-none focus:ring-0 font-mono"
          style={{ minHeight: height }}
        />
      )}
    </div>
  );
};

export default SimpleMarkdownEditor;