'use client';

import { useState, useEffect } from 'react';

interface Definition {
  text: string;
  partOfSpeech: string;
  sourceDictionary: string;
}

interface RelatedWord {
  relationshipType: string;
  words: string[];
}

interface Example {
  text: string;
  title?: string;
}

interface WordData {
  word: string;
  definitions: Definition[];
  relatedWords: RelatedWord[];
  examples: Example[];
}

const POS_COLORS: Record<string, { bg: string; text: string }> = {
  noun: { bg: '#f0e8f8', text: '#6b3fa0' },
  verb: { bg: '#e8f4e8', text: '#2d6e3e' },
  adjective: { bg: '#fff3e0', text: '#b56a00' },
  adverb: { bg: '#e3f2fd', text: '#1565c0' },
  'verb-transitive': { bg: '#e8f4e8', text: '#2d6e3e' },
  'verb-intransitive': { bg: '#e8f4e8', text: '#2d6e3e' },
  default: { bg: 'var(--cream)', text: 'var(--mist)' },
};

const REL_LABELS: Record<string, string> = {
  synonym: 'Synonyms',
  antonym: 'Antonyms',
  hypernym: 'Is a kind of',
  hyponym: 'Kinds include',
  'same-context': 'Same context',
  'etymologically-related-term': 'Related roots',
  variant: 'Variants',
  'rhyme': 'Rhymes',
  'cross-reference': 'See also',
};

function posColor(pos: string) {
  return POS_COLORS[pos?.toLowerCase()] || POS_COLORS.default;
}

function stripHtml(html: string) {
  return html?.replace(/<[^>]+>/g, '') || '';
}

interface Props {
  initialWord?: string | null;
  onWordUsed?: () => void;
}

export default function WordExplorer({ initialWord, onWordUsed }: Props) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialWord) {
      setQuery(initialWord);
      lookup(initialWord);
      onWordUsed?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWord]);

  async function lookup(word: string) {
    if (!word.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/word?word=${encodeURIComponent(word.trim())}`);
      if (!res.ok) throw new Error('Not found');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Could not find that word. Try another!');
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') lookup(query);
  }

  function clickRelated(word: string) {
    setQuery(word);
    lookup(word);
  }

  return (
    <div className="animate-fade-up">
      {/* Title */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--ink)', marginBottom: 8 }}>
          Word Explorer
        </h2>
        <p style={{ color: 'var(--mist)', fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>
          Uncover definitions, examples, related words, and semantic connections.
        </p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        <input
          className="input-field"
          style={{ maxWidth: 360, fontSize: '1rem' }}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter a word..."
          autoFocus
        />
        <button
          className="btn btn-primary"
          onClick={() => lookup(query)}
          disabled={loading || !query.trim()}
        >
          {loading ? <span className="loading-dots">Exploring</span> : '→ Explore'}
        </button>
      </div>

      {/* Quick starters */}
      {!data && !loading && (
        <div className="animate-fade-in" style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Try these
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['serendipity', 'ephemeral', 'labyrinth', 'phosphorescent', 'melancholy', 'petrichor', 'luminous'].map(w => (
              <button
                key={w}
                className="word-badge"
                onClick={() => { setQuery(w); lookup(w); }}
                style={{ background: 'var(--cream)', color: 'var(--ink)', border: '1px solid rgba(26,20,18,0.1)' }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--rust)', fontFamily: 'var(--mono)', fontSize: '0.85rem', padding: '12px 16px', background: '#fff5f2', border: '1px solid rgba(196,84,42,0.2)', borderRadius: 2 }}>
          {error}
        </div>
      )}

      {data && (
        <div className="animate-fade-in" style={{ display: 'grid', gap: 20 }}>
          {/* Word header */}
          <div className="card" style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 className="font-serif" style={{ fontSize: '3rem', color: 'var(--ink)', lineHeight: 1, marginBottom: 8 }}>
                  {data.word}
                </h2>
                {data.definitions[0]?.partOfSpeech && (
                  <span className="pos-tag" style={{
                    ...posColor(data.definitions[0].partOfSpeech),
                    fontFamily: 'var(--mono)',
                  }}>
                    {data.definitions[0].partOfSpeech}
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.1em' }}>
                  {data.definitions.length} definition{data.definitions.length !== 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.1em' }}>
                  {data.relatedWords.length} relation type{data.relatedWords.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: 20 }}>
            {/* Left col */}
            <div style={{ display: 'grid', gap: 20 }}>
              {/* Definitions */}
              {data.definitions.length > 0 && (
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 16 }}>
                    Definitions
                  </h3>
                  <ol style={{ listStyle: 'none', display: 'grid', gap: 16 }}>
                    {data.definitions.slice(0, 4).map((def, i) => (
                      <li key={i} style={{ display: 'flex', gap: 14 }}>
                        <span style={{ minWidth: 20, height: 20, background: 'var(--rust)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontFamily: 'var(--mono)', flexShrink: 0, marginTop: 2 }}>
                          {i + 1}
                        </span>
                        <div>
                          <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>
                            {stripHtml(def.text)}
                          </p>
                          {def.partOfSpeech && (
                            <span className="pos-tag" style={{ ...posColor(def.partOfSpeech), marginTop: 6, display: 'inline-block', fontFamily: 'var(--mono)' }}>
                              {def.partOfSpeech}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Examples */}
              {data.examples.length > 0 && (
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 16 }}>
                    In the wild
                  </h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {data.examples.slice(0, 3).map((ex, i) => (
                      <div key={i} style={{ borderLeft: '3px solid var(--rust)', paddingLeft: 14 }}>
                        <p className="font-serif" style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink)', fontStyle: 'italic' }}>
                          "{stripHtml(ex.text)}"
                        </p>
                        {ex.title && (
                          <p style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: 4, fontFamily: 'var(--mono)' }}>
                            — {ex.title}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right col — Related words */}
            <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
              {data.relatedWords.length > 0 && data.relatedWords.map((rel) => (
                <div key={rel.relationshipType} className="card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 12 }}>
                    {REL_LABELS[rel.relationshipType] || rel.relationshipType}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {rel.words.slice(0, 8).map(w => (
                      <button
                        key={w}
                        className="word-badge"
                        onClick={() => clickRelated(w)}
                        style={{
                          background: rel.relationshipType === 'synonym' ? '#f0e8f8' :
                            rel.relationshipType === 'antonym' ? '#fff0f0' :
                            'var(--cream)',
                          color: rel.relationshipType === 'synonym' ? '#6b3fa0' :
                            rel.relationshipType === 'antonym' ? '#a03030' :
                            'var(--ink)',
                          border: '1px solid transparent',
                        }}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {data.relatedWords.length === 0 && (
                <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--mist)', fontSize: '0.8rem' }}>
                  No related words found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
