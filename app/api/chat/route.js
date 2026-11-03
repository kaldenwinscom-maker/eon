import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: "Your name is Eon. You are Kalden's personal AI assistant. Be friendly, helpful and concise.",
      messages,
    });
    const reply = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: "Error: " + err.message }, { status: 500 });
  }
}
