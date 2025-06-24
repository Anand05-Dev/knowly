'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
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
import SourceList from './SourceList';
import { SEARCH_RESULT } from '@/services/Shared';
import { supabase } from '@/services/supabase';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserDetailContext } from '@/context/UserDetailsContext';
import { useUser } from '@clerk/nextjs';

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState('Answer');
  const [searchResult, setSearchResult] = useState(SEARCH_RESULT);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userInput, setUserInput] = useState('');
  const bottomRef = useRef(null);
  const { libId } = useParams();
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const tabs = [
    { label: 'Answer', icon: LucideSparkles },
    { label: 'Images', icon: LucideImage },
    { label: 'Videos', icon: LucideVideo },
    { label: 'Sources', icon: LucideList },
  ];

  useEffect(() => {
    if (!searchInputRecord) return;

    const hasChats = Array.isArray(searchInputRecord?.Chats) && searchInputRecord?.Chats.length > 0;

    if (!hasChats && userDetail?.credit > 0) {
      GetSearchApiResult();
    }

    const uniqueChats = deduplicateChats(searchInputRecord?.Chats);
    uniqueChats.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    setSearchResult({ ...searchInputRecord, Chats: uniqueChats });
  }, [searchInputRecord]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [searchResult?.Chats]);

  const deduplicateChats = (chats) => {
    return chats?.filter(
      (chat, index, self) =>
        index === self.findIndex((c) => c.userSearchInput === chat.userSearchInput)
    ) || [];
  };

  const GetSearchApiResult = async () => {
    if (!userDetail || userDetail.credit <= 0) {
      alert("❌ You've reached your free limit. Upgrade to Pro to continue.");
      return;
    }

    setLoadingSearch(true);
    const searchInputValue = userInput || searchInputRecord?.searchInput;

    const result = await axios.post('/api/google-search-api', {
      searchInput: searchInputValue,
      searchType: searchInputRecord?.type ?? 'Search',
    });

    const searchResp = result.data;
    const formattedSearchResp = searchResp?.items?.map((item) => ({
      title: item?.title,
      description: item?.snippet,
      long_name: item?.displayLink,
      url: item?.link,
      thumbnail: item?.pagemap?.cse_thumbnail?.[0]?.src || '',
    }));

    const { data: existingChats } = await supabase
      .from('Chats')
      .select('*')
      .eq('libId', libId)
      .eq('userSearchInput', searchInputValue);

    if (!existingChats?.length) {
      const { data } = await supabase
        .from('Chats')
        .insert([
          {
            libId,
            searchResult: formattedSearchResp,
            userSearchInput: searchInputValue,
          },
        ])
        .select();

      if (data?.length) {
        const newChat = data[0];

        // 🧠 Deduct credit
        const email = user?.primaryEmailAddress?.emailAddress;
        if (email) {
          const { error: rpcError } = await supabase.rpc("decrement_credit", {
            email_param: email,
          });
          if (!rpcError) {
            const { data: updatedUser } = await supabase
              .from('users')
              .select('credit, subscription')
              .eq('email', email)
              .single();
            if (updatedUser) setUserDetail(updatedUser);
          }
        }

        setSearchResult((prev) => ({
          ...prev,
          Chats: [...(prev?.Chats || []), newChat],
        }));

        await GenerateAIResp(formattedSearchResp, newChat.id);
      }
    }

    setUserInput('');
    setLoadingSearch(false);
  };

  const GenerateAIResp = async (formattedSearchResp, recordId) => {
    const result = await axios.post('/api/llm-model', {
      searchInput: searchInputRecord?.searchInput,
      searchResult: formattedSearchResp,
      recordId,
    });

    const runId = result.data?.runId;

    const interval = setInterval(async () => {
      const runResp = await axios.post('/api/get-inngest-status', { runId });

      if (runResp?.data?.data?.[0]?.status === 'Completed') {
        clearInterval(interval);

        const { data: updatedChats } = await supabase
          .from('Chats')
          .select('*')
          .eq('libId', libId)
          .order('created_at', { ascending: true });

        const uniqueChats = deduplicateChats(updatedChats);
        setSearchResult((prev) => ({
          ...prev,
          Chats: uniqueChats,
        }));
      }
    }, 1000);
  };

  const chats = searchResult?.Chats || [];

  return (
    <div className="mt-7">
      {loadingSearch && chats.length === 0 && (
        <div className="space-y-3">
          <div className="w-full h-5 bg-gray-200 animate-pulse rounded-md" />
          <div className="w-5/6 h-5 bg-gray-200 animate-pulse rounded-md" />
          <div className="w-2/3 h-5 bg-gray-200 animate-pulse rounded-md" />
        </div>
      )}

      {chats.length > 0 && (
        <div className="space-y-10">
          {chats.map((chat, index) => (
            <div key={chat.id || index}>
              <h2 className="font-bold text-2xl text-gray-600">{chat.userSearchInput}</h2>

              <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-4">
                {tabs.map(({ label, icon: Icon, badge }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`flex items-center gap-1 relative text-sm font-medium ${
                      activeTab === label ? 'text-black' : 'text-gray-700'
                    } hover:text-black`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {badge && label === 'Sources' && (
                      <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {badge}
                      </span>
                    )}
                    {activeTab === label && (
                      <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                {activeTab === 'Answer' && (
                  <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />
                )}
                {activeTab === 'Images' && <ImageListTab chat={chat} />}
                {activeTab === 'Videos' && <VideoDisplay chat={chat} />}
                {activeTab === 'Sources' && <SourceList chat={chat} />}
              </div>
              <hr className="my-5" />
            </div>
          ))}
        </div>
      )}

      <div
        ref={bottomRef}
        className="flex items-center gap-2 bg-white w-full border border-gray-200 rounded-lg shadow-sm p-3 px-4 mt-4 mb-4 sticky bottom-2 z-10"
      >
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
            {loadingSearch ? (
              <Loader className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <LucideSend className="w-5 h-5 text-blue-500" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default DisplayResult;
