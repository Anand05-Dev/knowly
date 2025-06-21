import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { searchInput, searchType } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY;
    const cx = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID;

    if (!searchInput) {
      return NextResponse.json({ error: "Please provide a search query." }, { status: 400 });
    }

    const result = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        q: searchInput,
        key: apiKey,
        cx: cx,
        num: 5, 
        ...(searchType === "image" && { searchType: "image" }),
      },
      headers: {
        Accept: "application/json",
      },
    });

    console.log(result.data);

    return NextResponse.json(result.data, { status: 200 });

  } catch (error) {
    console.error("Google Search API error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
