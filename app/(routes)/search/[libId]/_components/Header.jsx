"use client";

import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { Clock, Link, Send } from 'lucide-react';
import moment from 'moment';
import React from 'react';

function Header({ searchInputRecord }) {
  return (
    <div className='p-4 border-b flex justify-between items-center w-full'>
      {/* Left: User & Time */}
      <div className='flex items-center gap-4'>
        <UserButton />
        <div className='flex items-center gap-1 text-gray-600 text-sm'>
          <Clock className='h-4 w-4' />
          <span>{moment(searchInputRecord?.created_at).fromNow()}</span>
        </div>
      </div>

      {/* Center: Query */}
      <h2 className='text-base font-medium truncate max-w-[40%] text-center'>
        {searchInputRecord?.searchInput}
      </h2>

      {/* Right: Buttons */}
      <div className='flex gap-3'>
        <Button variant="outline" size="icon"><Link className='h-4 w-4' /></Button>
        <Button><Send className='h-4 w-4 mr-1' /> Share</Button>
      </div>
    </div>
  );
}

export default Header;
