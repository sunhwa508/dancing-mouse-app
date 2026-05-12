import { useEffect, useRef, useState } from 'react';
import { Mouse } from './components/Mouse';
import { Sparkles } from './components/Sparkles';
import { poses } from './data/poses';
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
  const [poseIndex, setPoseIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const [isDancing, setIsDancing] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const onAnyKey = () => {
      setPoseIndex((i) => (i + 1) % poses.length);
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

  const pose = poses[poseIndex];

  return (
    <div className={`overlay ${isDancing ? 'dancing' : 'idle'}`}>
      <div className="drag-handle" />
      <div className="mouse-wrap">
        <Mouse pose={pose} />
        <Sparkles trigger={trigger} />
      </div>
    </div>
  );
}
