#!/usr/bin/env bash
# add-character.sh — ingest a GIF as a new character pack
#
# usage:
#   scripts/add-character.sh <gif-url> <id> [keep-every-N-frames=8] [scale-width=200]
#
# produces:
#   public/characters/<id>/frame-NNN.png  (alpha, bg removed via rembg birefnet)
#   public/characters/<id>/thumb.png
#
# after running, add an entry to src/characters/registry.ts.

set -euo pipefail

URL="${1:?need gif url}"
ID="${2:?need character id}"
KEEP_EVERY="${3:-8}"
SCALE_W="${4:-200}"

REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO/public/characters/$ID"
TMP_DIR="$(mktemp -d -t add-char-XXXX)"
trap "rm -rf $TMP_DIR" EXIT

echo "[add-character] downloading: $URL"
curl -sSL -A "Mozilla/5.0" -o "$TMP_DIR/source.gif" "$URL"
file "$TMP_DIR/source.gif"

echo "[add-character] extracting frames (every ${KEEP_EVERY}, scale w=${SCALE_W})"
mkdir -p "$TMP_DIR/raw"
ffmpeg -y -i "$TMP_DIR/source.gif" \
  -vf "select='not(mod(n\,${KEEP_EVERY}))',scale=${SCALE_W}:-1" \
  -vsync vfr "$TMP_DIR/raw/frame-%03d.png" 2>/dev/null

FRAME_COUNT=$(ls "$TMP_DIR/raw/" | wc -l | tr -d ' ')
echo "[add-character] extracted $FRAME_COUNT frames"

echo "[add-character] removing background via rembg (birefnet-general — may take a few min)"
mkdir -p "$OUT_DIR"
"$REPO/.venv/bin/rembg" p -m birefnet-general "$TMP_DIR/raw" "$OUT_DIR" >/dev/null 2>&1

echo "[add-character] generating thumbnail"
"$REPO/.venv/bin/python" - <<EOF
from PIL import Image
img = Image.open("$OUT_DIR/frame-001.png")
W, H = img.size
img.thumbnail((96, 96))
img.save("$OUT_DIR/thumb.png")
print(f"  thumb: {img.size}")
print(f"  registry suggestion:")
print(f"    {{ id: '$ID', name: '???', emoji: '???', frameCount: $FRAME_COUNT, width: {W}, height: {H}, defaultScale: 300 }},")
EOF

echo "[add-character] done. Add the suggested entry to src/characters/registry.ts."
