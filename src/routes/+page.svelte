<script>
  import { onMount } from "svelte";
  import Player from "./Player.svelte";
  import SettingsMenu from "./SettingsMenu.svelte";
  import { get } from "svelte/store";
  import {
    startingLifeTotal,
    startingTimeLeftSeconds,
    resetPlayerLifeTotalHistory,
  } from "./stores";

  let playerList = [4];
  let playerBaseClassList = [
    "player-field upside-down",
    "player-field upside-down",
    "player-field",
    "player-field",
  ];
  let activePlayerIndex = -1;

  onMount(resetPlayerLifeTotalHistory);

  function handleUpdateActivePlayer(event) {
    let playerIndex = event.detail.index;

    for (let i = 0; i < playerList.length; i++) {
      playerList[i].stopTimer();
    }

    if (activePlayerIndex === playerIndex) {
      playerList[playerIndex].stopTimer();
      activePlayerIndex = -1;
    } else {
      activePlayerIndex = playerIndex;
      playerList[activePlayerIndex].startTimer();
    }
  }

  function handleShowSettings() {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].stopTimer();
    }
    activePlayerIndex = -1;
  }

  function handleRestartGame(event) {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].reset();
    }
    resetPlayerLifeTotalHistory();
  }
</script>

<div class="top">
  <div class="grid">
    {#each playerBaseClassList as playerBaseClass, i}
      <Player
        index={i}
        baseClass={playerBaseClass}
        bind:this={playerList[i]}
        lifeTotal={get(startingLifeTotal)}
        timeRemaining={get(startingTimeLeftSeconds)}
        on:updateActivePlayer={handleUpdateActivePlayer}
      />
    {/each}

    <SettingsMenu
      on:restartGame={handleRestartGame}
      on:showSettings={handleShowSettings}
    />
  </div>
</div>

<style>
  .top {
    position: fixed;
    top: 0;
    left: 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    width: 100vw;
    height: 100vh;
  }

  :global(.unselectable) {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
