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

  let showSettings = false;
  let settingsButtonSpinClass = "spin-hidden";
  let settingsButtonScaleClass = "scale-hidden";

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

  function toggleShowSettings() {
    showSettings = !showSettings;
    if (showSettings) {
      settingsButtonSpinClass = "spin-shown";
      settingsButtonScaleClass = "scale-shown";
      for (let i = 0; i < playerList.length; i++) {
        playerList[i].stopTimer();
      }
      activePlayerIndex = -1;
    } else {
      settingsButtonSpinClass = "spin-hidden";
      settingsButtonScaleClass = "scale-hidden";
    }
  }

  function handleRestartGame(event) {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].reset();
    }
    toggleShowSettings();
    resetPlayerLifeTotalHistory();
  }
</script>

{#if showSettings}
  <SettingsMenu on:restartGame={handleRestartGame} />
{/if}

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

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id="settings-button" class="unselectable" on:click={toggleShowSettings}>
    <i
      class="fa-sharp fa-solid fa-gear {settingsButtonScaleClass} {settingsButtonSpinClass}"
    />
  </div>
</div>

<style>
  .scale-shown {
    scale: 0.95;
  }

  .scale-hidden {
    scale: 0.75;
  }

  .spin-shown {
    /* animation: fa-spin 60s infinite linear; */
  }

  .spin-hidden {
    /* animation: fa-spin 180s infinite linear; */
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    width: 100vw;
    height: 100vh;
  }

  #settings-button {
    display: flex;
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    height: 10vh;
    width: 10vh;
    transform: translate(-50%, -50%);
    color: #d1a215;
    background-color: #403001;
    border-radius: 25px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    font-size: 10vh;
    justify-content: center;
    align-items: center;
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
