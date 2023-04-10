<script>
  import { createEventDispatcher } from "svelte";
  import { startingLifeTotal, startingTimeLeftMinutes } from "./stores.js";
  import SettingsMenuLifeTotalHistory from "./SettingsMenuLifeTotalHistory.svelte";

  const DEFAULT_STARTING_LIFE = 40;
  const DEFAULT_STARTING_TIME_MINUTES = 23;

  const dispatch = createEventDispatcher();

  let showSettings = false;
  let settingsButtonSpinClass = "spin-hidden";
  let settingsButtonScaleClass = "scale-hidden";

  function restartClicked() {
    toggleShowSettings();
    dispatch("restartGame");
  }

  function toggleShowSettings() {
    showSettings = !showSettings;
    if (showSettings) {
      settingsButtonSpinClass = "spin-shown";
      settingsButtonScaleClass = "scale-shown";
      dispatch("showSettings");
    } else {
      settingsButtonSpinClass = "spin-hidden";
      settingsButtonScaleClass = "scale-hidden";
    }
  }
</script>

{#if showSettings}
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
  <SettingsMenuLifeTotalHistory />
  <div class="grid-content">
    <button class="restart-button" on:click={restartClicked}
      ><i class="fa fa-refresh" />Restart</button
    >
  </div>
  <div class="grid-content">Color scheme picker</div>
</div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="settings-button" class="unselectable" on:click={toggleShowSettings}>
  <i
    class="fa-sharp fa-solid fa-gear {settingsButtonScaleClass} {settingsButtonSpinClass}"
  />
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

  .scale-shown {
    scale: 0.75;
  }

  .scale-hidden {
    scale: 0.95;
  }

  .spin-shown {
    animation: fa-spin 60s infinite linear;
  }

  .spin-hidden {
    animation: fa-spin 180s infinite linear;
  }

  #settings-button {
    display: flex;
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    height: 60px;
    width: 60px;
    transform: translate(-50%, -50%);
    color: #d1a215;
    background-color: #403001;
    border-radius: 25px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    font-size: 55px;
    justify-content: center;
    align-items: center;
  }
</style>
