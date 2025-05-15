"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { Components } from 'react-markdown';
import '@/styles/markdown.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
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
        <span className="block my-6">
          <Image
            src={src}
            alt={alt || 'Image'}
            width={800}
            height={450}
            className="rounded-md max-w-full h-auto mx-auto"
            unoptimized={src.startsWith('data:') || src.startsWith('http')}
          />
        </span>
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
      <div className="markdown-content">
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