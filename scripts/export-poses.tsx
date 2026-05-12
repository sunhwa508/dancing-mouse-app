/** @jsxRuntime automatic */
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Mouse } from '../src/components/Mouse';
import { poses } from '../src/data/poses';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public', 'mouse');
mkdirSync(outDir, { recursive: true });

for (const [i, pose] of poses.entries()) {
  const inner = renderToStaticMarkup(<Mouse pose={pose} />);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${inner}\n`;
  const filename = `pose-${String(i + 1).padStart(2, '0')}-${pose.name}.svg`;
  writeFileSync(join(outDir, filename), svg);
  console.log(`wrote ${filename}`);
}

// also write a "neutral" icon based on first pose for use as favicon
const iconInner = renderToStaticMarkup(<Mouse pose={poses[0]} />);
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>\n${iconInner}\n`;
writeFileSync(join(here, '..', 'public', 'mouse-icon.svg'), iconSvg);
console.log('wrote mouse-icon.svg');
