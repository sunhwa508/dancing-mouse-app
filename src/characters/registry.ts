import type { CharacterManifest } from './types';

// Built-in character packs. To add a new one:
//   1. drop frames into public/characters/{id}/frame-001.png ... frame-NNN.png
//   2. add a thumbnail at public/characters/{id}/thumb.png
//   3. append an entry below
export const characters: CharacterManifest[] = [
  {
    id: 'rat',
    name: 'Pedro Dance Rat',
    emoji: '🐀',
    frameCount: 32,
    width: 139,
    height: 266,
    defaultScale: 300,
    credit: 'Tenor — Rat Rat Dance',
  },
];

export function getCharacter(id: string): CharacterManifest {
  return characters.find((c) => c.id === id) ?? characters[0];
}
