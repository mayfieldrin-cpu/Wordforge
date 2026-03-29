const BASE_URL = 'https://api.wordnik.com/v4';

function getApiKey() {
  return process.env.WORDNIK_API_KEY || '';
}

export interface Definition {
  text: string;
  partOfSpeech: string;
  sourceDictionary: string;
  attributionText?: string;
}

export interface RelatedWord {
  relationshipType: string;
  words: string[];
}

export interface Example {
  text: string;
  title?: string;
  url?: string;
}

export interface WordData {
  word: string;
  definitions?: Definition[];
  relatedWords?: RelatedWord[];
  examples?: Example[];
  frequency?: number;
}

export interface RandomWordOptions {
  includePartOfSpeech?: string;
  minLength?: number;
  maxLength?: number;
  minCorpusCount?: number;
}

async function wordnikFetch(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = getApiKey();
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Wordnik API error: ${res.status}`);
  return res.json();
}

export async function getDefinitions(word: string): Promise<Definition[]> {
  try {
    const data = await wordnikFetch(`/word.json/${encodeURIComponent(word)}/definitions`, {
      limit: '5',
      includeRelated: 'false',
      useCanonical: 'false',
      includeTags: 'false',
    });
    return data || [];
  } catch {
    return [];
  }
}

export async function getRelatedWords(word: string): Promise<RelatedWord[]> {
  try {
    const data = await wordnikFetch(`/word.json/${encodeURIComponent(word)}/relatedWords`, {
      useCanonical: 'false',
      limitPerRelationshipType: '10',
    });
    return data || [];
  } catch {
    return [];
  }
}

export async function getExamples(word: string): Promise<Example[]> {
  try {
    const data = await wordnikFetch(`/word.json/${encodeURIComponent(word)}/examples`, {
      includeDuplicates: 'false',
      useCanonical: 'false',
      skip: '0',
      limit: '5',
    });
    return data?.examples || [];
  } catch {
    return [];
  }
}

export async function getRandomWord(options: RandomWordOptions = {}): Promise<string> {
  const params: Record<string, string> = {
    hasDictionaryDef: 'true',
    minCorpusCount: String(options.minCorpusCount ?? 5000),
    minLength: String(options.minLength ?? 4),
    maxLength: String(options.maxLength ?? 12),
  };
  if (options.includePartOfSpeech) {
    params.includePartOfSpeech = options.includePartOfSpeech;
  }
  const data = await wordnikFetch('/words.json/randomWord', params);
  return data.word;
}

export async function getRandomWords(count: number = 5, options: RandomWordOptions = {}): Promise<string[]> {
  const params: Record<string, string> = {
    hasDictionaryDef: 'true',
    minCorpusCount: String(options.minCorpusCount ?? 5000),
    minLength: String(options.minLength ?? 4),
    maxLength: String(options.maxLength ?? 12),
    limit: String(count),
  };
  if (options.includePartOfSpeech) {
    params.includePartOfSpeech = options.includePartOfSpeech;
  }
  const data = await wordnikFetch('/words.json/randomWords', params);
  return (data || []).map((w: { word: string }) => w.word);
}

export async function getWordOfTheDay(): Promise<{ word: string; definitions: Definition[]; note?: string }> {
  const data = await wordnikFetch('/words.json/wordOfTheDay');
  return {
    word: data.word,
    definitions: (data.definitions || []).map((d: { text: string; partOfSpeech: string }) => ({
      text: d.text,
      partOfSpeech: d.partOfSpeech,
      sourceDictionary: 'wordOfTheDay',
    })),
    note: data.note,
  };
}

export async function searchWords(query: string, limit: number = 10): Promise<string[]> {
  try {
    const data = await wordnikFetch('/words.json/search/' + encodeURIComponent(query), {
      limit: String(limit),
      skip: '0',
    });
    return (data?.searchResults || []).map((r: { word: string }) => r.word);
  } catch {
    return [];
  }
}

export async function getFrequency(word: string): Promise<number> {
  try {
    const data = await wordnikFetch(`/word.json/${encodeURIComponent(word)}/frequency`, {
      useCanonical: 'false',
      startYear: '2000',
      endYear: '2012',
    });
    return data?.totalCount || 0;
  } catch {
    return 0;
  }
}
