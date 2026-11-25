// A tiny deterministic random source so screenshot scenes and practice runs repeat exactly.

export function makeRandom(seed) {
  let state = (seed >>> 0) || 1;
  return function nextRandom() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

export function pickRandom(random, list) {
  return list[Math.floor(random() * list.length) % list.length];
}
