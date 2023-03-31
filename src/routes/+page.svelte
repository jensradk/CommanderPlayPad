<script>
  import Player from "./Player.svelte";

  let playerList = [4];
  let activePlayerIndex = -1;

  function handleMessage(event) {
    let playerIndex = event.detail.index;
    if (activePlayerIndex == -1) {
      playerList[playerIndex].startTimer();
      activePlayerIndex = playerIndex;
    } else if (activePlayerIndex === playerIndex) {
      playerList[playerIndex].stopTimer();
      activePlayerIndex = -1;
    } else {
      for (let i = 0; i < playerList.length; i++) {
        playerList[i].stopTimer();
      }
      activePlayerIndex = playerIndex;
      playerList[activePlayerIndex].startTimer();
    }
  }
</script>

<div class="grid">
  <Player
    name="Player 2"
    index="0"
    baseClass="player upside"
    bind:this={playerList[0]}
    on:message={handleMessage}
    isUpsideDown=true
  />
  <Player
    name="Player 1"
    index="1"
    baseClass="player upside"
    bind:this={playerList[1]}
    on:message={handleMessage}
    isUpsideDown=true
  />
  <Player
    name="Player 3"
    index="2"
    baseClass="player"
    bind:this={playerList[2]}
    on:message={handleMessage}
  />
  <Player
    name="Player 4"
    index="3"
    baseClass="player"
    bind:this={playerList[3]}
    on:message={handleMessage}
  />
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0px;
    width: 100vw;
    height: 100vh;
  }

</style>
