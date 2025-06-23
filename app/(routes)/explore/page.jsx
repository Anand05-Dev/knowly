"use client";

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';

// Sample Data
const featuredNews = {
  title: 'Sunoco acquires Parkland for $9.1 billion',
  description: 'Sunoco LP has announced a definitive agreement to acquire Canada-based Parkland Corporation in a cash and equity transaction valued at approximately $9.1 billion...',
  thumbnail: 'https://source.unsplash.com/featured/?gasstation',
  author: 'aetheris',
  time: moment().subtract(2, 'hours').fromNow(), // "2 hours ago"
};

const trendingTopics = [
  'MrBeast',
  'zerobillion.ai',
  'H1B Visa News',
  'Latest iPhone iOS version',
  'AI Latest Models',
  'AI Models',
  'NextJs',
  'IPL Score',
  'AI Regulation',
];

function Explore() {
  const [selectedTab, setSelectedTab] = useState('Top');
  const router = useRouter();

  const tabs = ['Top', 'For You', 'Tech & Science', 'Finance', 'Arts & Culture', 'Sports'];

  // Navigate to /search/[query]
  const handleSearch = (query) => {
    const encodedQuery = encodeURIComponent(query);
    router.push(`/search/${encodedQuery}`);
  };

  return (
    <div className="px-4 md:px-10 xl:px-24 py-8">
      {/* Tabs */}
      <div className="flex gap-5 text-sm text-gray-700 font-medium mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 rounded-full border ${
              selectedTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'
            } transition`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured News Card - Clickable */}
      <div
        onClick={() => handleSearch(featuredNews.title)}
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition mb-8 cursor-pointer"
      >
        <img
          src={featuredNews.thumbnail}
          alt="News"
          className="w-full h-60 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {featuredNews.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {featuredNews.description}
          </p>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>@{featuredNews.author}</span>
            <span>{featuredNews.time}</span>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <h3 className="font-semibold text-gray-800 text-lg mb-3">Trending Topics</h3>
        <ul className="space-y-4">
          {trendingTopics.map((topic) => (
            <li
              key={topic}
              onClick={() => handleSearch(topic)}
              className="flex items-center justify-between border-b pb-2 hover:bg-gray-50 px-2 rounded cursor-pointer transition"
            >
              <div className="text-gray-800 text-sm">{topic}</div>
              <Sparkles className="w-4 h-4 text-gray-400" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Explore;
