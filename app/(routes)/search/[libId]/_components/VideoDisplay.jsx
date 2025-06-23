import React from 'react';

function VideoDisplay({ chat }) {
  const videoResults = chat?.videoResult || [];

  return (
    <div className="flex flex-col gap-6">
      {videoResults.length === 0 ? (
        <p className="text-gray-500 text-sm">No video results found.</p>
      ) : (
        videoResults.map((video, index) => {
          const isYouTube = video.url?.includes('youtube.com') || video.url?.includes('youtu.be');
          const embedUrl = getYouTubeEmbedUrl(video.url);

          return (
            <div key={index} className="flex flex-col gap-2">
              <span className="font-semibold text-sm">{index + 1}. {video.title}</span>
              {isYouTube && embedUrl ? (
                <iframe
                  width="560"
                  height="315"
                  src={embedUrl}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg max-w-full"
                />
              ) : (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  Watch Video
                </a>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// Helper function to convert YouTube link to embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  return null;
}

export default VideoDisplay;
