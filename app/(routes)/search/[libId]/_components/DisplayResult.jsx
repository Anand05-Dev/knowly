import React, { useState, useEffect } from 'react';
import {
  Sparkles as LucideSparkles,
  Image as LucideImage,
  Video as LucideVideo,
  List as LucideList,
  Send as LucideSend,
  Loader,
} from 'lucide-react';

import axios from 'axios';
import AnswerDisplay from './AnswerDisplay';
import ImageListTab from './ImageListTab';
import VideoDisplay from './VideoDisplay';
import { SEARCH_RESULT } from '@/services/Shared';
import { supabase } from '@/services/supabase';
import { useParams } from 'next/navigation';
import SourceList from './SourceList';
import { Button } from '@/components/ui/button';

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState('Answer');
  const [searchResult, setSearchResult] = useState(SEARCH_RESULT);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userInput, setUserInput] = useState(''); 
  const { libId } = useParams();

  const tabs = [
    { label: 'Answer', icon: LucideSparkles },
    { label: 'Images', icon: LucideImage },
    { label: 'Videos', icon: LucideVideo },
    { label: 'Sources', icon: LucideList, badge: 5 },
  ];

  useEffect(() => {
    if (!searchInputRecord) return;

    const hasChats = Array.isArray(searchInputRecord?.Chats) && searchInputRecord?.Chats.length > 0;

    if (!hasChats) {
      GetSearchApiResult();
    }

    setSearchResult(searchInputRecord);
  }, [searchInputRecord]);

  const GetSearchApiResult = async () => {
    setLoadingSearch(true);
    const result = await axios.post('/api/google-search-api', {
      searchInput: userInput || searchInputRecord?.searchInput,
      searchType: searchInputRecord?.type ?? 'Search', // activeTab.toLowerCase(), Fixed from searchInputType?.type
    });

    const searchResp = result.data;
    const formattedSearchResp = searchResp?.items?.map((item) => ({
      title: item?.title,
      description: item?.snippet,
      long_name: item?.displayLink,
      // img: item?.pagemap?.metatags?.[0]?.['og:image'] || 'Image',
      url: item?.link,
      thumbnail: item?.pagemap?.cse_thumbnail?.[0]?.src || 'Thumbnail',
    }));

    const { data } = await supabase
      .from('Chats')
      .insert([
        {
          libId: libId,
          searchResult: formattedSearchResp,
          userSearchInput: userInput || searchInputRecord?.searchInput,
        },
      ])
      .select();

    if (data?.length) {
      const newChat = data[0];
      setSearchResult((prev) => ({
        ...prev,
        Chats: [...(prev?.Chats || []), newChat],
      }));
      setLoadingSearch(false);
      await GenerateAIResp(formattedSearchResp, newChat.id);
    }
  };

  // Pass to LLM model
  const GenerateAIResp = async (formattedSearchResp, recordId) => {
    const result = await axios.post('/api/llm-model', {
      searchInput: searchInputRecord?.searchInput,
      searchResult: formattedSearchResp,
      recordId: recordId,
    });

    const runId = result.data?.runId;

    const interval = setInterval(async () => {
      const runResp = await axios.post('/api/get-inngest-status', {
        runId: runId,
      });

      if (runResp?.data?.data[0]?.status === 'Completed') {
        clearInterval(interval);
        // get updated data from database if needed
      }
    }, 1000);
  };

  return (
    <div className="mt-7">
      {/* <h2 className="text-3xl font-medium line-clamp-2 max-w-[40%] mb-4">
        {searchInputRecord?.searchInput}
      </h2> */}
      {loadingSearch && !searchResult?.Chats?.length && (
        <div className="space-y-3">
          <div className="w-full h-5 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="w-5/6 h-5 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="w-2/3 h-5 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      )}
      {searchResult?.Chats?.map((chat, index) => (
        <div key={index} className="mt-7">
          <h2 className="font-bold text-3xl text-gray-600">{chat.userSearchInput}</h2>
          <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
            {tabs.map(({ label, icon: Icon, badge }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-1 relative text-sm font-medium ${activeTab === label ? 'text-black' : 'text-gray-700'
                  } hover:text-black`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
                {activeTab === label && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                )}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-500">
              1 task<span className="ml-1">↗</span>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'Answer' && <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />}
            {activeTab === 'Images' && <ImageListTab chat={chat} />}
            {activeTab === 'Videos' && <VideoDisplay chat={chat} />}
            {activeTab === 'Sources' && <SourceList chat={chat} />}
          </div>
          <hr className="my-5" />
        </div>
      ))}
      {/* Styled input box */}
      <div className="flex items-center gap-2 bg-white w-full border border-gray-200 rounded-lg shadow-sm p-3 px-4 mt-4 mb-4 sticky bottom-2 z-10">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask similar to this topic"
          className="flex-grow outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        {userInput?.trim() && (
          <Button
            onClick={GetSearchApiResult}
            size="icon"
            variant="ghost"
            disabled={loadingSearch} 
          >
            {loadingSearch ? <Loader className="w-5 h-5 animate-spin text-blue-500" /> : (
              <LucideSend className="w-5 h-5 text-blue-500" />
            )}
          </Button>
        )}
      </div>


    </div>
  );
}

export default DisplayResult;
