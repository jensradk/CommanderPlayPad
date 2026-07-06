import { game } from "./game.svelte.js";

const GAME_KEY = "commanderplaypad.game.v1";
const SETTINGS_KEY = "commanderplaypad.settings.v1";

export function loadSavedState() {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      Object.assign(game.settings, JSON.parse(settingsJson));
    }
    const gameJson = localStorage.getItem(GAME_KEY);
    if (!gameJson) return false;
    const saved = JSON.parse(gameJson);
    game.players = saved.players.map((p) => ({
      ...p,
      // never restore a mid-fade bubble; its timeout died with the old page
      pendingLifeChange: 0,
      lifeChangePhase: "hidden",
    }));
    game.monarchIndex = saved.monarchIndex ?? -1;
    // resume paused: no clock runs after a reload, tap a player to continue
    game.activePlayerIndex = -1;
    return true;
  } catch {
    return false;
  }
}

export function saveGame() {
  localStorage.setItem(
    GAME_KEY,
    JSON.stringify({ players: game.players, monarchIndex: game.monarchIndex })
  );
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(game.settings));
}
