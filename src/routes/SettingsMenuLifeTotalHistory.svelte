<script>
  import { playerLifeTotalHistoryList } from "./stores.js";
</script>

<div class="unselectable">
  <h3>Life total history:</h3>
  <div class="life-total-lists-flex-container">
    {#each $playerLifeTotalHistoryList as playerLifeTotalHistory}
      <div>
        {playerLifeTotalHistory.name}:
        <ol>
          {#each playerLifeTotalHistory.entryList as entry}
          {#if entry.lifeChange === 0}
            <li>Start: {entry.newLifeTotal}</li>
            {:else}
            <li>{#if entry.lifeChange > 0}+{/if}{entry.lifeChange} to {entry.newLifeTotal}</li>
          {/if}
            
          {/each}
        </ol>
      </div>
    {/each}
  </div>
</div>

<style>
  .life-total-lists-flex-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }

  h3 {
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: center;
  }

  ol {
    margin: 5px;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
