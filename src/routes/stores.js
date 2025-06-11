import { writable, derived, get } from "svelte/store";

export const startingLifeTotal = writable(40);
export const startingTimeLeftMinutes = writable(23);
export const startingTimeLeftSeconds = derived(
  startingTimeLeftMinutes,
  ($startingTimeLeftMinutes) => $startingTimeLeftMinutes * 60
);

export const playerDataList = writable([
  {
    name: "Player 1",
    color: "#d02020",
    lifeButtonColor: "#a91919"
  },
  {
    name: "Player 2",
    color: "#408ccb",
    lifeButtonColor: "#33709f"
  },
  {
    name: "Player 3",
    color: "#9b980c",
    lifeButtonColor: "#706f09"
  },
  {
    name: "Player 4",
    color: "#0f9b02",
    lifeButtonColor: "#096c01"
  },
]);

export const playerLifeTotalHistoryList = writable([
  {
    name: "Player 1",
    entryList: [],
  },
  {
    name: "Player 2",
    entryList: [],
  },
  {
    name: "Player 3",
    entryList: [],
  },
  {
    name: "Player 4",
    entryList: [],
  },
]);

export const addToPlayerLifeTotalHistory = (playerIndex, lifeChangeData) => {
  playerLifeTotalHistoryList.update((val) => {
    val[playerIndex].entryList.push(lifeChangeData);
    return val;
  });
};

export const resetPlayerLifeTotalHistory = () => {
  playerLifeTotalHistoryList.update((val) => {
    val.forEach((playerListTotalHistory) => {
      playerListTotalHistory.entryList = [
        {
          lifeChange: 0,
          newLifeTotal: get(startingLifeTotal),
        },
      ];
    });
    return val;
  });
};
