import { NextRequest, NextResponse } from 'next/server';
import { getRandomWords } from '@/lib/wordnik';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '6');
  const partOfSpeech = searchParams.get('pos') || undefined;
  const minLength = parseInt(searchParams.get('minLength') || '4');
  const maxLength = parseInt(searchParams.get('maxLength') || '12');

  try {
    const words = await getRandomWords(count, {
      includePartOfSpeech: partOfSpeech,
      minLength,
      maxLength,
      minCorpusCount: 1000,
    });
    return NextResponse.json({ words });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch random words' }, { status: 500 });
  }
}
