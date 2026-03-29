'use client';

import { useState, useCallback } from 'react';

type POS = 'any' | 'noun' | 'verb' | 'adjective' | 'adverb';

const POS_OPTIONS: { id: POS; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'noun', label: 'Nouns' },
  { id: 'verb', label: 'Verbs' },
  { id: 'adjective', label: 'Adjectives' },
  { id: 'adverb', label: 'Adverbs' },
];

const CARD_COLORS = [
  { bg: '#fff8f0', accent: '#c4542a' },
  { bg: '#f0f8ff', accent: '#1a4a8a' },
  { bg: '#f5fff0', accent: '#2d6e3e' },
  { bg: '#fff0f8', accent: '#8a1a5a' },
  { bg: '#fffff0', accent: '#8a7a00' },
  { bg: '#f0ffff', accent: '#006b6b' },
];

interface WordCard {
  word: string;
  color: typeof CARD_COLORS[0];
  pinned: boolean;
  id: number;
}

let idCounter = 0;

export default function RandomCanvas() {
  const [pos, setPos] = useState<POS>('any');
  const [count, setCount] = useState(9);
  const [cards, setCards] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [minLen, setMinLen] = useState(4);
  const [maxLen, setMaxLen] = useState(12);

  const shuffle = useCallback(async (keepPinned = false) => {
    setLoading(true);
    try {
      const pinned = keepPinned ? cards.filter(c => c.pinned) : [];
      const needed = count - pinned.length;
      const params = new URLSearchParams({ count: String(needed), minLength: String(minLen), maxLength: String(maxLen) });
      if (pos !== 'any') params.set('pos', pos);
      const res = await fetch(`/api/random?${params}`);
      const json = await res.json();
      const newCards: WordCard[] = (json.words || []).map((w: string) => ({
        word: w,
        color: CARD_COLORS[idCounter % CARD_COLORS.length],
        pinned: false,
        id: idCounter++,
      }));
      setCards([...pinned, ...newCards]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [pos, count, minLen, maxLen, cards]);

  function togglePin(id: number) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  }

  function removeCard(id: number) {
    setCards(prev => prev.filter(c => c.id !== id));
  }

  const pinnedCount = cards.filter(c => c.pinned).length;

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 32 }}>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--ink)', marginBottom: 8 }}>
          Random Canvas
        </h2>
        <p style={{ color: 'var(--mist)', fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>
          Shuffle words onto your canvas. Pin the ones that spark something. Keep shuffling.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginBottom: 28 }}>
        {/* POS filter */}
        <div>
          <p style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Part of Speech
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {POS_OPTIONS.map(p => (
              <button
                key={p.id}
                onClick={() => setPos(p.id)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  border: pos === p.id ? '2px solid var(--rust)' : '1px solid rgba(26,20,18,0.15)',
                  background: pos === p.id ? 'var(--rust)' : 'white',
                  color: pos === p.id ? 'white' : 'var(--ink)',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <p style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Count
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[6, 9, 12, 15].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  border: count === n ? '2px solid var(--rust)' : '1px solid rgba(26,20,18,0.15)',
                  background: count === n ? 'var(--rust)' : 'white',
                  color: count === n ? 'white' : 'var(--ink)',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Length range */}
        <div>
          <p style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Word Length
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number" min={2} max={maxLen} value={minLen}
              onChange={e => setMinLen(Number(e.target.value))}
              className="input-field"
              style={{ width: 60, textAlign: 'center' }}
            />
            <span style={{ color: 'var(--mist)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>–</span>
            <input
              type="number" min={minLen} max={20} value={maxLen}
              onChange={e => setMaxLen(Number(e.target.value))}
              className="input-field"
              style={{ width: 60, textAlign: 'center' }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={() => shuffle(false)}
          disabled={loading}
          style={{ fontSize: '0.9rem', padding: '12px 28px' }}
        >
          {loading ? <span className="loading-dots">Shuffling</span> : '◈ Shuffle'}
        </button>
        {pinnedCount > 0 && (
          <button
            className="btn btn-ghost"
            onClick={() => shuffle(true)}
            disabled={loading}
          >
            ↻ Reshuffle (keep {pinnedCount} pinned)
          </button>
        )}
        {cards.length > 0 && (
          <button
            className="btn btn-ghost"
            onClick={() => setCards([])}
          >
            ✕ Clear all
          </button>
        )}
      </div>

      {/* Canvas */}
      {cards.length > 0 && (
        <div
          className="animate-fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 14,
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="animate-fade-up"
              style={{
                animationDelay: `${i * 0.05}s`,
                background: card.pinned ? card.color.bg : 'white',
                border: card.pinned
                  ? `2px solid ${card.color.accent}`
                  : '1px solid rgba(26,20,18,0.1)',
                borderRadius: 2,
                padding: '20px 16px',
                position: 'relative',
                boxShadow: card.pinned
                  ? `4px 4px 0 ${card.color.accent}30`
                  : '2px 2px 0 rgba(26,20,18,0.05)',
                transition: 'all 0.2s ease',
                minHeight: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Controls */}
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                <button
                  onClick={() => togglePin(card.id)}
                  title={card.pinned ? 'Unpin' : 'Pin'}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.8rem', opacity: card.pinned ? 1 : 0.3,
                    color: card.color.accent,
                    transition: 'opacity 0.15s',
                    padding: 2,
                  }}
                >
                  ✦
                </button>
                <button
                  onClick={() => removeCard(card.id)}
                  title="Remove"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.75rem', opacity: 0.2, color: 'var(--ink)',
                    transition: 'opacity 0.15s',
                    padding: 2,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.2')}
                >
                  ✕
                </button>
              </div>

              <span
                className="font-serif"
                style={{
                  fontSize: card.word.length > 10 ? '1.1rem' : card.word.length > 7 ? '1.35rem' : '1.6rem',
                  color: card.pinned ? card.color.accent : 'var(--ink)',
                  lineHeight: 1.2,
                  textAlign: 'center',
                  transition: 'color 0.2s ease',
                }}
              >
                {card.word}
              </span>
            </div>
          ))}
        </div>
      )}

      {cards.length === 0 && (
        <div style={{
          border: '2px dashed rgba(26,20,18,0.12)',
          borderRadius: 2,
          padding: '60px 40px',
          textAlign: 'center',
          color: 'var(--mist)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>◈</div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
            Hit Shuffle to fill your canvas with random words
          </p>
        </div>
      )}
    </div>
  );
}
