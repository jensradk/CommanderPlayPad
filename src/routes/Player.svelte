<script>
    import { createEventDispatcher } from 'svelte';

      export let name;
      export let index;
      export let lifeTotal = 40;
      export let activeTimer = false;
      export let timeRemaining = 23 * 60;
      export let baseClass;
      export let statusClass = 'alive';
      export let activeClass = 'inactive';

      const dispatch = createEventDispatcher();

      function clicked() {
          dispatch('message', {index: index});
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
                  activeClass = 'active';
              }
    }

    export function stopTimer() {
      activeTimer = false;
      clearInterval(intervalId);
      activeClass = 'inactive';
    }

    export function resetTimer() {
      activeTimer = false;
      clearInterval(intervalId);
      timeRemaining = 23 * 60;
      lifeTotal = 40;
      activeClass = 'inactive';
    }

      function addToLife(value) {
          lifeTotal = Math.max(0, lifeTotal + value);
          if (lifeTotal <= 0) {
              statusClass = 'dead'
              stopTimer();
          } else if (lifeTotal > 0) {
              statusClass = 'alive'
          }
          return lifeTotal;
      }
  </script>

  <div class="{baseClass} {statusClass} {activeClass}">
      <!--<h2 on:click={clicked} on:keypress={clicked}>{name}</h2>-->

    <div class="life-total">
      <button on:click={() => { addToLife(-1) }}>−</button>
      <h1>{lifeTotal}</h1>
      <button on:click={() => { addToLife(1) }}>+</button>
    </div>

    <div class="timer" on:click={clicked} on:keypress={clicked}>
      <div class="time-remaining">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
      <!--<button class="resetbutton" on:click={resetTimer}>Reset</button>-->
    </div>

  </div>

  <style>
      .resetbutton {
          alignment: right;
      }

    .player {
      display: flex;
      flex-direction: column;
    }

    .player.upside {
      transform: rotate(180deg);
    }


    .player {
      color:  #ffc102;
      background-color: #403001;
    }

    .dead {
      background-color: #80081C;
    }

    .life-total {
      flex: 1;
      display: flex;
    }

    .life-total button {
      font-size: 15vh;
      flex: 1;
      margin: 0rem 0rem 0rem 0rem;
      border: 0px;
      color: #ffc102;
      background-color: #403001;
    }

    .dead .life-total button {
      background-color: #80081C;
    }

    .life-total h1 {
      font-size: 10vh;
    }

    .timer {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0px;
    }

    .active .timer {
      background-color: #ffc102;
      color: black;
    }

    .inactive .timer {
      color: #ffc102;
      background-color: black;
    }

    .timer button {
      margin: 0rem 0rem 0rem 0rem;
    }

    .time-remaining {
      font-size: 10vh;
      margin-right: 0rem;
    }
  </style>
