import { NextResponse } from 'next/server';
import { getWordOfTheDay } from '@/lib/wordnik';

export async function GET() {
  try {
    const wotd = await getWordOfTheDay();
    return NextResponse.json(wotd);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      word: 'serendipity',
      definitions: [{ text: 'The faculty of making fortunate discoveries by accident.', partOfSpeech: 'noun', sourceDictionary: 'fallback' }],
      note: '',
    });
  }
}
