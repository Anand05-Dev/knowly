import Image from 'next/image';
import React from 'react';

function SourceDisplay({ searchResult }) {
  const webResult = searchResult?.items;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Sources</h2>
      {webResult?.length ? (
        <ul className="space-y-2">
          {webResult.map((item, index) => {
            const imageSrc = item?.pagemap?.cse_thumbnail?.[0]?.src;
            return (
              <li key={index} className="p-2 border rounded hover:bg-gray-50">
                <div className="flex gap-2 items-center">
                  {imageSrc && (
                    <Image
                      src={imageSrc}
                      alt={item?.pagemap?.metatags?.[0]?.["og:site_name"] || "result"}
                      width={20}
                      height={20}
                    />
                  )}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </a>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {item.snippet || item.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.displayLink}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No sources available.</p>
      )}
    </div>
  );
}

export default SourceDisplay;
