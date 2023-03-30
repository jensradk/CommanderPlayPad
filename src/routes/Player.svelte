<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let name;
  export let index;
  export let lifeTotal = 40;
  export let activeTimer = false;
  export let timeRemaining = 23 * 60;
  export let isDead = false;
  export let isUpsideDown = false;
  export let className = "player-field inactive-player";

  const dispatch = createEventDispatcher();

  function clicked() {
    dispatch("message", { index: index });
  }

  let intervalId = null;

  export function startTimer() {
    if (timeRemaining > 0) {
      activeTimer = true;
      intervalId = setInterval(() => {
        timeRemaining--;
        if (timeRemaining === 0) {
          addToLife(-lifeTotal);
          stopTimer();
        }
      }, 1000);
      className = createClassName();
    }
  }

  export function stopTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    className = createClassName();
  }

  export function resetTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    timeRemaining = 23 * 60;
    isDead = false;
    lifeTotal = 40;
    className = createClassName();
  }

  function addToLife(value) {
    lifeTotal = Math.max(0, lifeTotal + value);
    if (lifeTotal <= 0) {
      isDead = true;
      stopTimer();
    } else if (lifeTotal > 0) {
      isDead = false;
    }
    className = createClassName();
    return lifeTotal;
  }

  function createClassName() {
    className = "player-field";
    if (isDead) {
      className += " dead-player";
    } else {
      if (activeTimer) {
        className += " active-player";
      } else {
        className += " inactive-player";
      }
    }
    if (isUpsideDown) {
      className += " upside-down";
    }
    return className;
    console.log("className: " + className);
  }

  onMount(() => {
    className = createClassName();
  });
</script>

<div class={className}>
  <div class="player-name" on:click={clicked} on:keypress={clicked}>{name}</div>
  <div class="life-total">
    <button
      on:click={() => {
        addToLife(-1);
      }}>−</button
    >
    <h1 on:click={clicked} on:keypress={clicked}>{lifeTotal}</h1>
    <button
      on:click={() => {
        addToLife(1);
      }}>+</button
    >
  </div>
  <div class="timer" on:click={clicked} on:keypress={clicked}>
    <div class="time-remaining">
      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)
        .toString()
        .padStart(2, "0")}
    </div>
    <!-- <button class="resetbutton" on:click={resetTimer}>Reset</button> -->
  </div>
</div>

<style>
  .player-name {
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
  }

  .resetbutton {
    alignment: right;
  }

  .player-field {
    width: 100% - 20px;
    height: 100% - 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 5px;
    border: 10px;
    border: 2px solid rgba(63, 63, 63, 0.6);
    border-radius: 10px;
  }

  .active-player {
    background-color: rgb(17, 87, 40);
  }

  .inactive-player {
    background-color: rgb(80, 79, 79);
  }

  .dead-player {
    background-color: rgb(59, 18, 18);
  }

  .upside-down {
    rotate: 180deg;
  }

  .life-total {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
  }

  .life-total button {
    font-size: 2rem;
    width: 25%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    border-radius: 10px;
    opacity: 0.5;
  }

  .life-total h1 {
    font-size: 8rem;
    width: 50%;
    height: 100%;
    text-align: center;
    margin: 0px;
    vertical-align: middle;
  }

  .timer {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(128, 128, 128, 0.5);
    width: 100%;
    border-radius: 5px;
    background: #00000000;
  }

  .timer button {
    margin: 0px;
  }

  .time-remaining {
    font-size: 5rem;
  }
</style>
