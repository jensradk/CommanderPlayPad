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
    color: "#3d5a80",
    colorSecondary: "#2b3f59",
    commanderDamageGivenList: [0, 0, 0, 0],
  },
  {
    name: "Player 2",
    color: "#a84a4a",
    colorSecondary: "#7e3838",
    commanderDamageGivenList: [0, 0, 0, 0],
  },
  {
    name: "Player 3",
    color: "#9a983f",
    colorSecondary: "#605e27",
    commanderDamageGivenList: [0, 0, 0, 0],
  },
  {
    name: "Player 4",
    color: "#4b9d44",
    colorSecondary: "#2f5d2a",
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
