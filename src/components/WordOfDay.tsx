'use client';

import { useState, useEffect } from 'react';

interface Definition {
  text: string;
  partOfSpeech: string;
}

interface WOTDData {
  word: string;
  definitions: Definition[];
  note?: string;
}

function stripHtml(html: string) {
  return html?.replace(/<[^>]+>/g, '') || '';
}

const POS_COLORS: Record<string, { bg: string; text: string }> = {
  noun: { bg: '#f0e8f8', text: '#6b3fa0' },
  verb: { bg: '#e8f8ee', text: '#2d6e3e' },
  adjective: { bg: '#fff3e0', text: '#b56a00' },
  adverb: { bg: '#e3f2fd', text: '#1565c0' },
  default: { bg: 'var(--cream)', text: 'var(--mist)' },
};

function posColor(pos: string) {
  return POS_COLORS[pos?.toLowerCase()] || POS_COLORS.default;
}

function getDateString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Letterpress-style ornamental divider
function Ornament() {
  return (
    <div style={{ textAlign: 'center', margin: '24px 0', color: 'var(--mist)', letterSpacing: '0.3em', fontSize: '0.8rem' }}>
      ✦ · · · ✦ · · · ✦
    </div>
  );
}

export default function WordOfDay() {
  const [data, setData] = useState<WOTDData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    fetch('/api/wotd')
      .then(r => r.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load word of the day.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mist)', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
        <span className="loading-dots">Loading today's word</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ color: 'var(--rust)', fontFamily: 'var(--mono)', fontSize: '0.85rem', padding: '16px', background: '#fff5f2', border: '1px solid rgba(196,84,42,0.2)', borderRadius: 2 }}>
        {error || 'Something went wrong.'}
      </div>
    );
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: 720, margin: '0 auto' }}>

      {/* Masthead */}
      <div style={{
        textAlign: 'center',
        padding: '48px 40px 40px',
        background: 'white',
        border: '1px solid rgba(26,20,18,0.1)',
        borderRadius: 2,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative corner marks */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            [pos.includes('top') ? 'top' : 'bottom']: 16,
            [pos.includes('left') ? 'left' : 'right']: 16,
            width: 20, height: 20,
            borderTop: pos.includes('top') ? '2px solid rgba(26,20,18,0.15)' : 'none',
            borderBottom: pos.includes('bottom') ? '2px solid rgba(26,20,18,0.15)' : 'none',
            borderLeft: pos.includes('left') ? '2px solid rgba(26,20,18,0.15)' : 'none',
            borderRight: pos.includes('right') ? '2px solid rgba(26,20,18,0.15)' : 'none',
          }} />
        ))}

        {/* Header */}
        <div style={{
          display: 'inline-block',
          border: '1px solid rgba(26,20,18,0.15)',
          padding: '4px 24px',
          borderRadius: 1,
          marginBottom: 24,
        }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mist)' }}>
            ✦ Word of the Day ✦
          </p>
        </div>

        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.06em', marginBottom: 32 }}>
          {getDateString()}
        </p>

        <Ornament />

        {/* The word */}
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: 'var(--ink)',
            lineHeight: 1,
            marginBottom: 20,
            letterSpacing: '-0.01em',
          }}
        >
          {data.word}
        </h1>

        {/* POS badges */}
        {data.definitions.length > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            {data.definitions.map(d => d.partOfSpeech).filter((pos, i, arr) => pos && arr.indexOf(pos) === i).map(pos => {
              const c = posColor(pos);
              return (
                <span key={pos} className="pos-tag" style={{ ...c, fontFamily: 'var(--mono)' }}>
                  {pos}
                </span>
              );
            })}
          </div>
        )}

        <Ornament />

        {/* Reveal toggle */}
        {!revealed ? (
          <button
            className="btn btn-primary"
            onClick={() => setRevealed(true)}
            style={{ fontSize: '0.85rem', padding: '12px 32px', marginTop: 8 }}
          >
            ✦ Reveal definition
          </button>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'left', marginTop: 8 }}>
            {data.definitions.slice(0, 3).map((def, i) => (
              <div key={i} style={{
                padding: '18px 24px',
                borderLeft: '3px solid var(--rust)',
                marginBottom: i < data.definitions.length - 1 ? 16 : 0,
                background: 'rgba(196,84,42,0.03)',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    minWidth: 22, height: 22,
                    background: 'var(--rust)', color: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontFamily: 'var(--mono)',
                    flexShrink: 0, marginTop: 3,
                  }}>
                    {i + 1}
                  </span>
                  <p className="font-serif" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink)', fontStyle: 'italic' }}>
                    {stripHtml(def.text)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor's note */}
      {data.note && revealed && (
        <div className="animate-fade-in card" style={{ padding: '24px 28px' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--mono)' }}>
            Editor's Note
          </p>
          <p className="font-serif" style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ink)' }}>
            {stripHtml(data.note)}
          </p>
        </div>
      )}

      {/* Usage prompt */}
      {revealed && (
        <div className="animate-fade-in" style={{ marginTop: 24 }}>
          <div style={{
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '28px 32px',
            borderRadius: 2,
          }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16, opacity: 0.5 }}>
              Creative Challenge
            </p>
            <p className="font-serif" style={{ fontSize: '1.15rem', lineHeight: 1.7, fontStyle: 'italic' }}>
              Use <em style={{ color: 'var(--gold)' }}>{data.word}</em> in a sentence, story opening, or project name today.
              The constraint is the fuel.
            </p>
          </div>
        </div>
      )}

      {/* Explore further */}
      {revealed && (
        <div className="animate-fade-in" style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--mist)', marginBottom: 12 }}>
            Want to go deeper?
          </p>
          <button
            className="btn btn-ghost"
            onClick={() => {
              // Copy word to clipboard as a convenience
              navigator.clipboard?.writeText(data.word);
              window.dispatchEvent(new CustomEvent('explore-word', { detail: data.word }));
            }}
            style={{ fontSize: '0.8rem' }}
          >
            ◎ Explore "{data.word}" in Word Explorer
          </button>
        </div>
      )}
    </div>
  );
}
