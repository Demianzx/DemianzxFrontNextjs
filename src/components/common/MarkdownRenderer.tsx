"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            
            if (!match) {
              return (
                <code className="bg-gray-800 text-pink-400 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }
            
            // Usar type assertion para resolver el problema con style
            const syntaxStyle = vscDarkPlus as Record<string, React.CSSProperties>;
            
            return (
              <SyntaxHighlighter
                language={match[1]}
                style={syntaxStyle}
                PreTag="div"
                className="rounded-md my-4"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          img({ src, alt }) {
            if (!src || typeof src !== 'string') return null;
            
            // Para manejar imágenes externas y evitar el warning de eslint
            return (
              <div className="relative my-6 w-full h-auto">
                <div style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%' }}>
                  <Image
                    src={src}
                    alt={alt || 'Image'}
                    fill
                    className="object-cover rounded-md"
                    unoptimized={src.startsWith('data:') || src.startsWith('http')}
                  />
                </div>
              </div>
            );
          },
          // Otros componentes básicos
          a({ children, href }) {
            return (
              <a 
                href={href}
                className="text-purple-400 hover:text-purple-300 transition-colors"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-300">
                {children}
              </blockquote>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;