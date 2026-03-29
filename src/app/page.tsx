'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WordExplorer from '@/components/WordExplorer';
import SparkStudio from '@/components/SparkStudio';
import WordOfDay from '@/components/WordOfDay';
import RandomCanvas from '@/components/RandomCanvas';

type Tool = 'explorer' | 'spark' | 'random' | 'wotd';

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>('explorer');
  const [exploreWord, setExploreWord] = useState<string | null>(null);

  useEffect(() => {
    function handleExplore(e: Event) {
      const word = (e as CustomEvent).detail;
      setExploreWord(word);
      setActiveTool('explorer');
    }
    window.addEventListener('explore-word', handleExplore);
    return () => window.removeEventListener('explore-word', handleExplore);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Header activeTool={activeTool} setActiveTool={setActiveTool} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 100px' }}>
        {activeTool === 'explorer' && (
          <WordExplorer initialWord={exploreWord} onWordUsed={() => setExploreWord(null)} />
        )}
        {activeTool === 'spark' && <SparkStudio />}
        {activeTool === 'random' && <RandomCanvas />}
        {activeTool === 'wotd' && <WordOfDay />}
      </main>
    </div>
  );
}
