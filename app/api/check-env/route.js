import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({ 
    hasKey: !!apiKey,
    keyLength: apiKey?.length,
    keyStart: apiKey?.substring(0, 10) + '...',
  });
} 