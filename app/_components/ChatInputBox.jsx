"use client"; 

import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; 
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Atom,
  AudioLines,
  Cpu,
  Globe,
  Mic,
  Paperclip,
  SearchCheck,
  BrainCircuit,
  TrophyIcon,
  MapPinCheck,
  CalendarRangeIcon,
  LineChartIcon,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIModelsOption } from "@/services/Shared";
import { supabase } from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function ChatInputBox() {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [loading, setLoading] = useState(false); 
  const { user } = useUser();
  const [searchType, setSearchType] = useState("search");
  const router=useRouter();

  const onSearchQuery = async () => {
    setLoading(true);
    const libId = uuidv4();
    const { data, error } = await supabase
      .from("Library")
      .insert([
        {
          searchInput: userSearchInput,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          type: searchType,
          libId: libId,
        },
      ])
      .select();
      setLoading(false);
      router.push('/search/'+libId) ;
      console.log(data[0]);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Image src="/logo1.png" alt="logo" width={200} height={150} />

      <div className="p-1 w-full max-w-2xl border rounded-2xl mt-10">
        <div className="flex justify-between items-end">
          <Tabs
            defaultValue="search"
            value={searchType}
            onValueChange={(value) => setSearchType(value)}
            className="w-[400px]"
          >
            <TabsContent value="search">
              <input
                type="text"
                placeholder="Search Anything"
                onChange={(e) => setUserSearchInput(e.target.value)}
                className="w-full p-4 outline-none"
              />
            </TabsContent>
            <TabsContent value="research">
              <input
                type="text"
                placeholder="Research Anything"
                onChange={(e) => setUserSearchInput(e.target.value)}
                className="w-full p-4 outline-none"
              />
            </TabsContent>
            <TabsList>
              <TabsTrigger
                value="search"
                className="text-primary"
                onClick={() => setSearchType("search")}
              >
                <SearchCheck />
                Search
              </TabsTrigger>
              <TabsTrigger
                value="research"
                className="text-primary"
                onClick={() => setSearchType("research")}
              >
                <Atom />
                Research
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm flex items-center gap-2 border-none"
                >
                  <Cpu className="text-gray-600 h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AIModelsOption.map((model, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="mb-0.5">
                      <h2 className="text-sm">{model.name}</h2>
                      <p className="text-xs">{model.desc}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="text-sm flex items-center gap-2 border-none"
            >
              <Globe className="text-gray-600 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="text-sm flex items-center gap-2 border-none"
            >
              <Paperclip className="text-gray-600 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="text-sm flex items-center gap-2 border-none"
            >
              <Mic className="text-gray-600 h-5 w-5" />
            </Button>

            <Button
              onClick={() => {
                if (!loading && userSearchInput) onSearchQuery();
              }}
              disabled={loading} 
            >
              {loading ? (
                <span className="text-white text-sm">...</span> 
              ) : !userSearchInput ? (
                <AudioLines className="text-white h-5 w-5" />
              ) : (
                <ArrowRight className="text-white h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl p-4 flex flex-wrap gap-2 justify-center">
        <Button variant="outline" className="text-sm flex items-center gap-2">
          <BrainCircuit className="h-4 w-4" />
          Summarize
        </Button>
        <Button variant="outline" className="text-sm flex items-center gap-2">
          <TrophyIcon className="h-4 w-4" />
          Sports
        </Button>
        <Button variant="outline" className="text-sm flex items-center gap-2">
          <MapPinCheck className="h-4 w-4" />
          Local
        </Button>
        <Button variant="outline" className="text-sm flex items-center gap-2">
          <CalendarRangeIcon className="h-4 w-4" />
          Plan
        </Button>
        <Button variant="outline" className="text-sm flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          Analyze
        </Button>
      </div>
    </div>
  );
}

export default ChatInputBox;
