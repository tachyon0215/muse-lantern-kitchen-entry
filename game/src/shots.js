// Deterministic screenshot scenes for Lantern Kitchen, selected with ?shot=start|play|serve.
// Each scene builds a fresh world with a fixed seed and plays the real rules forward, so the
// picture is the game itself: start shows the open kitchen, play shows a dish mid-assembly
// with an order waiting, and serve shows a finished plate ready to hand over.

import { INGREDIENTS } from './config.js';
import { createWorld, ingredientById } from './world.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

function addInstant(world, id) {
  const ingredient = ingredientById(id);
  if ((ingredient.prep === 'none')) { world.startPrep(ingredient); return; }
  world.startPrep(ingredient);
  world.state.station.done = world.state.station.need;
  world.state.station.ready = true;
  world.collectStation();
}

export function stageShot(name) {
  const world = createWorld(11);
  if (name === 'play') {
    addInstant(world, 'noodle');
    addInstant(world, 'egg');
    world.startPrep(ingredientById('greens'));
    world.state.message = 'Chopping greens for the Lantern Noodle Bowl...';
    return { world, screen: SCREEN_PLAY };
  }
  if (name === 'serve') {
    const target = world.state.orders[0].recipe;
    for (const id of target.items) addInstant(world, id);
    world.state.message = target.name + ' is plated and ready to serve!';
    world.state.score = 42;
    world.state.coins = 42;
    return { world, screen: SCREEN_PLAY };
  }
  if (name === 'end') {
    world.state.score = 128;
    world.state.coins = 128;
    world.state.served = 9;
    world.state.bestCombo = 4;
    world.state.over = true;
    return { world, screen: SCREEN_OVER };
  }
  return { world, screen: SCREEN_TITLE };
}

export function shotIngredientList() {
  return INGREDIENTS.map((item) => item.label).join(', ');
}
