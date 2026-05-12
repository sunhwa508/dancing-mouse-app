export type CharacterManifest = {
  id: string;
  name: string;
  frameCount: number;
  width: number;
  height: number;
  defaultScale: number;
  emoji?: string;
  credit?: string;
  /** bump when frame PNGs change to bust browser cache */
  assetVersion?: string;
};

function v(char: CharacterManifest): string {
  return char.assetVersion ? `?v=${char.assetVersion}` : '';
}

export function framePath(char: CharacterManifest, frameIndex: number): string {
  const n = String((frameIndex % char.frameCount) + 1).padStart(3, '0');
  return `/characters/${char.id}/frame-${n}.png${v(char)}`;
}

export function thumbnailPath(char: CharacterManifest): string {
  return `/characters/${char.id}/thumb.png${v(char)}`;
}
