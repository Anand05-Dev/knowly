'use client';

import React from 'react';
import Image from 'next/image';

function SourceList({ chat }) {
  const webResult = chat?.searchResult;

  if (!webResult?.length) {
    return <p className="text-sm text-gray-500">No sources available.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Sources</h2>
      <div className="flex flex-col space-y-4">
        {webResult.map((item, index) => (
          <div key={item.url || index}>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
              {item.thumbnail &&
                (item.thumbnail.startsWith('http://') ||
                  item.thumbnail.startsWith('https://')) && (
                  <Image
                    src={item.thumbnail}
                    alt="Thumbnail"
                    width={40}
                    height={40}
                    className="rounded-md mt-1 object-cover"
                  />
                )}
              <div className="flex-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">{item.long_name}</p>
              </div>
            </div>
            {index < webResult.length - 1 && (
              <hr className="my-4 border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourceList;
