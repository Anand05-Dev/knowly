import Image from 'next/image';
import React from 'react';

function AnswerDisplay({ searchResult }) {
  const webResult = searchResult?.items;
  const firstItem = webResult?.[0]; 

  return (
    <div>
      <div className='flex gap-2 flex-wrap mt-5'>
        {webResult?.map((item, index) => {
          const imageSrc = item?.pagemap?.cse_thumbnail?.[0]?.src;

          return (
            <div
              key={index}
              className='p-3 bg-accent rounded-lg w-[200px] cursor-pointer hover:bg-blue-100'
              onClick={() => window.open(item.link, '_blank')}
            >
              <div className='flex gap-2 items-center'>
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={item?.pagemap?.metatags?.[0]?.["og:site_name"] || "result"}
                    width={20}
                    height={20}
                  />
                ) : null}
                <h2 className='text-xs'>{item?.displayLink}</h2>
              </div>
              <h2 className='line-clamp-2 text-black text-xs' dangerouslySetInnerHTML={{ __html: item?.htmlSnippet }} />
            </div>
          );
        })}

        {/* ✅ Use extracted item here */}
        {firstItem && (
          <div className='mt-4 w-full'>
            <div
              className='font-semibold text-base mb-1 line-clamp-2'
              dangerouslySetInnerHTML={{ __html: firstItem.htmlTitle }}
            />
            <div
              className='text-sm text-gray-700 line-clamp-3'
              dangerouslySetInnerHTML={{ __html: firstItem.htmlSnippet }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AnswerDisplay;
