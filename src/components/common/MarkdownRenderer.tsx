"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <ReactMarkdown
      className={`prose prose-invert max-w-none ${className}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Personalización de los componentes renderizados con tipos explícitos
        h1: ({ className, children, ...props }) => (
          <h1 className={`text-3xl font-bold mt-8 mb-4 ${className}`} {...props}>
            {children}
          </h1>
        ),
        h2: ({ className, children, ...props }) => (
          <h2 className={`text-2xl font-bold mt-8 mb-4 ${className}`} {...props}>
            {children}
          </h2>
        ),
        h3: ({ className, children, ...props }) => (
          <h3 className={`text-xl font-bold mt-6 mb-3 ${className}`} {...props}>
            {children}
          </h3>
        ),
        h4: ({ className, children, ...props }) => (
          <h4 className={`text-lg font-bold mt-4 mb-2 ${className}`} {...props}>
            {children}
          </h4>
        ),
        a: ({ className, children, ...props }) => (
          <a 
            className={`text-purple-400 hover:text-purple-300 transition-colors ${className}`} 
            {...props}
          >
            {children}
          </a>
        ),
        p: ({ className, children, ...props }) => (
          <p className={`my-4 ${className}`} {...props}>
            {children}
          </p>
        ),
        ul: ({ className, children, ...props }) => (
          <ul className={`list-disc pl-6 my-4 ${className}`} {...props}>
            {children}
          </ul>
        ),
        ol: ({ className, children, ...props }) => (
          <ol className={`list-decimal pl-6 my-4 ${className}`} {...props}>
            {children}
          </ol>
        ),
        li: ({ className, children, ...props }) => (
          <li className={`mb-1 ${className}`} {...props}>
            {children}
          </li>
        ),
        blockquote: ({ className, children, ...props }) => (
          <blockquote 
            className={`border-l-4 border-purple-500 pl-4 italic my-4 text-gray-300 ${className}`} 
            {...props}
          >
            {children}
          </blockquote>
        ),
        hr: ({ className, ...props }) => (
          <hr className={`my-8 border-gray-700 ${className}`} {...props} />
        ),
        img: ({ src, alt, className, ...props }) => {
          if (!src) return null;
          
          return (
            <div className="relative my-6 w-full h-auto">
              <Image
                src={src}
                alt={alt || 'Image'}
                className={`rounded-md ${className || ''}`}
                width={800}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                unoptimized={src.startsWith('data:') || src.startsWith('http')}
                {...props}
              />
            </div>
          );
        },
        table: ({ className, children, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className={`border-collapse w-full ${className}`} {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ className, children, ...props }) => (
          <thead className={`bg-gray-800 ${className}`} {...props}>
            {children}
          </thead>
        ),
        th: ({ className, children, ...props }) => (
          <th 
            className={`border border-gray-700 px-4 py-2 text-left ${className}`} 
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ className, children, ...props }) => (
          <td 
            className={`border border-gray-700 px-4 py-2 ${className}`} 
            {...props}
          >
            {children}
          </td>
        ),
        // Resaltado de sintaxis para bloques de código
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-md my-4"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className={`${inline ? 'bg-gray-800 text-pink-400 px-1 py-0.5 rounded text-sm' : ''} ${className || ''}`}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;