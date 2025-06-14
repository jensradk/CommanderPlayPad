<script>
    import {createEventDispatcher} from "svelte";
    import {get} from "svelte/store";
    import CommanderDamage from "./CommanderDamage.svelte";
    import {
        startingLifeTotal,
        startingTimeLeftSeconds,
        playerDataList,
        addToPlayerLifeTotalHistory,
    } from "./stores";

    const dispatch = createEventDispatcher();

    const LIFECHANGE_FADEOUT_DURATION_MS = 1000;
    const LIFECHANGE_SHOW_DURATION_MS = 10000 - LIFECHANGE_FADEOUT_DURATION_MS;

    export let index;
    export let lifeTotal;
    export let timeRemaining;
    export let baseClass;
    export let commanderDamageGivenList;

    let activeTimer = false;
    let statusClass = "alive-player";
    let activeClass = "inactive-player";
    let lifeChangeClass = "hidden";
    let lifeChange = 0;
    let lifeChangeTimestamp = 0;
    let initialPulseDone = false;

    $: player = $playerDataList[index];

    function clicked() {
        dispatch("updateActivePlayer", {index: index});
        if (activeClass !== "active-player") {
            initialPulseDone = false;
        }
    }

    function recordLifeChangeToHistory() {
        if (lifeChange !== 0) {
            addToPlayerLifeTotalHistory(index, {
                lifeChange: lifeChange,
                newLifeTotal: lifeTotal,
            });
        }
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
        }
    }

    export function stopTimer() {
        activeTimer = false;
        clearInterval(intervalId);
        activeClass = "inactive-player";
        initialPulseDone = false;
    }

    export function reset() {
        activeTimer = false;
        clearInterval(intervalId);
        lifeTotal = get(startingLifeTotal);
        timeRemaining = get(startingTimeLeftSeconds);
        statusClass = "alive-player";
        activeClass = "inactive-player";
    }

    function isDead() {
        return lifeTotal <= 0;
    }

    export function addToLife(value) {
        lifeTotal += value;

        lifeChange = lifeChange + value;
        if (lifeChangeTimestamp === 0) {
            lifeChangeClass = "show-me";
        }
        lifeChangeTimestamp = Date.now();

        if (lifeTotal <= 0) {
            stopTimer();
            statusClass = "dead-player";
        } else if (lifeTotal > 0) {
            statusClass = "alive-player";
        }

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
                        recordLifeChangeToHistory();
                        lifeChange = 0;
                        lifeChangeTimestamp = 0;
                    }, LIFECHANGE_FADEOUT_DURATION_MS);
                }
            },
            LIFECHANGE_SHOW_DURATION_MS,
            lifeChangeTimestamp
        );
        return lifeTotal;
    }

    $: otherPlayers = $playerDataList
        .map((p, i) => ({ ...p, index: i }))
        .filter(p => p.index !== index);
</script>

<div class="{baseClass} {statusClass} {activeClass} unselectable"
     style="background-color: {player.color}"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={clicked} role="button" tabindex="0" class="container-all">
        <div class="commander-damage-container">
            {#each otherPlayers as other}
                <CommanderDamage
                        playerIndex={index}
                        enemyIndex={other.index}
                        enemyName="{other.name}"
                        enemyColor="{other.color}"
                        enemyColorSecondary="{other.colorSecondary}"
                        commanderDamageGiven = {commanderDamageGivenList[other.index] || 0}
                        on:addToCommanderDamage/>
            {/each}
        </div>

        <div class="player-name" role="button" tabindex="0">
            {player.name}
        </div>

        <div class="time-and-pulse-container">
            <div class="time-remaining">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)
                .toString()
                .padStart(2, "0")}
            </div>
            <div class="pulse-line"
                 class:pulse-line-initial={!initialPulseDone && activeClass === 'active-player'}
                 class:pulse-line-active={initialPulseDone && activeClass === 'active-player'}
                 style="background: linear-gradient(90deg, {player.color} 0%, #000 50%, {player.color} 100%);"
                 on:animationend={() => { initialPulseDone = true; }}>
            </div>
        </div>

        <div class="life-container">
            <button style="background-color: {player.colorSecondary}"
                    class="life-change-button"
                    on:click={(event) => {
                        event.stopPropagation();
                        addToLife(-1);
                    }}>
                -
            </button>

            <div class="life-total-and-change-text">
                <div class="life-change-container">
                    <div class={lifeChangeClass}>
                        {lifeChange > 0 ? "+" + lifeChange : lifeChange}
                    </div>
                </div>
                <div class="life-total">
                    {lifeTotal}
                </div>
            </div>

            <button style="background-color: {player.colorSecondary}"
                    class="life-change-button" on:click={(event) => {
                        event.stopPropagation();
                        addToLife(1);
                    }}>
                +
            </button>
        </div>
    </div>
</div>

<style>
    .container-all {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 18% 12% 35% 35%;
    }

    .commander-damage-container {
        width: 90%;
        height: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0 1em;
    }

    .player-name {
        font-size: 3em;
        text-align: center;
        align-content: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        display: inline-block;
    }

    .time-and-pulse-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .time-remaining {
        font-size: 7em;
        align-content: center;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .pulse-line {
        width: 60%;
        height: 0.5vh;
        margin: 0 auto;
        border-radius: 10px;
        opacity: 0;
        position: relative;
        left: 0;
        transition: background 0.3s, opacity 0.3s;
        filter: brightness(1);
    }

    .pulse-line-initial {
        opacity: 1;
        animation: pulse-width-initial 5s ease-in;
    }

    @keyframes pulse-width-initial {
        0% {
            width: 0;
        }
        100% {
            width: 75%;
        }
    }

    .pulse-line-active {
        opacity: 1;
        animation: pulse-width 10s ease-in-out infinite;
    }

    @keyframes pulse-width {
        0% {
            width: 75%;
        }
        50% {
            width: 10%;
        }
        100% {
            width: 75%;
        }
    }

    .life-container {
        display: grid;
        grid-template-columns: 35% 30% 35%;
    }

    .life-change-button {
        margin: auto;
        padding: 0;
        width: 80%;
        height: 80%;
        font-size: 5vh;
        border-radius: 5px;
        border: 2px solid rgba(0, 0, 0);
    }

    .life-total-and-change-text {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .life-total {
        font-size: 12vh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -40%);
        z-index: 1;
    }

    .life-change-container {
        font-size: 4vh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -175%);
        z-index: 2;
    }

    .life-change-container > div {
        width: 6vh;
        height: 6vh;
        border-radius: 50%;
        background: rgba(200, 200, 200, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4vh;
        color: #000;
        margin: 0 auto;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.45)
    }

    .player-field {
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: space-evenly;
        border: 2px solid #000000;
        border-radius: 10px;
    }

    .show-me {
        animation: fadeIn ease-out 225ms;
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

    .hide-me {
        animation: fadeOut ease-in 450ms;
        animation-fill-mode: forwards;
    }

    .upside-down {
        rotate: 180deg;
    }
</style>
