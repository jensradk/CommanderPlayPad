<script>
    import { createEventDispatcher } from 'svelte';
      
      export let name;
      export let index;
    export let lifeTotal = 2;//40;
    export let activeTimer = false;
    export let timeRemaining = 5;//23 * 60;
      export let isDead = false;
      export let className = 'player-field inactive-player';
          
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
                  className = 'player-field active-player';
                  console.log('className is now: ' + className);
              }
    }
  
    export function stopTimer() {
      activeTimer = false;
      clearInterval(intervalId);
          className = 'player-field ' + (isDead ? 'dead-player' : 'inactive-player');
    }
  
    export function resetTimer() {
      activeTimer = false;
      clearInterval(intervalId);
      timeRemaining = 23 * 60;
          isDead = false;
          lifeTotal = 40;
          className = 'player-field inactive-player';
    }
      
      function addToLife(value) {
          lifeTotal = Math.max(0, lifeTotal + value);
          if (lifeTotal <= 0) {
              isDead = true;
              stopTimer();
          } else if (lifeTotal > 0) {
              isDead = false;
          }
          className = 'player-field ' + (isDead ? 'dead-player' : 'inactive-player');
          return lifeTotal;
      }
  </script>
  
  <div class={className}>
      <h2 on:click={clicked} on:keypress={clicked}>{name}</h2>
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
      
    .player-field {
      width: calc(50% - 2rem);
      display: flex;
      flex-direction: column;
      align-items: right;
      justify-content: right;
    }
      
      .active-player {
      background-color: lightblue;
    }
      
      .inactive-player {
          background-color: lightgrey;
      }
      
      .dead-player {
          background-color: red;
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
          width: 50vh;
    }
  
    .timer button {
      margin: 0rem 0rem 0rem 0rem;
    }
  
    .time-remaining {
      font-size: 2rem;
      margin-right: 1rem;
    }
  </style>