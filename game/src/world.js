// Lantern Kitchen world: orders, the plate being assembled, prep stations and scoring.
// Pure state and rules only; drawing lives in render.js and control lives in main.js.

import {
  BURN_SECONDS, DAY_SECONDS, INGREDIENTS, MAX_ORDERS, PREP_SECONDS, RECIPES, START_HEARTS,
} from './config.js';
import { makeRandom, pickRandom } from './random.js';

export const EVENT_SERVED = 1;
export const EVENT_EXPIRED = 2;
export const EVENT_OVER = 4;

export function ingredientById(id) {
  return INGREDIENTS.find((item) => item.id === id) || null;
}

export function newOrder(random, elapsed) {
  const recipe = pickRandom(random, RECIPES);
  const patience = Math.max(26, 46 - elapsed * 0.12);
  return { recipe, left: patience, total: patience };
}

export function createWorld(seed) {
  const random = makeRandom(seed || 7);
  const state = {
    timeLeft: DAY_SECONDS,
    elapsed: 0,
    score: 0,
    coins: 0,
    served: 0,
    hearts: START_HEARTS,
    combo: 0,
    bestCombo: 0,
    orders: [],
    plate: [],
    station: null,
    message: 'Click an ingredient to start a plate!',
    over: false,
    spawnIn: 0,
  };
  state.orders.push(newOrder(random, 0));
  state.orders.push(newOrder(random, 0));

  function startPrep(ingredient) {
    if (state.station || state.plate.length >= 4) return false;
    const seconds = PREP_SECONDS[ingredient.prep];
    if (seconds === 0) {
      state.plate.push(ingredient.id);
      state.message = ingredient.label + ' added to the plate.';
      return true;
    }
    state.station = { id: ingredient.id, prep: ingredient.prep, done: 0, need: seconds, ready: false, burn: 0 };
    state.message = ingredient.prep === 'chop' ? 'Chopping ' + ingredient.label + '...'
      : ingredient.prep === 'fry' ? 'Frying ' + ingredient.label + '...'
        : 'Boiling ' + ingredient.label + '...';
    return true;
  }

  function collectStation() {
    if (!state.station || !state.station.ready) return false;
    if (state.station.burn >= BURN_SECONDS) {
      state.message = 'Burnt! The ' + ingredientById(state.station.id).label + ' went in the bin.';
      state.combo = 0;
    } else {
      state.plate.push(state.station.id);
      state.message = ingredientById(state.station.id).label + ' is on the plate.';
    }
    state.station = null;
    return true;
  }

  function plateMatches(recipe) {
    if (state.plate.length !== recipe.items.length) return false;
    const sortedPlate = [...state.plate].sort();
    const sortedRecipe = [...recipe.items].sort();
    return sortedPlate.every((id, index) => id === sortedRecipe[index]);
  }

  function servePlate() {
    const index = state.orders.findIndex((order) => plateMatches(order.recipe));
    if (index === -1) {
      state.message = state.plate.length === 0 ? 'The plate is empty.' : 'No order matches this plate. Trash it or keep building.';
      return 0;
    }
    const order = state.orders[index];
    const tip = Math.round(6 * (order.left / order.total));
    const gained = order.recipe.price + tip + Math.min(5, state.combo);
    state.score += gained;
    state.coins += gained;
    state.served += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.orders.splice(index, 1);
    state.plate = [];
    state.message = 'Served ' + order.recipe.name + '! +' + gained + ' coins.';
    return EVENT_SERVED;
  }

  function trashPlate() {
    state.plate = [];
    if (state.station) state.station = null;
    state.combo = 0;
    state.message = 'Plate cleared. Start fresh.';
  }

  function step(dt) {
    if (state.over) return EVENT_OVER;
    let events = 0;
    state.elapsed += dt;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0 || state.hearts <= 0) {
      state.timeLeft = Math.max(0, state.timeLeft);
      state.over = true;
      return EVENT_OVER;
    }
    if (state.station && !state.station.ready) {
      state.station.done += dt;
      if (state.station.done >= state.station.need) state.station.ready = true;
    } else if (state.station && state.station.ready) {
      state.station.burn += dt;
    }
    state.spawnIn -= dt;
    if (state.orders.length < MAX_ORDERS && state.spawnIn <= 0) {
      state.orders.push(newOrder(random, state.elapsed));
      state.spawnIn = Math.max(4, 9 - state.elapsed * 0.04);
    }
    for (let i = state.orders.length - 1; i >= 0; i -= 1) {
      state.orders[i].left -= dt;
      if (state.orders[i].left <= 0) {
        state.orders.splice(i, 1);
        state.hearts -= 1;
        state.combo = 0;
        state.message = 'An order walked away...';
        events |= EVENT_EXPIRED;
      }
    }
    return events;
  }

  return { state, startPrep, collectStation, servePlate, trashPlate, step, plateMatches };
}
