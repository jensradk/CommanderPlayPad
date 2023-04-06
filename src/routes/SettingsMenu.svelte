<script>
  import { createEventDispatcher } from "svelte";
  import { startingLifeTotal, startingTimeLeftMinutes } from "./stores.js";

  const dispatch = createEventDispatcher();

  function restartClicked() {
    dispatch("restartGame");
  }
</script>

<div id="settings">
  <div>
    <div>
      Starting life: <input type="number" bind:value={$startingLifeTotal} />
    </div>
    <div>
      Starting time: <input
        type="number"
        bind:value={$startingTimeLeftMinutes}
      />
    </div>
    <div>Restart game:</div>
    <button on:click={() => restartClicked()}>&#x2672;</button>
  </div>
</div>

<style>
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
    z-index: 99;
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
</style>
