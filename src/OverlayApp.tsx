import { useEffect, useRef, useState } from 'react';
import { Sparkles } from './components/Sparkles';
import './OverlayApp.css';

declare global {
  interface Window {
    dancingMouseApi?: {
      onKeystroke: (cb: (payload: { name: string; vKey: number }) => void) => () => void;
    };
  }
}

const IDLE_MS = 600;

export default function OverlayApp() {
  const [trigger, setTrigger] = useState(0);
  const [isDancing, setIsDancing] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const onAnyKey = () => {
      setTrigger((t) => t + 1);
      setIsDancing(true);
      if (idleTimer.current !== null) clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIsDancing(false), IDLE_MS);
    };

    if (window.dancingMouseApi) {
      const unsub = window.dancingMouseApi.onKeystroke(onAnyKey);
      return () => unsub();
    }
    const handler = () => onAnyKey();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={`overlay ${isDancing ? 'dancing' : 'idle'}`}>
      <div className="drag-handle" />
      <div className="rat-wrap">
        <img src="/rat-dance.gif" alt="dancing rat" className="rat" draggable={false} />
        <Sparkles trigger={trigger} />
      </div>
    </div>
  );
}
