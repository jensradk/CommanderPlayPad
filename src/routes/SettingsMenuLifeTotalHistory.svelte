<script>
  import { playerLifeTotalHistoryList } from "./stores.js";
  import {createEventDispatcher} from "svelte";

  const dispatch = createEventDispatcher();

  function openChangeNameModal(playerIndex, playerName) {
    console.log(`Settings, Life History: Opening name change modal for player ${playerIndex}: ${playerName}`);
    dispatch("openChangeNameModal", {playerIndex: playerIndex, playerName: playerName});
  }
</script>

<div class="unselectable">
  <h3>Life total history:</h3>
  <h4>Click player name to change.</h4>
  <div class="scrollable">
    <div class="life-total-lists-container">
      {#each $playerLifeTotalHistoryList as playerLifeTotalHistory, playerIndex}
        <div class="life-total-list">
          <div class="player-name" on:click={() => openChangeNameModal(playerIndex, playerLifeTotalHistory.name)}>
            {playerLifeTotalHistory.name}:
          </div>
          <ul>
            {#each playerLifeTotalHistory.entryList as entry}
              {#if entry.lifeChange === 0}
                <li>Start: {entry.newLifeTotal}</li>
              {:else}
                <li>
                  {#if entry.lifeChange > 0}+{/if}{entry.lifeChange} to {entry.newLifeTotal}
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .player-name {
    text-align: center;
    align-content: center;
    border-bottom: 2px solid white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%; /* Adjust as needed */
  }

  .scrollable {
    height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .life-total-lists-container {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    justify-content: center;
    align-items: flex-start;
    height: 0;
    margin-left: 2vw;
  }

  h3,h4 {
    margin-top: 5px;
    margin-bottom: 0;
    text-align: center;
  }

  .life-total-list {
    margin: 5px;
    padding: 10px;
  }

  ul {
    margin-top: 5px;
    padding: 0px;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
</style>
