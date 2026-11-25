// Keyboard and mouse control mapping for Lantern Kitchen.
// Keys 1-8 pick ingredients, Space collects or serves, Backspace clears the plate.

export function bindInput(canvas, handlers) {
  const keys = new Set();
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    keys.add(event.code);
    if (handlers.onKey) handlers.onKey(event.code, event.key);
    if (event.code === 'Space') event.preventDefault();
  });
  window.addEventListener('keyup', (event) => keys.delete(event.code));
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1280;
    const y = ((event.clientY - rect.top) / rect.height) * 720;
    if (handlers.onTap) handlers.onTap(x, y);
  });
  return keys;
}

export const HIT_ZONES = [
  { action: 'serve', x: 880, y: 380, w: 360, h: 72 },
  { action: 'trash', x: 880, y: 462, w: 360, h: 60 },
  { action: 'collect', x: 430, y: 380, w: 380, h: 150 },
];

export function hitZoneAt(x, y) {
  return HIT_ZONES.find((zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) || null;
}

export function ingredientZoneAt(x, y) {
  if (y < 560 || y > 660) return -1;
  const index = Math.floor((x - 30) / 118);
  if (index < 0 || index > 7) return -1;
  return index;
}
