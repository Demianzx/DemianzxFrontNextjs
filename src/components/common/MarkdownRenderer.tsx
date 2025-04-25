"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
        // Personalización de los componentes renderizados
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-purple-400 hover:text-purple-300 transition-colors" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-4" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-300" {...props} />
        ),
        hr: ({ node, ...props }) => <hr className="my-8 border-gray-700" {...props} />,
        img: ({ node, ...props }) => (
          <img className="rounded-md max-w-full my-6" {...props} alt={props.alt || 'Image'} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="border-collapse w-full" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
        th: ({ node, ...props }) => (
          <th className="border border-gray-700 px-4 py-2 text-left" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-700 px-4 py-2" {...props} />
        ),
        // Resaltado de sintaxis para bloques de código
        code({ node, inline, className, children, ...props }) {
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
              className={`${inline ? 'bg-gray-800 text-pink-400 px-1 py-0.5 rounded text-sm' : ''} ${className}`}
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