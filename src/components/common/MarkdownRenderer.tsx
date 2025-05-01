"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Estilos CSS personalizados para el renderizado de markdown
  const markdownStyles = `
    .md-content {
      color: #ffffff;
      line-height: 1.6;
      width: 100%;
      max-width: 100%;
    }
    .md-content h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #374151;
      padding-bottom: 0.5rem;
    }
    .md-content h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 1.75rem;
      margin-bottom: 0.75rem;
    }
    .md-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .md-content h4, .md-content h5, .md-content h6 {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }
    .md-content p {
      margin-bottom: 1.25rem;
    }
    .md-content ul, .md-content ol {
      margin-bottom: 1.25rem;
      padding-left: 2rem;
    }
    .md-content ul {
      list-style-type: disc;
    }
    .md-content ol {
      list-style-type: decimal;
    }
    .md-content li {
      margin-bottom: 0.5rem;
    }
    .md-content a {
      color: #a78bfa;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .md-content a:hover {
      color: #c4b5fd;
    }
    .md-content blockquote {
      border-left: 4px solid #8b5cf6;
      padding: 0.5rem 0 0.5rem 1rem;
      margin: 1.5rem 0;
      background-color: rgba(139, 92, 246, 0.1);
      color: #d1d5db;
    }
    .md-content blockquote p {
      margin-bottom: 0;
    }
    .md-content pre {
      background-color: #1e293b;
      padding: 1rem;
      border-radius: 0.375rem;
      overflow-x: auto;
      margin-bottom: 1.25rem;
    }
    .md-content :not(pre) > code {
      background-color: #1e293b;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.9em;
      color: #f472b6;
    }
    .md-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.5rem 0;
    }
    .md-content table th, .md-content table td {
      border: 1px solid #4b5563;
      padding: 0.75rem;
    }
    .md-content table th {
      background-color: #1e293b;
      font-weight: 600;
    }
    .md-content table tr:nth-child(even) {
      background-color: rgba(30, 41, 59, 0.4);
    }
    .md-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.375rem;
      margin: 1.5rem auto;
      display: block;
    }
    .md-content hr {
      border: 0;
      height: 1px;
      background-color: #4b5563;
      margin: 2rem 0;
    }
    .md-content strong {
      font-weight: 700;
      color: #f9fafb;
    }
    .md-content em {
      font-style: italic;
    }
    .md-content del {
      text-decoration: line-through;
      color: #9ca3af;
    }
  `;

  // Definimos los componentes que usará ReactMarkdown
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      
      if (match) {
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
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    img({ src, alt }) {
      if (!src || typeof src !== 'string') return null;
      
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
    a({ children, href, ...props }) {
      return (
        <a 
          href={href}
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }
  };

  return (
    <div className={`${className}`}>
      <style>{markdownStyles}</style>
      <div className="md-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;