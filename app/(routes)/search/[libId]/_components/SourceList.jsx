import React from 'react';

function SourceList({ chat }) {
  const webResult = chat?.searchResult || [];

  return (
    <div className="flex flex-col gap-4">
      {webResult.length === 0 ? (
        <p className="text-gray-500 text-sm">No sources found.</p>
      ) : (
        webResult.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-accent rounded-lg cursor-pointer hover:bg-blue-100"
            onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
          >
            <span className="text-sm font-semibold mt-1">{index + 1}.</span>

            {item?.thumbnail &&
              (item.thumbnail.startsWith('http://') || item.thumbnail.startsWith('https://')) && (
                <img
                  src={item.thumbnail}
                  alt={item.long_name || item.title || 'result'}
                  width={40}
                  height={40}
                  className="rounded-sm"
                />
              )}

            <div className="flex flex-col">
              <h2 className="text-xs font-medium truncate max-w-xs">{item?.long_name}</h2>
              <div
                className="text-black text-xs mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item?.description || '' }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SourceList;
