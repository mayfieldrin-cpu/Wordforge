'use client';

import { useState } from 'react';

type Mode = 'mashup' | 'chain' | 'contrast';

interface MashupData {
  mode: 'mashup';
  nouns: string[];
  verbs: string[];
  adjectives: string[];
}

interface ChainData {
  mode: 'chain';
  seed: string;
  synonyms: string[];
  antonyms: string[];
  hypernyms: string[];
  hyponyms: string[];
}

interface ContrastData {
  mode: 'contrast';
  word1: string;
  word2: string;
  antonyms1: string[];
  antonyms2: string[];
}

type SparkData = MashupData | ChainData | ContrastData;

const MODES: { id: Mode; label: string; desc: string; icon: string }[] = [
  { id: 'mashup', label: 'Word Mashup', desc: 'Mix nouns, verbs & adjectives for unexpected combos', icon: '⚡' },
  { id: 'chain', label: 'Idea Chain', desc: 'Follow a word outward through semantic space', icon: '◎' },
  { id: 'contrast', label: 'Contrast Pair', desc: 'Pair opposing concepts to spark tension', icon: '◈' },
];

function Pill({ word, color = 'default' }: { word: string; color?: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    noun: { bg: '#f0e8f8', text: '#6b3fa0', border: '#d4b8f0' },
    verb: { bg: '#e8f8ee', text: '#2d6e3e', border: '#b8e8c8' },
    adjective: { bg: '#fff3e0', text: '#b56a00', border: '#f0d080' },
    synonym: { bg: '#e8f0ff', text: '#2040a0', border: '#b0c8f8' },
    antonym: { bg: '#fff0f0', text: '#a03030', border: '#f8c0c0' },
    hypernym: { bg: '#f8f0e8', text: '#6b4a20', border: '#e0c8a0' },
    hyponym: { bg: '#e8f8f8', text: '#206050', border: '#a0d8d0' },
    default: { bg: 'var(--cream)', text: 'var(--ink)', border: 'rgba(26,20,18,0.12)' },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 2, padding: '5px 14px',
      fontSize: '0.85rem', fontFamily: 'var(--mono)',
      display: 'inline-block',
    }}>
      {word}
    </span>
  );
}

function IdeaPrompt({ words }: { words: string[] }) {
  if (words.length < 2) return null;
  const adj = words[0];
  const noun = words[1];
  const verb = words[2] || 'create';
  const prompts = [
    `A ${adj} ${noun} that can ${verb}`,
    `What if a ${noun} could ${verb} in a ${adj} way?`,
    `The ${adj} ${noun}: a concept worth exploring`,
    `Designing for the ${adj} ${noun}`,
  ];
  const pick = prompts[Math.floor(Math.random() * prompts.length)];
  return (
    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(196,84,42,0.06)', borderLeft: '3px solid var(--rust)', borderRadius: '0 2px 2px 0' }}>
      <p style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Prompt idea</p>
      <p className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--ink)', fontStyle: 'italic' }}>{pick}</p>
    </div>
  );
}

export default function SparkStudio() {
  const [mode, setMode] = useState<Mode>('mashup');
  const [data, setData] = useState<SparkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SparkData[]>([]);

  async function generate() {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`/api/spark?mode=${mode}`);
      const json = await res.json();
      setData(json);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function saveToBoard() {
    if (data) setSaved(prev => [data, ...prev.slice(0, 9)]);
  }

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 32 }}>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--ink)', marginBottom: 8 }}>
          Spark Studio
        </h2>
        <p style={{ color: 'var(--mist)', fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>
          Ignite creative ideas through unexpected word pairings and semantic exploration.
        </p>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setData(null); }}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.8rem',
              padding: '10px 18px',
              border: mode === m.id ? '2px solid var(--rust)' : '1px solid rgba(26,20,18,0.15)',
              background: mode === m.id ? 'var(--rust)' : 'white',
              color: mode === m.id ? 'white' : 'var(--ink)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Mode description */}
      <p style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: 24, fontFamily: 'var(--mono)' }}>
        {MODES.find(m => m.id === mode)?.desc}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          className="btn btn-primary"
          onClick={generate}
          disabled={loading}
          style={{ fontSize: '0.9rem', padding: '12px 28px' }}
        >
          {loading ? <span className="loading-dots">Generating</span> : '⚡ Generate Spark'}
        </button>
        {data && (
          <button className="btn btn-ghost" onClick={saveToBoard}>
            ✦ Save to Board
          </button>
        )}
      </div>

      {/* Results */}
      {data && (
        <div className="animate-fade-in">
          {data.mode === 'mashup' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {(['adjectives', 'verbs', 'nouns'] as const).map((type) => (
                  <div key={type} className="card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 14 }}>
                      {type}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {data[type].map((w: string) => (
                        <Pill key={w} word={w} color={type === 'nouns' ? 'noun' : type === 'verbs' ? 'verb' : 'adjective'} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <IdeaPrompt words={[data.adjectives[0], data.nouns[0], data.verbs[0]]} />
            </div>
          )}

          {data.mode === 'chain' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Seed Word</p>
                <h3 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--rust)' }}>{data.seed}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { label: 'Synonyms', words: data.synonyms, color: 'synonym' },
                  { label: 'Antonyms', words: data.antonyms, color: 'antonym' },
                  { label: 'Is a kind of', words: data.hypernyms, color: 'hypernym' },
                  { label: 'Kinds include', words: data.hyponyms, color: 'hyponym' },
                ].map(({ label, words, color }) => words.length > 0 && (
                  <div key={label} className="card" style={{ padding: '18px' }}>
                    <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mist)', marginBottom: 10 }}>
                      {label}
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {words.map((w: string) => <Pill key={w} word={w} color={color} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.mode === 'contrast' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                  <h3 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--moss)' }}>{data.word1}</h3>
                  {data.antonyms1.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                      {data.antonyms1.map((w: string) => <Pill key={w} word={w} color="antonym" />)}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', color: 'var(--mist)', textAlign: 'center' }}>⟷</div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                  <h3 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--rust)' }}>{data.word2}</h3>
                  {data.antonyms2.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                      {data.antonyms2.map((w: string) => <Pill key={w} word={w} color="antonym" />)}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: '14px 20px', background: 'rgba(196,84,42,0.06)', borderLeft: '3px solid var(--rust)', borderRadius: '0 2px 2px 0' }}>
                <p className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--ink)', fontStyle: 'italic' }}>
                  What happens when "{data.word1}" meets "{data.word2}"? Explore the tension between them.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved board */}
      {saved.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <hr className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>
              Saved Sparks ({saved.length})
            </span>
            <hr className="divider" style={{ flex: 1, margin: 0 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {saved.map((s, i) => (
              <div key={i} className="card" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  {s.mode}
                </div>
                {s.mode === 'mashup' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[...s.adjectives.slice(0,1), ...s.verbs.slice(0,1), ...s.nouns.slice(0,1)].map(w => (
                      <Pill key={w} word={w} />
                    ))}
                  </div>
                )}
                {s.mode === 'chain' && (
                  <div className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--rust)' }}>{s.seed}</div>
                )}
                {s.mode === 'contrast' && (
                  <div className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--ink)' }}>
                    {s.word1} <span style={{ color: 'var(--mist)' }}>⟷</span> {s.word2}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
