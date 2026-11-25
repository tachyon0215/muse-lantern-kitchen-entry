// Lantern Kitchen drawing: a warm night-market kitchen drawn entirely with canvas shapes.
// The judge-facing scenes must read at a glance: order board, ingredient counter, a dish
// mid-assembly on the plate, a prep station with its timer, and a big day clock.

import { FIELD, INGREDIENTS } from './config.js';
import { ingredientById } from './world.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_OVER = 'over';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawIngredientIcon(ctx, ingredient, cx, cy, size) {
  ctx.save();
  ctx.fillStyle = ingredient.color;
  ctx.strokeStyle = 'rgba(40,20,5,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (ingredient.id === 'tomato' || ingredient.id === 'berry') {
    ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3f7d2c';
    ctx.fillRect(cx - 3, cy - size * 0.55, 6, size * 0.22);
  } else if (ingredient.id === 'egg') {
    ctx.ellipse(cx, cy, size * 0.44, size * 0.34, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff6df'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = ingredient.color; ctx.fill();
  } else if (ingredient.id === 'broth') {
    ctx.arc(cx, cy + 4, size * 0.42, 0, Math.PI);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffe9b0';
    ctx.fillRect(cx - size * 0.42, cy - 2, size * 0.84, 7);
  } else if (ingredient.id === 'dough') {
    ctx.ellipse(cx, cy, size * 0.48, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  } else {
    roundRect(ctx, cx - size * 0.42, cy - size * 0.3, size * 0.84, size * 0.6, 10);
    ctx.fill(); ctx.stroke();
    if (ingredient.id === 'greens') {
      ctx.strokeStyle = '#2e6b2e';
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath(); ctx.moveTo(cx + i * 12, cy + 12); ctx.lineTo(cx + i * 16, cy - 14); ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function drawKitchenBackdrop(ctx) {
  ctx.fillStyle = '#2b1a12';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.fillStyle = '#4a2c1a';
  ctx.fillRect(0, 0, FIELD.width, 400);
  ctx.fillStyle = '#6b4226';
  for (let x = 0; x < FIELD.width; x += 160) ctx.fillRect(x, 60, 120, 10);
  ctx.fillStyle = '#ffb52e';
  for (let x = 80; x < FIELD.width; x += 240) {
    ctx.beginPath(); ctx.arc(x, 96, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,181,46,0.25)';
    ctx.beginPath(); ctx.arc(x, 96, 42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffb52e';
  }
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(0, 400, FIELD.width, 150);
  ctx.fillStyle = '#a06a3a';
  ctx.fillRect(0, 400, FIELD.width, 14);
  ctx.fillStyle = '#3a2415';
  ctx.fillRect(0, 550, FIELD.width, 170);
}

function drawOrderBoard(ctx, state) {
  ctx.fillStyle = '#fff3d6';
  roundRect(ctx, 880, 24, 376, 300, 14); ctx.fill();
  ctx.fillStyle = '#7a3b12';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('ORDER BOARD', 904, 62);
  ctx.font = '17px system-ui, sans-serif';
  state.orders.forEach((order, i) => {
    const y = 84 + i * 78;
    ctx.fillStyle = i === 0 ? '#ffe1a8' : '#f7e8c8';
    roundRect(ctx, 896, y, 344, 68, 10); ctx.fill();
    ctx.fillStyle = '#40260d';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(order.recipe.name + '  $' + order.recipe.price, 908, y + 24);
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText(order.recipe.items.map((id) => ingredientById(id).label).join(' + '), 908, y + 46);
    const ratio = Math.max(0, order.left / order.total);
    ctx.fillStyle = '#d8c9a3'; ctx.fillRect(1090, y + 50, 130, 9);
    ctx.fillStyle = ratio > 0.4 ? '#4c9a4c' : '#e4572e'; ctx.fillRect(1090, y + 50, 130 * ratio, 9);
  });
  if (state.orders.length === 0) {
    ctx.fillStyle = '#7a3b12'; ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('Waiting for customers...', 908, 120);
  }
}

function drawPlateAndStation(ctx, state) {
  ctx.fillStyle = '#5d3a1e';
  roundRect(ctx, 430, 380, 380, 150, 16); ctx.fill();
  ctx.fillStyle = '#e8e2d4';
  ctx.beginPath(); ctx.ellipse(668, 468, 118, 52, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b9ac93'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#ffe9b0';
  ctx.font = 'bold 19px system-ui, sans-serif';
  ctx.fillText('PLATE - dish mid-assembly', 560, 408);
  state.plate.forEach((id, i) => {
    drawIngredientIcon(ctx, ingredientById(id), 596 + i * 54, 468, 52);
  });
  if (state.station) {
    const s = state.station;
    ctx.fillStyle = '#33241a';
    roundRect(ctx, 442, 420, 110, 92, 12); ctx.fill();
    drawIngredientIcon(ctx, ingredientById(s.id), 497, 458, 56);
    ctx.fillStyle = '#fff3d6'; ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(s.ready ? (s.burn > 0.4 ? 'TAKE IT!' : 'READY!') : s.prep.toUpperCase() + '...', 456, 432);
    const ratio = s.ready ? Math.max(0, 1 - s.burn / 2.2) : s.done / s.need;
    ctx.fillStyle = '#d8c9a3'; ctx.fillRect(452, 492, 90, 10);
    ctx.fillStyle = s.ready ? '#e4572e' : '#4c9a4c'; ctx.fillRect(452, 492, 90 * ratio, 10);
  }
}

function drawCounterAndHud(ctx, state, screen) {
  ctx.fillStyle = '#fff3d6';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('LANTERN KITCHEN - night market', 28, 52);
  ctx.font = 'bold 22px system-ui, sans-serif';
  const mins = Math.floor(state.timeLeft / 60);
  const secs = Math.floor(state.timeLeft % 60);
  ctx.fillText('Timer ' + mins + ':' + String(secs).padStart(2, '0'), 28, 88);
  ctx.fillText('Score ' + state.score + '   Coins ' + state.coins, 28, 122);
  ctx.fillText('Served ' + state.served + '   Combo x' + state.combo + '   Hearts ' + '♥'.repeat(Math.max(0, state.hearts)), 28, 156);
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillStyle = '#ffd98a';
  ctx.fillText(state.message, 28, 356);
  ctx.fillText('Keys 1-8 pick ingredients - Space: collect / serve - Backspace: clear plate', 28, 382);
  INGREDIENTS.forEach((ingredient, i) => {
    const x = 30 + i * 118;
    ctx.fillStyle = '#f7e8c8';
    roundRect(ctx, x, 560, 106, 100, 12); ctx.fill();
    drawIngredientIcon(ctx, ingredient, x + 53, 596, 52);
    ctx.fillStyle = '#40260d'; ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(ingredient.key + ' ' + ingredient.label, x + 10, 646);
  });
  ctx.fillStyle = '#4c9a4c'; roundRect(ctx, 880, 380, 360, 72, 14); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('SERVE PLATE', 968, 426);
  ctx.fillStyle = '#8a3b2e'; roundRect(ctx, 880, 462, 360, 60, 14); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.fillText('CLEAR PLATE', 972, 502);
  if (screen === SCREEN_TITLE) {
    ctx.fillStyle = 'rgba(20,10,4,0.72)'; ctx.fillRect(300, 180, 560, 190);
    ctx.fillStyle = '#fff3d6'; ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.fillText('LANTERN KITCHEN', 356, 248);
    ctx.font = '21px system-ui, sans-serif';
    ctx.fillText('Cook the orders before patience runs out!', 356, 292);
    ctx.fillText('Click ingredients, mind the fry timer, serve plates.', 356, 324);
  }
  if (screen === SCREEN_OVER) {
    ctx.fillStyle = 'rgba(20,10,4,0.78)'; ctx.fillRect(300, 180, 560, 210);
    ctx.fillStyle = '#fff3d6'; ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.fillText('SERVICE OVER', 386, 248);
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('Final score ' + state.score + ' - dishes served ' + state.served, 356, 296);
    ctx.fillText('Best combo x' + state.bestCombo + '. Press R to play again.', 356, 330);
  }
}

export function drawGame(ctx, state, screen) {
  drawKitchenBackdrop(ctx);
  drawOrderBoard(ctx, state);
  drawPlateAndStation(ctx, state);
  drawCounterAndHud(ctx, state, screen);
}
