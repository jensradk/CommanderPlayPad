<script>
  import { createEventDispatcher } from "svelte";

  const DEFAULT_STARTING_LIFE_TOTAL = 40;
  const DEFAULT_STARTING_TIME = 23 * 60;

  export let index;
  export let lifeTotal = DEFAULT_STARTING_LIFE_TOTAL;
  export let activeTimer = false;
  export let timeRemaining = DEFAULT_STARTING_TIME;
  export let baseClass;
  let statusClass = "alive-player";
  let activeClass = "inactive-player";
  let lifeButtonClass = "inactive-life-button";
  let lifeChangeClass = "hidden";
  let lifeChange = 0;
  let lifeChangeTimestamp = 0;

  const dispatch = createEventDispatcher();

  function clicked() {
    dispatch("updateActive", { index: index });
  }

  let intervalId = null;

  export function startTimer() {
    if (!isDead() && timeRemaining > 0) {
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
    activeTimer = false;
    clearInterval(intervalId);
    activeClass = "inactive-player";
    if (isDead()) {
      lifeButtonClass = "dead-life-button";
    } else {
      lifeButtonClass = "inactive-life-button";
    }
  }

  export function reset(life, timeMinutes) {
    activeTimer = false;
    clearInterval(intervalId);
    lifeTotal = life;
    timeRemaining = timeMinutes * 60;
    statusClass = "alive-player";
    activeClass = "inactive-player";
    lifeButtonClass = "inactive-life-button";
  }

  function isDead() {
    return lifeTotal <= 0;
  }

  function addToLife(value) {
    lifeTotal = Math.max(0, lifeTotal + value);
    lifeChange = lifeChange + value;
    if (lifeChangeTimestamp === 0) {
      lifeChangeClass = "show-me";
    }
    lifeChangeTimestamp = Date.now();

    if (lifeTotal <= 0) {
      stopTimer();
      statusClass = "dead-player";
      lifeButtonClass = "dead-life-button";
    } else if (lifeTotal > 0) {
      statusClass = "alive-player";
      lifeButtonClass = activeClass === "active-player" ? "active-life-button" : "inactive-life-button";
    }

    // lifeChangeClass = "";

    /*
        This sets a timeout that hides the lifeChange.
        Only allow the hiding if the timestamp is unchanged since the timeout started.
        This makes sure that only the last timeout does something
     */
    setTimeout(
      (changeTimestamp) => {
        if (changeTimestamp === lifeChangeTimestamp) {
          lifeChangeClass = "hide-me";
          setTimeout(() => {
            lifeChange = 0;
            lifeChangeTimestamp = 0;
          }, 500);
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
    <div on:click={clicked} on:keypress={clicked} style="flex: 1;">
      <div
        class={lifeChangeClass}
        style="display: flex; font-size: 5vh; position:relative; align-items:center; justify-content: center;"
      >
        {lifeChange > 0 ? "+" + lifeChange : lifeChange}
      </div>
      <h1>{lifeTotal}</h1>
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
    /* Brown and orange */
    --color-active-a: #977612;
    --color-active-b: #d1a215;
    --color-inactive-a: #403001;
    --color-inactive-b: #6b5101;
    --color-player-dead: #501818;
   

    /** Steel and green
    --color-active-a: #143b15;
    --color-active-b: #0C4F0E;
    --color-inactive-a: #646464;
    --color-inactive-b: #919090;
    --color-player-dead: #3b1212;
    */
  }

  .hide-me {
    animation: fadeOut ease-in 450ms;
    animation-fill-mode: forwards;
  }

  @keyframes fadeOut {
    0% {
      opacity: 0.75;
      top: 0em;
    }
    95% {
      opacity: 0.25;
    }
    100% {
      opacity: 0;
      top: -0.5em;
    }
  }

  .show-me {
    animation: fadeIn ease-out 225ms;
    animation-fill-mode: forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.75;
    }
  }

  .hidden {
    opacity: 0;
  }

  .player-field {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid #3f3f3f;
    border-radius: 10px;
  }

  .active-player {
    color: var(--color-inactive-b);
    background: linear-gradient(0deg, var(--color-active-a) 0%, var(--color-active-b) 100%);
    background-size: 100% 400%;
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
    background-image: linear-gradient(to top, var(--color-inactive-b) 0%, var(--color-inactive-a) 100%);
    -webkit-transition: all 450ms linear;
    -moz-transition: all 450ms linear;
    -o-transition: all 450ms linear;
    transition: all 450ms linear;
  }

  .inactive-life-button {
    color: var(--color-active-a);
    background-image: linear-gradient(to top, var(--color-inactive-b) 0%, var(--color-inactive-a) 100%);
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
    flex: 0 0 25%;
    margin: 0rem;
    padding: 0px;
    height: 100%;
    border-radius: 10px;
    border: 2px solid rgba(175, 175, 175, 0.6);
    opacity: 1;
  }

  .life-total h1 {
    font-size: 14vh;
    flex-grow: inherit;
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
    flex: 0 0 50%
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
