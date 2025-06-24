"use client";

import { supabase } from '@/services/supabase';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Header from './_components/Header';
import DisplayResult from './_components/DisplayResult';

function SearchQueryResult() {
  const params = useParams();
  const [searchInputRecord, setSearchInputRecord] = useState(null);
  const libId = params?.libId;

  useEffect(() => {
    if (libId) {
      GetSearchQueryRecord();
    }
  }, []);

  const GetSearchQueryRecord = async () => {
    const { data: Library, error } = await supabase
      .from('Library')
      .select('*,Chats(*)')
      .eq('libId', libId);
  
    if (error) {
      console.error("Supabase fetch error:", error.message);
      return;
    }
  
    if (Array.isArray(Library) && Library.length > 0) {
      console.log("Page.jsx Library", Library[0]);
      setSearchInputRecord(Library[0]);
    } else {
      console.warn("No record found for libId:", libId);
      setSearchInputRecord(null); // Or show fallback UI
    }
  };
  

  return (
    <div>
      <Header searchInputRecord={searchInputRecord} />
      <div className="px-10 md:px-20 lg:px-36 xl:px-56 mt-18">
        <DisplayResult searchInputRecord={searchInputRecord} />
      </div>
    </div>
  );
}

export default SearchQueryResult;
