import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {searchInput,searchResult,recordId}=await req.json();

      const inngestRunId= await inngest.send({
          name: "llm-model",
          data: {
            searchInput: searchInput,
            searchResult:searchResult,
            recordId:recordId
          },
        });
        return NextResponse.json({ runId: inngestRunId.ids[0] });
}


