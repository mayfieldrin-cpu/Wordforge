import { NextRequest, NextResponse } from 'next/server';
import { getRelatedWords, getDefinitions } from '@/lib/wordnik';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  if (!word) return NextResponse.json({ error: 'Word is required' }, { status: 400 });

  try {
    const [related, definitions] = await Promise.all([
      getRelatedWords(word),
      getDefinitions(word),
    ]);

    // Build a constellation of connections
    const nodes: { word: string; type: string; definition?: string }[] = [
      { word, type: 'center', definition: definitions[0]?.text },
    ];
    const edges: { from: string; to: string; type: string }[] = [];

    const typeColors: Record<string, string> = {
      synonym: 'synonym',
      antonym: 'antonym',
      hypernym: 'hypernym',
      hyponym: 'hyponym',
      'same-context': 'context',
      'etymologically-related-term': 'etymology',
      variant: 'variant',
    };

    for (const rel of related) {
      const type = typeColors[rel.relationshipType] || rel.relationshipType;
      const words = rel.words?.slice(0, 6) || [];
      for (const w of words) {
        if (!nodes.find(n => n.word === w)) {
          nodes.push({ word: w, type });
        }
        edges.push({ from: word, to: w, type });
      }
    }

    return NextResponse.json({ word, nodes, edges, definitions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to build word web' }, { status: 500 });
  }
}
