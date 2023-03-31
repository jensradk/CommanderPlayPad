<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let name;
  export let index;
  export let lifeTotal = 40;
  export let activeTimer = false;
  export let timeRemaining = 23 * 60;
  export let baseClass;
  export let statusClass = 'alive-player';
  export let activeClass = 'inactive-player';

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
      activeClass = 'active-player';
    }
  }

  export function stopTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    activeClass = 'inactive-player';
  }

  export function resetTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    timeRemaining = 23 * 60;
    statusClass = 'alive'
    activeClass = 'inactive-player';
    lifeTotal = 40;
  }

  function addToLife(value) {
    lifeTotal = Math.max(0, lifeTotal + value);
    if (lifeTotal <= 0) {
        statusClass = 'dead-player'
        stopTimer();
    } else if (lifeTotal > 0) {
        statusClass = 'alive-player'
    }
    return lifeTotal;
  }
</script>

  <div class="{baseClass} {statusClass} {activeClass}">
  <!--<div class="player-name" on:click={clicked} on:keypress={clicked}>{name}</div>-->
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
    font-family: sans-serif;
    color:  #ffc102;
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
    margin: 0rem 0rem 0rem 0rem;
    color: #ffc102;
    background-color: #403001;
    height: 100%;
    padding: 0px;
    border-radius: 10px;
    opacity: 1;
  }

  .life-total h1 {
    font-size: 12vh;
    flex: 1;
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
    flex: 1;
  }

  .timer button {
    margin: 0px;
  }

  .time-remaining {
    font-size: 10vh;
    margin-right: 0rem;
  }
</style>
