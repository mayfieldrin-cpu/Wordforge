import { NextResponse } from 'next/server';
import { getWordOfTheDay } from '@/lib/wordnik';

export async function GET() {
  try {
    const wotd = await getWordOfTheDay();
    return NextResponse.json(wotd);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch word of the day' }, { status: 500 });
  }
}
