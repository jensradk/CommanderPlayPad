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
  <h2 on:click={clicked} on:keypress={clicked}>{name}</h2>
  <div class="life-total">
    <button
      on:click={() => {
        addToLife(-1);
      }}>−</button
    >
    <h1>{lifeTotal}</h1>
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
  h2 {
    width: 100%;
    text-align: center;
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
    border: 2mm ridge rgba(63, 63, 63, 0.6);
  }

  .active-player {
    background-color: rgb(4, 109, 39);
    -webkit-animation: pulse_opacity 10s infinite ease-in-out;
    -o-animation: pulse_opacity 10s infinite ease-in-out;
    -ms-animation: pulse_opacity 10s infinite ease-in-out;
    -moz-animation: pulse_opacity 10s infinite ease-in-out;
    animation: pulse_opacity 10s infinite ease-in-out;
  }

  .inactive-player {
    background-color: lightgrey;
  }

  .dead-player {
    background-color: rgb(99, 32, 32);
  }

  .upside-down {
    rotate: 180deg;
  }

  .life-total {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .life-total button {
    font-size: 2rem;
  }

  .life-total h1 {
    font-size: 6rem;
    margin: 0 2rem;
  }

  .timer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    background: grey;
    width: 100%;
  }

  .timer button {
    margin: 0rem 0rem 0rem 0rem;
  }

  .time-remaining {
    font-size: 4rem;
  }

  @-webkit-keyframes pulse_opacity {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes pulse_opacity {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
</style>
