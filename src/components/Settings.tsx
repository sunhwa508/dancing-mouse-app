import { characters } from '../characters/registry';
import type { CharacterManifest } from '../characters/types';
import { thumbnailPath } from '../characters/types';

type Props = {
  current: CharacterManifest;
  scale: number;
  minScale: number;
  maxScale: number;
  onPick: (id: string) => void;
  onScale: (next: number) => void;
  onClose: () => void;
  onQuit?: () => void;
};

export function Settings({
  current,
  scale,
  minScale,
  maxScale,
  onPick,
  onScale,
  onClose,
  onQuit,
}: Props) {
  return (
    <div className="settings-backdrop" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>설정</h2>
          <button className="close" onClick={onClose} aria-label="close">
            ×
          </button>
        </header>

        <section>
          <label>캐릭터</label>
          <div className="char-grid">
            {characters.map((c) => (
              <button
                key={c.id}
                className={`char-card ${c.id === current.id ? 'active' : ''}`}
                onClick={() => onPick(c.id)}
              >
                <img src={thumbnailPath(c)} alt={c.name} draggable={false} />
                <span>
                  {c.emoji} {c.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label>
            크기 <span className="value">{scale}px</span>
          </label>
          <input
            type="range"
            min={minScale}
            max={maxScale}
            value={scale}
            onChange={(e) => onScale(Number(e.target.value))}
          />
        </section>

        {onQuit && (
          <section>
            <button className="quit" onClick={onQuit}>
              종료
            </button>
          </section>
        )}

        {current.credit && (
          <footer>
            <span>{current.credit}</span>
          </footer>
        )}
      </div>
    </div>
  );
}
