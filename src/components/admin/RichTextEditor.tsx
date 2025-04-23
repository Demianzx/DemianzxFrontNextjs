import React, { useState, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    if (editorRef.current) {
      // Solo actualizamos el contenido si el editor no está enfocado para evitar problemas con el cursor
      if (!isFocused) {
        editorRef.current.innerHTML = value || '';
        setIsEmpty(!value);
      }
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      // Verificar si el editor está vacío para mostrar el placeholder
      setIsEmpty(content === '' || content === '<br>' || content === '<div><br></div>');
    }
  };

  const handleToolbarAction = (action: string) => {
    document.execCommand(action, false);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="w-full border border-gray-700 rounded-md overflow-hidden bg-gray-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700 bg-gray-900">
        <button
          type="button"
          onClick={() => handleToolbarAction('bold')}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded"
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a2 2 0 002-2V8a2 2 0 00-2-2H6v10zm0 0h8a2 2 0 002-2v-2a2 2 0 00-2-2H6v6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolbarAction('italic')}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded"
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolbarAction('underline')}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded"
          title="Underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16h10M12 4v12" />
          </svg>
        </button>
        
        <span className="border-l border-gray-700 h-6 mx-2"></span>
        
        <button
          type="button"
          onClick={() => handleToolbarAction('insertUnorderedList')}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded"
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolbarAction('insertOrderedList')}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded"
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <span className="border-l border-gray-700 h-6 mx-2"></span>
        
        <button
          type="button"
          onClick={() => handleToolbarAction('formatBlock')}
          className="p-2 text-gray-400 hover:bg-gray-800 rounded"
          title="Heading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {/* Editor area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className="w-full p-4 min-h-[300px] focus:outline-none text-white"
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {/* Placeholder como un elemento separado */}
        {isEmpty && !isFocused && (
          <div className="absolute top-0 left-0 p-4 text-gray-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;