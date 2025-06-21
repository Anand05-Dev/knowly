import React, { useState, useEffect } from 'react';
import {
  Sparkles as LucideSparkles,
  Image as LucideImage,
  Video as LucideVideo,
  List as LucideList,
} from 'lucide-react';

import axios from 'axios';
import AnswerDisplay from './AnswerDisplay';
import ImageDisplay from './ImageDisplay';
import VideoDisplay from './VideoDisplay';
import SourceDisplay from './SourceDisplay';
import { SEARCH_RESULT } from '@/services/Shared';
import { supabase } from '@/services/supabase';
import { useParams } from 'next/navigation';

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState('Answer');
  const [searchResult, setSearchResult] = useState(SEARCH_RESULT);
  const { libId } = useParams();

  const tabs = [
    { label: 'Answer', icon: LucideSparkles },
    { label: 'Images', icon: LucideImage },
    { label: 'Videos', icon: LucideVideo },
    { label: 'Sources', icon: LucideList, badge: 10 },
  ];

  useEffect(() => {
    if (searchInputRecord) {
      GetSearchApiResult();
    }
  }, [searchInputRecord]);

  const GetSearchApiResult = async () => {
    // const result = await axios.post('/api/google-search-api', {
    //searchInput: searchInputRecord?.searchInput,
    // searchType: searchInputRecord?.type,      // activeTab.toLowerCase(), Fixed from searchInputType?.type
    // });
    //console.log(result.data);
    const searchResp = SEARCH_RESULT;
    const formattedSearchResp = searchResp?.items?.map((item, index) => (
      {
        title: item?.title,
        description: item?.snippet,
        long_name: item?.displayLink,
        img: item?.pagemap?.cse_thumbnail?.src,
        url: item?.link
      }
    ))
    console.log(formattedSearchResp);
    //console.log(JSON.stringify(result.data));
    const { data, error } = await supabase
      .from('Chats')
      .insert([
        {
          libId: libId,
          searchResult: formattedSearchResp
        }
      ])
      .select();
    console.log(data.id);
    await GenerateAIResp(formattedSearchResp, data[0]?.id);
  };
  //pass to llm model
  const GenerateAIResp = async (formattedSearchResp, recordId) => {
    const result = await axios.post('/api/llm-model', {
      sesrchInput: searchInputRecord?.sealchInput,
      searchResult: formattedSearchResp,
      recordId: recordId
    });
    console.log(result.data)
  };

  return (
    <div>
      <h2 className="text-3xl font-medium line-clamp-2 max-w-[40%] mb-4">
        {searchInputRecord?.searchInput}
      </h2>

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
        {activeTab === 'Answer' ? <AnswerDisplay searchResult={searchResult} /> : null}
        {activeTab === 'Images' ? <ImageDisplay /> : null}
        {activeTab === 'Videos' ? <VideoDisplay /> : null}
        {activeTab === 'Sources' ? <SourceDisplay searchResult={searchResult} /> : null}
      </div>
    </div>
  );
}

export default DisplayResult;
