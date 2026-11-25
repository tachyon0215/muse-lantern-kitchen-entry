// Lantern Kitchen entry point: wires the world, input and renderer together and runs the loop.
// Play: click an ingredient (or press 1-8) to prep it, click the station or press Space when it
// is ready to put it on the plate, then SERVE when the plate matches an order on the board.

import { INGREDIENTS, STEP } from './config.js';
import { bindInput, hitZoneAt, ingredientZoneAt } from './input.js';
import { drawGame, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { stageShot } from './shots.js';
import { createWorld } from './world.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');

let world = createWorld(Number(params.get('seed') || 7));
let screen = SCREEN_TITLE;
let started = false;

if (shotName) {
  const staged = stageShot(shotName);
  world = staged.world;
  screen = staged.screen;
  started = shotName !== 'start';
  drawGame(ctx, world.state, screen);
} else {
  drawGame(ctx, world.state, screen);
}

function pickIngredient(index) {
  if (!started) { started = true; screen = SCREEN_PLAY; }
  if (world.state.over) return;
  world.startPrep(INGREDIENTS[index]);
}

function doServeOrCollect() {
  if (world.state.station && world.state.station.ready) { world.collectStation(); return; }
  world.servePlate();
}

bindInput(canvas, {
  onKey(code, key) {
    if (code === 'Enter' && !started) { started = true; screen = SCREEN_PLAY; return; }
    if (code === 'KeyR' && world.state.over) {
      world = createWorld(7 + Math.floor(Math.random() * 90));
      screen = SCREEN_PLAY; started = true; return;
    }
    const numeric = INGREDIENTS.findIndex((item) => item.key === key);
    if (numeric >= 0) { pickIngredient(numeric); return; }
    if (code === 'Space') doServeOrCollect();
    if (code === 'Backspace') world.trashPlate();
  },
  onTap(x, y) {
    if (!started) { started = true; screen = SCREEN_PLAY; return; }
    if (world.state.over) return;
    const ingredientIndex = ingredientZoneAt(x, y);
    if (ingredientIndex >= 0) { pickIngredient(ingredientIndex); return; }
    const zone = hitZoneAt(x, y);
    if (!zone) {
      if (world.state.station) world.collectStation();
      return;
    }
    if (zone.action === 'serve') world.servePlate();
    if (zone.action === 'trash') world.trashPlate();
    if (zone.action === 'collect') world.collectStation();
  },
});

let last = performance.now();
let accumulator = 0;
function frame(now) {
  requestAnimationFrame(frame);
  if (shotName) return;
  const delta = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (started && !world.state.over) {
    accumulator += delta;
    while (accumulator >= STEP) { world.step(STEP); accumulator -= STEP; }
    if (world.state.over) screen = SCREEN_OVER;
  }
  drawGame(ctx, world.state, screen);
  status.textContent = 'Score ' + world.state.score + ', served ' + world.state.served + ', time left ' + Math.ceil(world.state.timeLeft) + ' seconds.';
}
requestAnimationFrame(frame);
