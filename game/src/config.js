// Lantern Kitchen configuration: the room, the clock and every recipe on the menu.
// All names here are original to this game; no dish, shop or character is borrowed.

export const FIELD = { width: 1280, height: 720 };
export const DAY_SECONDS = 150;
export const STEP = 1 / 60;

export const INGREDIENTS = [
  { id: 'noodle', label: 'Noodles', key: '1', color: '#f2d38a', prep: 'boil' },
  { id: 'tomato', label: 'Tomato', key: '2', color: '#e4572e', prep: 'chop' },
  { id: 'greens', label: 'Greens', key: '3', color: '#4c9a4c', prep: 'chop' },
  { id: 'egg', label: 'Egg', key: '4', color: '#ffd94d', prep: 'fry' },
  { id: 'cheese', label: 'Cheese', key: '5', color: '#ffb52e', prep: 'none' },
  { id: 'berry', label: 'Berries', key: '6', color: '#7b4ea3', prep: 'none' },
  { id: 'dough', label: 'Dough', key: '7', color: '#e8c39a', prep: 'fry' },
  { id: 'broth', label: 'Broth', key: '8', color: '#b06a2c', prep: 'boil' },
];

export const RECIPES = [
  { name: 'Lantern Noodle Bowl', items: ['noodle', 'egg', 'greens'], price: 14 },
  { name: 'Garden Tomato Plate', items: ['tomato', 'greens', 'cheese'], price: 12 },
  { name: 'Berry Cloud Pancake', items: ['dough', 'berry', 'egg'], price: 13 },
  { name: 'Amber Broth Pot', items: ['broth', 'tomato', 'noodle'], price: 15 },
  { name: 'Cheese Melt Stack', items: ['dough', 'cheese', 'tomato'], price: 12 },
  { name: 'Sunny Greens Skillet', items: ['egg', 'greens', 'tomato'], price: 11 },
];

export const PREP_SECONDS = { chop: 1.2, fry: 2.0, boil: 2.6, none: 0 };
export const BURN_SECONDS = 2.2;
export const MAX_ORDERS = 3;
export const START_HEARTS = 3;
