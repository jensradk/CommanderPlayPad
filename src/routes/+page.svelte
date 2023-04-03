<script>
  import Player from "./Player.svelte";

  let playerList = [4];
  let playerBaseClassList = [
    "player-field upside-down",
    "player-field upside-down",
    "player-field",
    "player-field",
  ];
  let activePlayerIndex = -1;

  let showSettings = false;

  // Have settings here?
  let startingLife = 40
  let startingTime = 23

  function handleUpdateActive(event) {
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

  function restart() {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].reset(startingLife, startingTime);
    }
    showSettings = false;
  }

</script>

<div class="grid">
  {#each playerBaseClassList as playerBaseClass, i}
    <Player
      index={i}
      baseClass={playerBaseClass}
      bind:this={playerList[i]}
      on:updateActive={handleUpdateActive}
    />
  {/each}
  <div id="settings-button" class="unselectable" on:click={() => (showSettings = true)}>
    &#9881;
  </div>
</div>

{#if showSettings}
  <div id="settings">
    <div>
      <div>Starting life: <input type=number bind:value={startingLife}></div>
      <div>Starting time: <input type=number bind:value={startingTime}></div>
      <div>Start nyt spil:</div>
      <button on:click={() => (restart())}>&#x2672;</button>
    </div>
    <div>
      <button on:click={() => (showSettings = false)}>&#10148;</button>
    </div>
  </div>
{/if}

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
    z-index: 99;
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

  #settings {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    background-color: black;
    color: #d1a215;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
  }

  #settings button {
    font-size: 15vh;
    flex: 1;
    margin: 0rem;
    padding: 0px;
    border-radius: 10px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    opacity: 1;
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
