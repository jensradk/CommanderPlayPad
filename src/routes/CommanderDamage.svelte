<script>
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let playerIndex = -1;
    export let enemyName = "Enemy";
    export let enemyIndex = -1;
    export let enemyColor = "red";
    export let enemyColorSecondary = "red";
    export let commanderDamageGiven = 0;
</script>

<div class="container" style="background-color: {enemyColor}">
    <div class="enemy-info">
        <div class="enemy-name">
            {enemyName}
        </div>
        <div class="enemy-damage">
            {commanderDamageGiven}
        </div>
    </div>
    <div class="button-container">
        <button style="background-color: {enemyColorSecondary}"
                class="button"
                on:click={(event) => {
                        console.log(`Adding to commander damage for player ${playerIndex} against enemy ${enemyIndex}`);
                        dispatch("addToCommanderDamage", {
                            playerIndex: playerIndex,
                            enemyIndex: enemyIndex,
                            value: 1
                        });
                        event.stopPropagation();
                    }}>
            +
        </button>
        <button style="background-color: {enemyColorSecondary}"
                class="button"
                on:click={(event) => {
                        console.log(`Subtracting from commander damage for player ${playerIndex} against enemy ${enemyIndex}`);
                        dispatch("addToCommanderDamage", {
                            playerIndex: playerIndex,
                            enemyIndex: enemyIndex,
                            value: -1
                        });
                        event.stopPropagation();
                    }}>
            -
        </button>
    </div>
</div>

<style>
    .container {
        border: 1px solid black;
        display: grid;
        grid-template-rows: 40% 60%;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        min-width: 0;
    }

    .enemy-info {
        display: grid;
        grid-template-columns: 85% 15%;
        width: 100%;
        min-width: 0;
    }

    .enemy-name {
        padding: 5px 0 5px 5px;
        /*border: 1px solid black;*/
        font-size: 1em;
        display: inline-block;
        text-align: left;
        align-content: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        min-width: 0;
    }

    .enemy-damage {
        /*border: 1px solid black;*/
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
    }

    .button-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        height: 100%;
    }

    .button {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        font-size: 2em;
        border-radius: 5px;
        border: 1px solid black;
    }
</style>