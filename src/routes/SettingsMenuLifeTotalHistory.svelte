<script>
  import { playerLifeTotalHistoryList } from "./stores.js";
</script>

<div class="unselectable">
  <h3>Life total history:</h3>
  <div class="scrollable">
    <div class="life-total-lists-flex-container">
      {#each $playerLifeTotalHistoryList as playerLifeTotalHistory}
        <div class="life-total-list">
          {playerLifeTotalHistory.name}:
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
  .scrollable {
    height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .life-total-lists-flex-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    height: 0;
    margin-left: 2vw;
  }

  h3 {
    margin-top: 5px;
    margin-bottom: 5px;
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
