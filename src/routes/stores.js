import { writable, derived, get } from "svelte/store";

export const startingLifeTotal = writable(40);
export const startingTimeLeftMinutes = writable(23);
export const startingTimeLeftSeconds = derived(
  startingTimeLeftMinutes,
  ($startingTimeLeftMinutes) => $startingTimeLeftMinutes * 60
);

export const playerDataList = writable([
  {
    name: "",
    color: "#d02020",
    lifeButtonColor: "#a91919"
  },
  {
    name: "",
    color: "#408ccb",
    lifeButtonColor: "#33709f"
  },
  {
    name: "",
    color: "#9b980c",
    lifeButtonColor: "#706f09"
  },
  {
    name: "",
    color: "#0f9b02",
    lifeButtonColor: "#096c01"
  },
]);

export const playerLifeTotalHistoryList = writable([
  {
    name: "",
    entryList: [],
  },
  {
    name: "",
    entryList: [],
  },
  {
    name: "",
    entryList: [],
  },
  {
    name: "",
    entryList: [],
  },
]);

export const addToPlayerLifeTotalHistory = (playerIndex, lifeChangeData) => {
  playerLifeTotalHistoryList.update((val) => {
    val[playerIndex].entryList.push(lifeChangeData);
    return val;
  });
};

export const setPlayerName = (playerIndex, newName) => {
  playerDataList.update((val) => {
    val[playerIndex].name = newName;
    return val;
  });
  playerLifeTotalHistoryList.update((val) => {
    val[playerIndex].name = newName;
    return val;
  });
}

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
