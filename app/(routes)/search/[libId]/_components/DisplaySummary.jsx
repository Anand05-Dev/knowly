'use client';

import React from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

function DisplaySummary({ aiResp }) {
  if (!aiResp) return <p className="text-gray-400">AI is generating a response...</p>;

  return (
    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
      <Markdown
        components={{
          h1: (props) => <h1 className="text-[22px] font-semibold text-gray-900 mb-3 mt-5" {...props} />,
          h2: (props) => <h2 className="text-[18px] font-semibold text-gray-800 mb-2 mt-4" {...props} />,
          h3: (props) => <h3 className="text-[16px] font-medium text-gray-700 mb-2 mt-4" {...props} />,
          p: (props) => <p className="mb-3 text-[14px] text-gray-800" {...props} />,
          a: (props) => (
            <a
              className="text-blue-600 underline hover:text-blue-800 break-words"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: (props) => <ul className="list-disc ml-5 space-y-1 text-[14px]" {...props} />,
          ol: (props) => <ol className="list-decimal ml-5 space-y-1 text-[14px]" {...props} />,
          li: (props) => <li className="mb-1" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4" {...props} />
          ),
          table: (props) => (
            <div className="overflow-x-auto mt-4 mb-6">
              <table className="w-full border border-gray-300 rounded-md text-sm table-auto">
                {props.children}
              </table>
            </div>
          ),
          thead: (props) => (
            <thead className="bg-gray-100 text-gray-700">{props.children}</thead>
          ),
          th: (props) => (
            <th className="border px-4 py-2 text-left font-semibold">{props.children}</th>
          ),
          tbody: (props) => <tbody className="divide-y divide-gray-200">{props.children}</tbody>,
          tr: (props) => <tr className="hover:bg-gray-50">{props.children}</tr>,
          td: (props) => (
            <td className="border px-4 py-2 align-top text-gray-700 break-words">{props.children}</td>
          ),
          code({ inline, className, children, ...props }) {
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
