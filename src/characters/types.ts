export type CharacterManifest = {
  id: string;
  name: string;
  frameCount: number;
  width: number;
  height: number;
  defaultScale: number;
  emoji?: string;
  credit?: string;
};

export function framePath(char: CharacterManifest, frameIndex: number): string {
  const n = String((frameIndex % char.frameCount) + 1).padStart(3, '0');
  return `/characters/${char.id}/frame-${n}.png`;
}

export function thumbnailPath(char: CharacterManifest): string {
  return `/characters/${char.id}/thumb.png`;
}
