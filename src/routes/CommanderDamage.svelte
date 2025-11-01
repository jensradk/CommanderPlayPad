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
    <div class="enemy-info top">
        <div class="enemy-name">
            To {enemyName}:
        </div>
        <div class="enemy-damage">
            {commanderDamageGiven}
        </div>
    </div>
    <div class="button-container">
        <div class="button"
                on:click={(event) => {
                        console.log(`Subtracting from commander damage for player ${playerIndex} against enemy ${enemyIndex}`);
                        dispatch("addToCommanderDamage", {
                            playerIndex: playerIndex,
                            enemyIndex: enemyIndex,
                            value: -1
                        });
                        event.stopPropagation();
                    }}>
            <span class=button-text>-</span>
        </div>
        <div class="button"
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
        </div>
    </div>

<!--    <div class="enemy-info bottom">-->
<!--        <div class="enemy-name">-->
<!--            From {enemyName}:-->
<!--        </div>-->
<!--        <div class="enemy-damage">-->
<!--            {commanderDamageGiven}-->
<!--        </div>-->
<!--    </div>-->
</div>

<style>
    .enemy-info.top,
    .enemy-info.bottom {
        pointer-events: none;
    }

    .button-container,
    .button-container * {
        pointer-events: auto;
    }

    .container {
        border: 1px solid black;
        /*display: grid;*/
        /*grid-template-rows: auto 1fr;*/
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

    .bottom {
        position: absolute;
        margin-left: 3px;
        margin-bottom: 3px;
        align-content: flex-end;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 1;
    }

    .enemy-name {
        /*border: 1px solid black;*/
        font-size: 28px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        min-width: 0;
        padding: 0; /* Remove padding */
        margin: 0;  /* Remove margin */
        align-self: start; /* Align to top edge */
        justify-self: start; /* Align to left edge */
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
        background: black;
    }
</style>