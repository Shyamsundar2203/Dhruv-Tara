import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, apiKey } = await req.json();

    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing Gemini API Key. Provide it in Settings." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const history = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastUserMessage = history.pop()?.parts[0]?.text || "Hello";

    const chat = model.startChat({
      history,
      systemInstruction: systemPrompt || "You are an AI assistant in Operation Dhruv Tara.",
    });

    const result = await chat.sendMessage(lastUserMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process AI chat request." },
      { status: 500 }
    );
  }
}
