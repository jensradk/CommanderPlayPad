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

  function handleMessage(event) {
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
</script>

<div class="grid">
  {#each playerBaseClassList as playerBaseClass, i}
    <Player
      index={i}
      baseClass={playerBaseClass}
      bind:this={playerList[i]}
      on:message={handleMessage}
    />
  {/each}
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
</style>
