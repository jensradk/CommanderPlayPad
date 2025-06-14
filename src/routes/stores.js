import { writable, derived, get } from "svelte/store";

export const startingLifeTotal = writable(4);
export const startingTimeLeftMinutes = writable(23);
export const startingTimeLeftSeconds = derived(
  startingTimeLeftMinutes,
  ($startingTimeLeftMinutes) => $startingTimeLeftMinutes * 60
);

export const playerDataList = writable([
  {
    name: "John 1",
    color: "#d02020",
    colorSecondary: "#a91919",
    commanderDamageGivenList: [0, 0, 0, 0],
  },
  {
    name: "John 2",
    color: "#408ccb",
    colorSecondary: "#33709f",
    commanderDamageGivenList: [0, 0, 0, 0],
  },
  {
    name: "John 3",
    color: "#9b980c",
    colorSecondary: "#706f09",
    commanderDamageGivenList: [0, 0, 0, 0],
  },
  {
    name: "John 4",
    color: "#0f9b02",
    colorSecondary: "#096c01",
    commanderDamageGivenList: [0, 0, 0, 0],
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

export const addToPlayerCommanderDamageGiven = (playerIndex, enemyIndex, damageGiven) => {
  console.log(`Store: Adding ${damageGiven} damage from player ${playerIndex} to enemy ${enemyIndex}`);
  playerDataList.update((val) =>
    val.map((playerData, idx) =>
      idx === playerIndex
        ? {
          ...playerData,
          commanderDamageGivenList: playerData.commanderDamageGivenList.map((damage, i) =>
            i === enemyIndex ? damage + damageGiven : damage
          ),
        }
        : playerData
    )
  );
}

export const addToPlayerLifeTotalHistory = (playerIndex, lifeChangeData) => {
  playerLifeTotalHistoryList.update((val) => {
    val[playerIndex].entryList.push(lifeChangeData);
    return val;
  });
};

export const setPlayerName = (playerIndex, newName) => {
  newName = newName.trim();
  playerDataList.update((val) => {
    val[playerIndex].name = newName;
    return val;
  });
  playerLifeTotalHistoryList.update((val) => {
    val[playerIndex].name = newName;
    return val;
  });
}

export const resetCommanderDamageGiven = () => {
  playerDataList.update((val) =>
    val.map((playerData) => ({
      ...playerData,
      commanderDamageGivenList: [0, 0, 0, 0],
    }))
  );
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
