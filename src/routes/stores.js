import { writable, derived } from "svelte/store";

export const startingLifeTotal = writable(40);
export const startingTimeLeftMinutes = writable(23);
export const startingTimeLeftSeconds = derived(
  startingTimeLeftMinutes,
  ($startingTimeLeftMinutes) => $startingTimeLeftMinutes * 60
);
export const playerLifeTotalHistory = writable([
  {
    "name": "Player 1",
    "lifeChangeHistory": []
  },
  {
    "name": "Player 2",
    "lifeChangeHistory": []
  },
  {
    "name": "Player 3",
    "lifeChangeHistory": []
  },
  {
    "name": "Player 4",
    "lifeChangeHistory": []
  }
]);

export const addToPlayerLifeTotalHistory = (playerIndex, lifeChangeData) => {
  playerLifeTotalHistory.update(val => {
    val[playerIndex].lifeChangeHistory.push(lifeChangeData);
    return val;
  })
}
