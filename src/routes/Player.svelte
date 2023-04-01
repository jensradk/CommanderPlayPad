<script>
  import { createEventDispatcher } from "svelte";

  export let index;
  export let lifeTotal = 40;
  export let activeTimer = false;
  export let timeRemaining = 23 * 60;
  export let baseClass;
  export let statusClass = "alive-player";
  export let activeClass = "inactive-player";
  export let lifeChangeClass = "hideMe";
  export let lifeChange = 0;
  export let lifeChangeTimestamp = 0;

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
      activeClass = "active-player";
    }
  }

  export function stopTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    activeClass = "inactive-player";
  }

  export function resetTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    timeRemaining = 23 * 60;
    statusClass = "alive-player";
    activeClass = "inactive-player";
    lifeTotal = 40;
  }

  function addToLife(value) {
    lifeTotal = Math.max(0, lifeTotal + value);
    lifeChange = lifeChange + value;
    lifeChangeTimestamp = Date.now();

    if (lifeTotal <= 0) {
      statusClass = "dead-player";
      stopTimer();
    } else if (lifeTotal > 0) {
      statusClass = "alive-player";
    }

    lifeChangeClass = "";

    /*
        This sets a timeout that hides the lifeChange.
        Only allow the hiding if the timestamp is unchanged since the timeout started.
        This makes sure that only the last timeout does something
     */
    setTimeout(
      (changeTimestamp) => {
        if (changeTimestamp == lifeChangeTimestamp) {
          lifeChangeClass = "hideMe";
          setTimeout(() => {
            lifeChange = 0;
          }, 1000);
        }
      },
      3000,
      lifeChangeTimestamp
    );
    return lifeTotal;
  }
</script>

<div class="{baseClass} {statusClass} {activeClass} unselectable">
  <div class="life-total">
    <button
      on:click={() => {
        addToLife(-1);
      }}>−</button
    >
    <div style="flex: 1;">
      <div
        class={lifeChangeClass}
        style="display: flex; font-size: 5vh; position:relative; align-items:center; justify-content: center;"
      >
        {lifeChange}
      </div>
      <h1 on:click={clicked} on:keypress={clicked}>{lifeTotal}</h1>
    </div>
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
  </div>
</div>

<style>
  .hideMe {
    animation: fadeOut 1s;
    animation-fill-mode: forwards;
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .player-field {
    font-family: sans-serif;
    color: #ffc102;
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

  .active-player.alive-player {
    background-color: #ffc102;
    color: black;
  }

  .inactive-player.alive-player {
    background-color: #403001;
  }

  .dead-player {
    background-color: rgb(59, 18, 18);
  }

  .upside-down {
    rotate: 180deg;
  }

  .life-total {
    font-size: 15vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    display: flex;
  }

  .life-total button {
    font-size: 15vh;
    flex: 1;
    margin: 0rem;
    color: #ffc102;
    background-color: #403001;
    height: 100%;
    padding: 0px;
    border-radius: 10px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    opacity: 1;
  }

  .life-total h1 {
    font-size: 14vh;
    flex: 1;
    text-align: center;
    margin: 0px;
    vertical-align: middle;
  }

  .timer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 5px;
    background: #00000000;
    flex: 1;
  }

  .timer button {
    margin: 0px;
  }

  .time-remaining {
    font-size: 10vh;
    margin-right: 0rem;
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
