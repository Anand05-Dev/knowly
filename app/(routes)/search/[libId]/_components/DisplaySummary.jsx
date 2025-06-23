import React from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DisplaySummary({ aiResp }) {
  return (
    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
      <Markdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-[22px] font-semibold text-gray-900 mb-3 mt-5" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-[18px] font-semibold text-gray-800 mb-2 mt-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-[16px] font-medium text-gray-700 mb-2 mt-4" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 text-[14px] text-gray-800" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-5 space-y-1 text-[14px]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal ml-5 space-y-1 text-[14px]" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <table className="w-full border-collapse text-sm mt-4 mb-4" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border px-3 py-2 bg-gray-100 text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border px-3 py-2" {...props} />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={okaidia}
                language={match[1]}
                PreTag="div"
                className="rounded-md overflow-auto my-4 text-[13px]"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-[13px] font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {aiResp}
      </Markdown>
    </div>
  );
}

export default DisplaySummary;
