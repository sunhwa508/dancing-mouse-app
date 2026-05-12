import { useEffect, useMemo, useRef, useState } from 'react';
import { Mouse } from './components/Mouse';
import { Sparkles } from './components/Sparkles';
import { poses } from './data/poses';
import './App.css';

const IDLE_RETURN_MS = 600;

export default function App() {
  const [poseIndex, setPoseIndex] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [trigger, setTrigger] = useState(0);
  const [isDancing, setIsDancing] = useState(false);
  const idleTimer = useRef<number | null>(null);

  const pose = poses[poseIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length === 1) {
        setBuffer((b) => (b + e.key).slice(-40));
      } else if (e.key === 'Backspace') {
        setBuffer((b) => b.slice(0, -1));
      } else if (e.key === 'Enter') {
        setBuffer((b) => (b + ' ⏎ ').slice(-40));
      }
      setKeystrokes((n) => n + 1);
      setPoseIndex((i) => (i + 1) % poses.length);
      setTrigger((t) => t + 1);
      setIsDancing(true);
      if (idleTimer.current !== null) {
        clearTimeout(idleTimer.current);
      }
      idleTimer.current = window.setTimeout(() => {
        setIsDancing(false);
      }, IDLE_RETURN_MS);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cheer = useMemo(() => pose.cheer, [pose]);

  return (
    <div className="stage">
      <header className="topbar">
        <h1>🐭 Dancing Mouse</h1>
        <div className="stats">
          <span className="badge">{keystrokes} keys</span>
          <span className="badge muted">{pose.name}</span>
        </div>
      </header>

      <main className={`floor ${isDancing ? 'dancing' : 'idle'}`}>
        <div className="spotlight" />
        <div className="mouse-wrap">
          <Mouse pose={pose} />
          <Sparkles trigger={trigger} />
        </div>
        <p className="cheer">{keystrokes === 0 ? '아무 키나 눌러주세요!' : cheer}</p>
      </main>

      <footer className="bottombar">
        <span className="hint">type anywhere to make me dance ✦</span>
        <div className="buffer">{buffer || '\u00a0'}</div>
      </footer>
    </div>
  );
}
