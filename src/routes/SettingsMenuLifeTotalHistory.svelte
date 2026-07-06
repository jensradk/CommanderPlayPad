<script>
    import { game } from "$lib/game.svelte.js";

    let { onOpenChangeNameModal } = $props();
</script>

<div class="unselectable">
    <h3>Life total history</h3>
    <h4>(click player name to change)</h4>
    <div class="scrollable">
        <div class="life-total-lists-container">
            {#each game.players as player, playerIndex}
                <div class="life-total-list">
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="player-name"
                        onclick={() => onOpenChangeNameModal(playerIndex, player.name)}
                    >
                        {player.name}
                    </div>
                    <ul>
                        {#each player.lifeHistory as entry}
                            {#if entry.lifeChange === 0}
                                <li class="life-change-entry">Start: {entry.newLifeTotal}</li>
                            {:else}
                                <li class="life-change-entry">
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
        font-size: 32px;
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
        font-size: 72px;
        margin-top: 5px;
        margin-bottom: 0;
        text-align: center;
    }

    h4 {
        font-size: 32px;
        color: #999999;
    }

    .life-total-list {
        margin: 5px;
        padding: 10px;
    }

    ul {
        font-size: 24px;
        margin-top: 5px;
        padding: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
    }
</style>
