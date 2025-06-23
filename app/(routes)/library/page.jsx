"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import moment from 'moment';

function Library() {
  const { user } = useUser();
  const router = useRouter();
  const [libraryHistory, setLibraryHistory] = useState([]);

  useEffect(() => {
    if (user) {
      GetLibraryHistory();
    }
  }, [user]);

  const GetLibraryHistory = async () => {
    const { data, error } = await supabase
      .from('Library')
      .select('*')
      .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching library data:', error);
    } else {
      setLibraryHistory(data || []);
    }
  };

  const handleClick = (libId) => {
    router.push(`/search/${libId}`);
  };

  return (
    <div className="px-6 md:px-20 lg:px-36 xl:px-56 mt-12">
      <h2 className="font-bold text-2xl text-gray-800 mb-6">Library</h2>

      {libraryHistory.length === 0 ? (
        <p className="text-gray-500 text-sm">No search history found.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200">
          {libraryHistory.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 px-2 cursor-pointer hover:bg-gray-50 transition-all"
              onClick={() => handleClick(item.libId)}
            >
              <div>
                <h3 className="text-base font-bold text-black">
                  {item.searchInput || 'Untitled'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {moment(item.created_at).fromNow()}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
