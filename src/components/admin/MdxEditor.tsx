"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@mdx-editor/editor/style.css';
import '../../styles/mdx-editor.css';

// Importación dinámica del editor para evitar problemas con SSR
const MDXEditor = dynamic(
  () => import('@mdxeditor/editor').then(mod => mod.MDXEditor),
  { ssr: false }
);

// Importamos solo los plugins que vamos a utilizar
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin
} from '@mdxeditor/editor';

interface MdxEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MdxEditor: React.FC<MdxEditorProps> = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  // Estado para la carga dinámica del editor (necesario para Next.js)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Mostramos un esqueleto mientras se carga el editor
    return (
      <div className="w-full border border-gray-700 rounded-md overflow-hidden bg-gray-800">
        <div className="h-8 bg-gray-900 border-b border-gray-700"></div>
        <div className="h-96 p-4 animate-pulse bg-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="mdx-editor-container w-full border border-gray-700 rounded-md overflow-hidden">
      <MDXEditor
        markdown={value}
        onChange={onChange}
        placeholder={placeholder}
        contentEditableClassName="prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none bg-gray-800 text-white"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', tsx: 'TSX', html: 'HTML', css: 'CSS', php: 'PHP', python: 'Python' } }),
          diffSourcePlugin(),
          frontmatterPlugin()
        ]}
      />
    </div>
  );
};

export default MdxEditor;