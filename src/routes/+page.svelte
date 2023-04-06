<script>
  import Player from "./Player.svelte";
  import SettingsMenu from "./SettingsMenu.svelte";

  let playerList = [4];
  let playerBaseClassList = [
    "player-field upside-down",
    "player-field upside-down",
    "player-field",
    "player-field",
  ];
  let activePlayerIndex = -1;

  let showSettings = false;

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
  }

  function handleRestartGame(event) {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].reset();
    }
    showSettings = false;
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
      on:updateActivePlayer={handleUpdateActivePlayer}
    />
  {/each}

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id="settings-button" class="unselectable" on:click={toggleShowSettings}>
    &#9881;
  </div>
</div>

<style>
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
    border-radius: 20px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    font-size: 10vh;
    justify-content: center;
    align-items: center;
  }

  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
