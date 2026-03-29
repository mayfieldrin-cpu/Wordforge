import { NextRequest, NextResponse } from 'next/server';
import { getDefinitions, getRelatedWords, getExamples } from '@/lib/wordnik';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  if (!word) return NextResponse.json({ error: 'Word is required' }, { status: 400 });

  try {
    const [definitions, relatedWords, examples] = await Promise.allSettled([
      getDefinitions(word),
      getRelatedWords(word),
      getExamples(word),
    ]);

    return NextResponse.json({
      word,
      definitions: definitions.status === 'fulfilled' ? definitions.value : [],
      relatedWords: relatedWords.status === 'fulfilled' ? relatedWords.value : [],
      examples: examples.status === 'fulfilled' ? examples.value : [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ word, definitions: [], relatedWords: [], examples: [] });
  }
}
