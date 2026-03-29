import { NextRequest, NextResponse } from 'next/server';
import { getRandomWords, getRelatedWords } from '@/lib/wordnik';

// Generates a creative "spark" - random word combos for ideation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'mashup'; // mashup | chain | contrast

  try {
    if (mode === 'mashup') {
      // Get random noun + verb + adjective for ideation
      const [nouns, verbs, adjectives] = await Promise.all([
        getRandomWords(3, { includePartOfSpeech: 'noun', minCorpusCount: 2000, minLength: 4, maxLength: 10 }),
        getRandomWords(3, { includePartOfSpeech: 'verb', minCorpusCount: 2000, minLength: 4, maxLength: 10 }),
        getRandomWords(3, { includePartOfSpeech: 'adjective', minCorpusCount: 2000, minLength: 4, maxLength: 10 }),
      ]);
      return NextResponse.json({ mode, nouns, verbs, adjectives });
    }

    if (mode === 'chain') {
      // Start with a word, get related words, chain outward
      const seeds = await getRandomWords(1, { minCorpusCount: 5000, minLength: 5, maxLength: 8 });
      const seed = seeds[0];
      const related = await getRelatedWords(seed);
      const synonyms = related.find(r => r.relationshipType === 'synonym')?.words?.slice(0, 5) || [];
      const antonyms = related.find(r => r.relationshipType === 'antonym')?.words?.slice(0, 3) || [];
      const hypernyms = related.find(r => r.relationshipType === 'hypernym')?.words?.slice(0, 3) || [];
      const hyponyms = related.find(r => r.relationshipType === 'hyponym')?.words?.slice(0, 5) || [];
      return NextResponse.json({ mode, seed, synonyms, antonyms, hypernyms, hyponyms });
    }

    if (mode === 'contrast') {
      // Pair contrasting concepts
      const [word1, word2] = await getRandomWords(2, { minCorpusCount: 3000, minLength: 4, maxLength: 10 });
      const [related1, related2] = await Promise.all([
        getRelatedWords(word1),
        getRelatedWords(word2),
      ]);
      const getAntonyms = (rel: { relationshipType: string; words: string[] }[]) =>
        rel.find(r => r.relationshipType === 'antonym')?.words?.slice(0, 3) || [];
      return NextResponse.json({
        mode,
        word1, word2,
        antonyms1: getAntonyms(related1),
        antonyms2: getAntonyms(related2),
      });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate spark' }, { status: 500 });
  }
}
