<script>
  import { createEventDispatcher } from "svelte";

  export let index;
  export let isDead = false;
  export let lifeTotal = 4;
  export let activeTimer = false;
  export let timeRemaining = 23 * 60;
  export let baseClass;
  let statusClass = "alive-player";
  let activeClass = "inactive-player";
  let lifeButtonClass = "inactive-life-button";
  let lifeChangeClass = "hideMe";
  let lifeChange = 0;
  let lifeChangeTimestamp = 0;

  const dispatch = createEventDispatcher();

  function clicked() {
    dispatch("message", { index: index });
  }

  let intervalId = null;

  export function startTimer() {
    if (!isDead && timeRemaining > 0) {
      activeTimer = true;
      intervalId = setInterval(() => {
        timeRemaining--;
        if (timeRemaining === 0) {
          addToLife(-lifeTotal);
        }
      }, 1000);
      activeClass = "active-player";
      lifeButtonClass = "active-life-button";
    }
  }

  export function stopTimer() {
    if (!isDead) {
      activeTimer = false;
      clearInterval(intervalId);
      activeClass = "inactive-player";
      lifeButtonClass = "inactive-life-button";
    }
  }

  export function resetTimer() {
    activeTimer = false;
    clearInterval(intervalId);
    timeRemaining = 23 * 60;
    statusClass = "alive-player";
    activeClass = "inactive-player";
    lifeButtonClass = "active-life-button";
    lifeTotal = 40;
  }

  function addToLife(value) {
    lifeTotal = Math.max(0, lifeTotal + value);
    lifeChange = lifeChange + value;
    lifeChangeTimestamp = Date.now();

    if (lifeTotal <= 0) {
      stopTimer();
      statusClass = "dead-player";
      lifeButtonClass = "dead-life-button";
      isDead = true;
    } else if (lifeTotal > 0) {
      statusClass = "alive-player";
      lifeButtonClass = activeClass === "active-player" ? "active-life-button" : "inactive-life-button";
      isDead = false;
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
      class={lifeButtonClass}
      on:click={() => {
        addToLife(-1);
      }}>−</button
    >
    <div style="flex: 1;">
      <div
        class={lifeChangeClass}
        style="display: flex; font-size: 5vh; position:relative; align-items:center; justify-content: center;"
      >
        {lifeChange > 0 ? "+" + lifeChange : lifeChange}
      </div>
      <h1 on:click={clicked} on:keypress={clicked}>{lifeTotal}</h1>
    </div>
    <button
      class={lifeButtonClass}
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
  :root {
    /** Steel and green
    --color-active-a: #143b15;
    --color-active-b: #0C4F0E;
    --color-inactive-a: #3d3d3d;
    --color-inactive-b: #696969;
    --color-player-dead: #3b1212;
    */

    --color-active-a: #143b15;
    --color-active-b: #0C4F0E;
    --color-inactive-a: #3d3d3d;
    --color-inactive-b: #696969;
    --color-player-dead: #3b1212;
  }

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(63, 63, 63, 0.6);
    border-radius: 10px;
  }

  .active-player {
    color: var(--color-inactive-b);
    background: linear-gradient(0deg, var(--color-active-a) 0%, var(--color-active-b) 100%);
    background-size: 100% 200%;
    animation: gradient 5s ease-in-out infinite;
    -webkit-transition: all 225ms linear;
    -moz-transition: all 225ms linear;
    -o-transition: all 225ms linear;
    transition: all 225ms linear;
  }
  
  @keyframes gradient {
    0% {
      background-position: 100% 100%
    }
    50% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 100%;
    }
  }

  .active-life-button {
    color: var(--color-inactive-b);
    background-image: linear-gradient(to top, var(--color-active-b) 0%, var(--color-active-a) 100%);
    -webkit-transition: all 225ms linear;
    -moz-transition: all 225ms linear;
    -o-transition: all 225ms linear;
    transition: all 225ms linear;
  }

  .inactive-player {
    color: var(--color-active-a);
    background-image: linear-gradient(to top, var(--color-inactive-a) 0%, var(--color-inactive-b) 100%);
    -webkit-transition: all 450ms linear;
    -moz-transition: all 450ms linear;
    -o-transition: all 450ms linear;
    transition: all 450ms linear;
  }

  .inactive-life-button {
    color: var(--color-active-a);
    background-image: linear-gradient(to top, var(--color-inactive-a) 0%, var(--color-inactive-b) 100%);
    -webkit-transition: all 450ms linear;
    -moz-transition: all 450ms linear;
    -o-transition: all 450ms linear;
    transition: all 450ms linear;
  }

  .dead-player {
    background-image: linear-gradient(to top, var(--color-player-dead) 0%, var(--color-player-dead) 100%);    
  }

  .dead-life-button {
    color: var(--color-active-a);
    background-image: linear-gradient(to top, var(--color-player-dead) 0%, var(--color-player-dead) 100%);
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
