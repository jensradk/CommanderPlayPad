<script>
  import { createEventDispatcher } from "svelte";
  import { startingLifeTotal, startingTimeLeftMinutes } from "./stores.js";
  import SettingsMenuLifeTotalHistory from "./SettingsMenuLifeTotalHistory.svelte";

  const DEFAULT_STARTING_LIFE = 40;
  const DEFAULT_STARTING_TIME_MINUTES = 23;

  const dispatch = createEventDispatcher();

  function restartClicked() {
    dispatch("restartGame");
  }
</script>

<div class="grid-settings unselectable">
  <div class="grid-content">
    <div>
      Starting life: <input type="number" bind:value={$startingLifeTotal} />
    </div>
    <div class="value-changer-flex-container">
      <button
        class="value-changer-button"
        on:click={() => {
          $startingLifeTotal--;
        }}>-</button
      >
      <button
        class="value-changer-button"
        on:click={() => {
          $startingLifeTotal++;
        }}>+</button
      >
      <button
        class="value-changer-button"
        on:click={() => {
          $startingLifeTotal = DEFAULT_STARTING_LIFE;
        }}>Reset</button
      >
    </div>
    <div>
      Starting time: <input
        type="number"
        bind:value={$startingTimeLeftMinutes}
      />
    </div>
    <div class="value-changer-flex-container">
      <button
        class="value-changer-button"
        on:click={() => {
          $startingTimeLeftMinutes--;
        }}>-</button
      >
      <button
        class="value-changer-button"
        on:click={() => {
          $startingTimeLeftMinutes++;
        }}>+</button
      >
      <button
        class="value-changer-button"
        on:click={() => {
          $startingTimeLeftMinutes = DEFAULT_STARTING_TIME_MINUTES;
        }}>Reset</button
      >
    </div>
  </div>
  <SettingsMenuLifeTotalHistory/>
  <div class="grid-content">
    <button class="restart-button" on:click={() => restartClicked()}
      ><i class="fa fa-refresh" />Restart</button
    >
  </div>
  <div class="grid-content">Color scheme picker</div>
</div>

<style>
  .grid-settings {
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
    opacity: 0.9;
  }

  .grid-content {
    margin: auto;
  }

  .value-changer-flex-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }

  .value-changer-button {
    font-size: 3vh;
    border-radius: 10px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    padding: 15px;
    width: 30%;
  }

  .restart-button {
    font-size: 10vh;
    border-radius: 10px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    padding: 20px;
  }
</style>
