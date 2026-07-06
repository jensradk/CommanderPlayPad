<script>
    import { game, addCommanderDamage } from "$lib/game.svelte.js";

    let { playerIndex, enemyIndex } = $props();

    let enemy = $derived(game.players[enemyIndex]);
    let damageGiven = $derived(
        game.players[playerIndex].commanderDamageGiven[enemyIndex]
    );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="container" style="background-color: {enemy.color}">
    <div class="enemy-info top">
        <div class="enemy-name">
            To {enemy.name}:
        </div>
        <div class="enemy-damage">
            {damageGiven}
        </div>
    </div>
    <div class="button-container">
        <div
            class="button"
            onclick={(event) => {
                event.stopPropagation();
                addCommanderDamage(playerIndex, enemyIndex, -1);
            }}
        >
            <span class="button-text">-</span>
        </div>
        <div
            class="button"
            onclick={(event) => {
                event.stopPropagation();
                addCommanderDamage(playerIndex, enemyIndex, 1);
            }}
        >
            +
        </div>
    </div>
</div>

<style>
    .enemy-info.top {
        pointer-events: none;
    }

    .button-container,
    .button-container * {
        pointer-events: auto;
    }

    .container {
        border: 1px solid rgba(255, 255, 255, 0.10);
        color: #f2f2f2;
        width: 100%;
        height: 100%;
        min-width: 0;
        position: relative;
    }

    .enemy-info {
        display: grid;
        grid-template-columns: 85% 15%;
        width: 100%;
        min-width: 0;
        z-index: 1;
        align-items: stretch; /* Ensures children fill the cell */
    }

    .top {
        position: absolute;
        margin-top: 3px;
        margin-left: 3px;
        align-content: flex-start;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 1;
    }

    .enemy-name {
        font-size: 28px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        min-width: 0;
        padding: 0;
        margin: 0;
        align-self: start;
        justify-self: start;
    }

    .enemy-damage {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
    }

    .button-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 0;
    }

    .button {
        width: 100%;
        height: 100%;
        font-size: 96px;
        border: none;
        background: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .button + .button {
        position: relative;
    }

    .button + .button::before {
        content: "";
        position: absolute;
        left: 0;
        top: 25%;
        width: 2px;
        height: 50%;
        background: rgba(255, 255, 255, 0.15);
    }
</style>
