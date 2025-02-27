import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET() {
  try {
    console.log("Testing Claude API connection...");
    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [
        { role: "user", content: "Please respond with 'API test successful'" }
      ]
    });
    
    console.log("Test response received:", completion.content[0].text);
    return NextResponse.json({ success: true, message: completion.content[0].text });
  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json({ 
      error: `API Test Failed: ${error.message}`,
      details: error
    }, { status: 500 });
  }
} 