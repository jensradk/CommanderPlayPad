export const COMMANDER_DAMAGE_LETHAL = 21;
export const POISON_LETHAL = 10;

const LIFECHANGE_FADEOUT_MS = 2000;
const LIFECHANGE_SHOW_MS = 8000;

const DEFAULT_SETTINGS = { startingLife: 40, startingTimeMinutes: 23 };

const PLAYER_COLORS = [
  { color: "#3d5a80", colorSecondary: "#2b3f59" },
  { color: "#a84a4a", colorSecondary: "#7e3838" },
  { color: "#9a983f", colorSecondary: "#605e27" },
  { color: "#4b9d44", colorSecondary: "#2f5d2a" },
];

function createPlayer(index, settings) {
  return {
    name: `Player ${index + 1}`,
    ...PLAYER_COLORS[index],
    life: settings.startingLife,
    timeRemainingSeconds: settings.startingTimeMinutes * 60,
    poison: 0,
    commanderDamageGiven: [0, 0, 0, 0],
    lifeHistory: [{ lifeChange: 0, newLifeTotal: settings.startingLife }],
    pendingLifeChange: 0,
    lifeChangePhase: "hidden",
  };
}

export const game = $state({
  settings: { ...DEFAULT_SETTINGS },
  players: [0, 1, 2, 3].map((i) => createPlayer(i, DEFAULT_SETTINGS)),
  activePlayerIndex: -1,
  monarchIndex: -1,
});

export function isDead(player) {
  return (
    player.life <= 0 ||
    player.poison >= POISON_LETHAL ||
    player.timeRemainingSeconds <= 0
  );
}

/* ---------- life & history ---------- */

const lifeChangeShowTimeouts = [null, null, null, null];
const lifeChangeFadeTimeouts = [null, null, null, null];

export function addToLife(index, delta) {
  const player = game.players[index];
  const newLife = Math.max(0, player.life + delta);
  const applied = newLife - player.life;
  if (applied === 0) return;
  player.life = newLife;
  player.pendingLifeChange += applied;
  player.lifeChangePhase = "shown";

  clearTimeout(lifeChangeShowTimeouts[index]);
  clearTimeout(lifeChangeFadeTimeouts[index]);
  lifeChangeShowTimeouts[index] = setTimeout(() => {
    player.lifeChangePhase = "fading";
    if (player.pendingLifeChange !== 0) {
      player.lifeHistory.push({
        lifeChange: player.pendingLifeChange,
        newLifeTotal: player.life,
      });
    }
    lifeChangeFadeTimeouts[index] = setTimeout(() => {
      player.pendingLifeChange = 0;
      player.lifeChangePhase = "hidden";
    }, LIFECHANGE_FADEOUT_MS);
  }, LIFECHANGE_SHOW_MS);

  if (isDead(player) && game.activePlayerIndex === index) pauseGame();
}

/* ---------- commander damage ---------- */

export function addCommanderDamage(fromIndex, toIndex, delta) {
  const given = game.players[fromIndex].commanderDamageGiven;
  const next = Math.max(0, Math.min(COMMANDER_DAMAGE_LETHAL, given[toIndex] + delta));
  const applied = next - given[toIndex];
  if (applied === 0) return;
  given[toIndex] = next;
  addToLife(toIndex, -applied);
}

/* ---------- poison & monarch ---------- */

export function addPoison(index, delta) {
  const player = game.players[index];
  player.poison = Math.max(0, Math.min(POISON_LETHAL, player.poison + delta));
  if (isDead(player) && game.activePlayerIndex === index) pauseGame();
}

export function setMonarch(index) {
  game.monarchIndex = game.monarchIndex === index ? -1 : index;
}

/* ---------- clock (single timestamp-based ticker) ---------- */

let tickHandle = null;
let turnStartMs = 0;
let timeAtTurnStartSeconds = 0;

function tick() {
  const index = game.activePlayerIndex;
  if (index === -1) return;
  const player = game.players[index];
  const elapsed = Math.floor((Date.now() - turnStartMs) / 1000);
  player.timeRemainingSeconds = Math.max(0, timeAtTurnStartSeconds - elapsed);
  if (player.timeRemainingSeconds === 0) pauseGame();
}

export function pauseGame() {
  if (tickHandle) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
  if (game.activePlayerIndex !== -1) {
    const index = game.activePlayerIndex;
    const player = game.players[index];
    const elapsed = Math.floor((Date.now() - turnStartMs) / 1000);
    player.timeRemainingSeconds = Math.max(0, timeAtTurnStartSeconds - elapsed);
    game.activePlayerIndex = -1;
  }
}

export function setActivePlayer(index) {
  if (game.activePlayerIndex === index) {
    pauseGame();
    return;
  }
  pauseGame();
  const player = game.players[index];
  if (!player || isDead(player)) return;
  game.activePlayerIndex = index;
  turnStartMs = Date.now();
  timeAtTurnStartSeconds = player.timeRemainingSeconds;
  tickHandle = setInterval(tick, 250);
}

/* ---------- names & restart ---------- */

export function setPlayerName(index, newName) {
  const trimmed = newName.trim();
  if (trimmed === "") return;
  game.players[index].name = trimmed;
}

export function restartGame() {
  pauseGame();
  for (let i = 0; i < game.players.length; i++) {
    clearTimeout(lifeChangeShowTimeouts[i]);
    clearTimeout(lifeChangeFadeTimeouts[i]);
  }
  game.monarchIndex = -1;
  game.players = game.players.map((p, i) => ({
    ...createPlayer(i, game.settings),
    name: p.name,
  }));
}
