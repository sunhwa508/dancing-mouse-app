import { useEffect, useState } from 'react';

type Sparkle = {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rot: number;
  drift: number;
};

const SYMBOLS = ['♪', '♫', '✦', '★', '✿', '♡', '✧'];
const COLORS = ['#ff5577', '#ffc857', '#7ad6ff', '#a78bff', '#5ee0a0'];

let nextId = 0;

type Props = {
  trigger: number;
};

export function Sparkles({ trigger }: Props) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const id = nextId++;
    const newOne: Sparkle = {
      id,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 60 + Math.random() * 20,
      emoji: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      rot: (Math.random() - 0.5) * 60,
      drift: (Math.random() - 0.5) * 30,
    };
    setSparkles((prev) => [...prev, newOne]);
    const t = setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 1400);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="sparkle-layer">
      {sparkles.map((s, i) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            ['--drift' as string]: `${s.drift}px`,
            ['--rot' as string]: `${s.rot}deg`,
            color: COLORS[i % COLORS.length],
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}
