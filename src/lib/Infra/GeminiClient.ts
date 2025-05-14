import type { Message } from "$lib/Message.js";

export function GeminiClient(
  systemPromt: string,
  apiKey: string,
): (messages: Message[]) => Promise<string> {
  return async function (messages: Message[]): Promise<string> {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          stopSequences: ["```", "Here is", "Reasoning", "**", "Explanation"],
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`API error: ${err.error.message}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  };
}
