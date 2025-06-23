import Image from 'next/image';
import React from 'react';

function ImageDisplay({ chat }) {
  if (!chat?.searchResult) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {chat.searchResult.map((item, index) => {
        const isValidSrc = typeof item?.thumbnail === 'string' &&
          (item.thumbnail.startsWith('http://') || item.thumbnail.startsWith('https://'));

        return isValidSrc ? (
          <div key={index}>
            <Image
              src={item.thumbnail}
              alt={item.title || 'Image'}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        ) : null;
      })}
    </div>
  );
}

export default ImageDisplay;
