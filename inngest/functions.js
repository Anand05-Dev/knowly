import { inngest } from './client';
import { supabase } from "@/services/supabase";
export const llmModel = inngest.createFunction(
  {
    id: 'llm-model',
    name: 'LLM Model Inference'
  },
  { event: 'llm-model' },
  async ({ event, step }) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const model = 'gemini-1.5-flash';

    // Call Gemini API directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Depends on User input Sources, Summarize and Search about topic. Give me markdown text with proper formatting. User Input is: ${event.data.searchInput}\n\nSources:\n${JSON.stringify(event.data.searchResult, null, 2)}`
              }
            ]
          }
        ]
      })
    });
    const result = await response.json();

    // Save to Supabase
    const saveToDb = await step.run('saveToDb', async () => {
      const { data, error } = await supabase
        .from('Chats')
        .update({ aiResp: result?.candidates?.[0]?.content?.parts?.[0]?.text || '' })
        .eq('id', event.data.recordId)
        .select();

      if (error) throw error;
      return result;
    });

    return saveToDb;
  }
);
