import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from './components/Sparkles';
import { Settings } from './components/Settings';
import { characters, getCharacter } from './characters/registry';
import { framePath } from './characters/types';
import './OverlayApp.css';

declare global {
  interface Window {
    dancingMouseApi?: {
      onKeystroke: (cb: (payload: { name: string; vKey: number }) => void) => () => void;
      setWindowSize: (width: number, height: number) => void;
      quit: () => void;
    };
  }
}

const STORAGE_KEY = 'dancing-mouse-settings:v2';
const MIN_SCALE = 60;
const MAX_SCALE = 800;
const CHROME_PAD = 24; // extra px around character for sparkles room

type Settings = {
  charId: string;
  scale: number; // height in px
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.charId === 'string' && typeof parsed.scale === 'number') {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  const first = characters[0];
  return { charId: first.id, scale: first.defaultScale };
}

function saveSettings(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export default function OverlayApp() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const character = getCharacter(settings.charId);

  const [frameIndex, setFrameIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const [pulseId, setPulseId] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Compute & sync window size to render area
  const renderHeight = settings.scale;
  const renderWidth = Math.round(renderHeight * (character.width / character.height));
  const winWidth = renderWidth + CHROME_PAD;
  const winHeight = renderHeight + CHROME_PAD;

  useEffect(() => {
    window.dancingMouseApi?.setWindowSize(winWidth, winHeight);
  }, [winWidth, winHeight]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    setFrameIndex(0);
  }, [character.id]);

  useEffect(() => {
    const onAnyKey = () => {
      setFrameIndex((i) => (i + 1) % character.frameCount);
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
  }, [character.frameCount]);

  const preload = useMemo(
    () =>
      Array.from({ length: character.frameCount }, (_, i) => (
        <link key={i} rel="preload" as="image" href={framePath(character, i)} />
      )),
    [character],
  );

  return (
    <div className="overlay">
      <div style={{ display: 'none' }}>{preload}</div>
      <div className="drag-handle" />

      <button
        className="settings-btn"
        onClick={() => setShowSettings((v) => !v)}
        title="settings"
        aria-label="settings"
      >
        ⚙
      </button>

      <div
        className="rat-wrap"
        style={{ width: renderWidth, height: renderHeight }}
      >
        <img
          key={pulseId}
          src={framePath(character, frameIndex)}
          alt={character.name}
          className="rat"
          draggable={false}
        />
        <Sparkles trigger={trigger} />
      </div>

      {showSettings && (
        <Settings
          current={character}
          scale={settings.scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          onPick={(id) => setSettings((s) => ({ ...s, charId: id }))}
          onScale={(scale) => setSettings((s) => ({ ...s, scale }))}
          onClose={() => setShowSettings(false)}
          onQuit={window.dancingMouseApi?.quit}
        />
      )}
    </div>
  );
}
