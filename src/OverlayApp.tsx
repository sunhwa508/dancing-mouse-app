import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from './components/Sparkles';
import './OverlayApp.css';

declare global {
  interface Window {
    dancingMouseApi?: {
      onKeystroke: (cb: (payload: { name: string; vKey: number }) => void) => () => void;
    };
  }
}

const FRAME_COUNT = 32;

function framePath(i: number): string {
  const n = String((i % FRAME_COUNT) + 1).padStart(3, '0');
  return `/rat-frames/rat-${n}.png`;
}

export default function OverlayApp() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const [pulseId, setPulseId] = useState(0);

  useEffect(() => {
    const onAnyKey = () => {
      setFrameIndex((i) => (i + 1) % FRAME_COUNT);
      setTrigger((t) => t + 1);
      setPulseId((p) => p + 1);
    };

    if (window.dancingMouseApi) {
      const unsub = window.dancingMouseApi.onKeystroke(onAnyKey);
      return () => unsub();
    }
    const handler = () => onAnyKey();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Preload all frames once so swapping is instant
  const preload = useMemo(
    () =>
      Array.from({ length: FRAME_COUNT }, (_, i) => (
        <link key={i} rel="preload" as="image" href={framePath(i)} />
      )),
    [],
  );

  return (
    <div className="overlay">
      <div style={{ display: 'none' }}>{preload}</div>
      <div className="drag-handle" />
      <div className="rat-wrap">
        <img
          key={pulseId}
          src={framePath(frameIndex)}
          alt="dancing rat"
          className="rat"
          draggable={false}
        />
        <Sparkles trigger={trigger} />
      </div>
    </div>
  );
}
