const { chmodSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const binaries = [
  join(
    __dirname,
    '..',
    'node_modules',
    'node-global-key-listener',
    'bin',
    'MacKeyServer',
  ),
  join(
    __dirname,
    '..',
    'node_modules',
    'node-global-key-listener',
    'bin',
    'X11KeyServer',
  ),
];

for (const bin of binaries) {
  if (existsSync(bin)) {
    try {
      chmodSync(bin, 0o755);
      console.log(`[fix-keylistener-perms] chmod +x ${bin}`);
    } catch (err) {
      console.warn(`[fix-keylistener-perms] failed for ${bin}: ${err.message}`);
    }
  }
}
