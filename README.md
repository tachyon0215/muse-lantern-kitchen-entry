# Lantern Kitchen

Entry for the make.fun competition [Make the best cooking game](https://make.fun/c/best-cooking-game-20261125-0137).

A night-market cooking game: read the order board, pick ingredients from the counter, chop / fry / boil them at the prep station (take them off before they burn), plate the dish and serve it before each customer's patience runs out. Tips grow with speed, combos grow with streaks, and three lost orders end the service. The day lasts 150 seconds and the rush keeps speeding up.

## Play

Open `game/index.html` in a desktop browser, or run `node serve.ts` and visit http://localhost:8080.

- Click an ingredient on the counter, or press keys 1-8, to start prepping it.
- When the station timer says READY, click the station or press Space to put it on the plate - wait too long and it burns.
- When the plate matches an order, press SERVE PLATE (or Space) to hand it over and earn its price plus a tip.
- Backspace or CLEAR PLATE throws the plate away and resets the combo.

## Layout

- `game/src/config.js` - the room, the clock, the eight ingredients and the six original recipes.
- `game/src/world.js` - orders, prep stations, plating, scoring, hearts and the service timer.
- `game/src/render.js` - the kitchen, order board, plate and counter, all drawn with canvas shapes.
- `game/src/input.js` - keyboard and mouse mapping and the clickable zones.
- `game/src/shots.js` - deterministic screenshot scenes (`?shot=start|play|serve|end`).
- `game/src/main.js` - wires world, input and renderer together and runs the game loop.
- `main.ts` - the hand-in program: copies `game/` and `screenshots/` to the output folder and writes `dossier.json`.

--
[![make.fun - best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/tachyon0215/muse-lantern-kitchen-entry/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/tachyon0215/muse-lantern-kitchen-entry/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
