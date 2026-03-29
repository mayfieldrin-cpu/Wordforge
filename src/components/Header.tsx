'use client';

type Tool = 'explorer' | 'spark' | 'random' | 'wotd';

interface Props {
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
}

const tools: { id: Tool; label: string; desc: string; icon: string }[] = [
  { id: 'explorer', label: 'Word Explorer', desc: 'Deep dive into any word', icon: '◎' },
  { id: 'spark', label: 'Spark Studio', desc: 'Ignite creative combos', icon: '⚡' },
  { id: 'random', label: 'Random Canvas', desc: 'Shuffle for inspiration', icon: '◈' },
  { id: 'wotd', label: 'Word of the Day', desc: 'Daily linguistic gem', icon: '✦' },
];

export default function Header({ activeTool, setActiveTool }: Props) {
  return (
    <header style={{
      borderBottom: '1px solid rgba(26,20,18,0.1)',
      background: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 12px rgba(26,20,18,0.06)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0 12px',
          borderBottom: '1px solid rgba(26,20,18,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h1 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--ink)', lineHeight: 1 }}>
              Word<span style={{ color: 'var(--rust)' }}>Forge</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--mist)', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>
              CREATIVE BRAINSTORM TOOLKIT
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--mist)', fontFamily: 'var(--mono)' }}>
              powered by
            </span>
            <span className="stamp" style={{ color: 'var(--rust)', borderColor: 'var(--rust)', fontSize: '0.6rem' }}>
              Wordnik API
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 0, padding: '0' }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.78rem',
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTool === tool.id
                  ? '2px solid var(--rust)'
                  : '2px solid transparent',
                color: activeTool === tool.id ? 'var(--rust)' : 'var(--mist)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                letterSpacing: '0.03em',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
