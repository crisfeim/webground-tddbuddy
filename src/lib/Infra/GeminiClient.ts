import type { Client } from "$lib/Client.js";

type Message = {
  role: string;
};
export function GeminiClient(
  systemPromt: string,
  apiKey: string,
): (message: string) => Promise<string> {
  return async function (message: string): Promise<string> {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPromt }] },
          { role: "user", parts: [{ text: message }] },
        ],
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
