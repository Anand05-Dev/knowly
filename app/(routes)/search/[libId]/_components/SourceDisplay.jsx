import Image from 'next/image';
import React from 'react';

function SourceDisplay({ searchResult, loadingSearch }) {
  const webResult = searchResult;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Sources</h2>
      {webResult?.length ? (
        <div className="w-full overflow-x-auto">
          <div className="flex gap-4" style={{ width: '660px', maxWidth: '100%' }}>
            {webResult.map((item, index) => {
              const imageSrc = item?.thumbnail;
              const key = item?.url || `source-${index}`;

              return (
                <div
                  key={key}
                  className="w-[220px] flex-shrink-0 flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-colors bg-white"
                >
                  {imageSrc &&
                    (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) && (
                      <Image
                        src={imageSrc}
                        alt="favicon"
                        width={24}
                        height={24}
                        className="rounded-sm mt-1"
                      />
                    )}

                  <div className="flex flex-col">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">{item.long_name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loading placeholders */}
          {loadingSearch && (
            <div className="flex gap-4 mt-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={`loading-${item}`}
                  className="w-[200px] h-[100px] rounded-2xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No sources available.</p>
      )}
    </div>
  );
}

export default SourceDisplay;
