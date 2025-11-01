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
    import StopWatch from "./StopWatch.svelte";

    const dispatch = createEventDispatcher();

    const LIFECHANGE_FADEOUT_DURATION_MS = 2000;
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
    let stopWatch;

    $: player = $playerDataList[index];

    function timeContainerClicked() {
        dispatch("updateActivePlayer", {index: index});
    }

    function recordLifeChangeToHistory() {
        if (lifeChange !== 0) {
            addToPlayerLifeTotalHistory(index, {
                lifeChange: lifeChange,
                newLifeTotal: lifeTotal,
            });
        }
    }

    let playerTimerIntervalHandler = null;

    export function startTimer() {
        if (!isDead() && timeRemaining > 0) {
            activeTimer = true;
            playerTimerIntervalHandler = setInterval(() => {
                timeRemaining--;
                if (timeRemaining === 0) {
                    addToLife(-lifeTotal);
                }
            }, 1000);
            activeClass = "active-player";
            if (stopWatch) {
                stopWatch.start();
            }
        }
    }

    export function stopTimer() {
        activeTimer = false;
        clearInterval(playerTimerIntervalHandler);
        activeClass = "inactive-player";
        if (stopWatch) {
            stopWatch.stop();
        }
    }

    export function reset() {
        activeTimer = false;
        clearInterval(playerTimerIntervalHandler);
        clearTimeout(lifeChangeTimeoutHandler);
        lifeChangeClass = "hidden";
        lifeTotal = get(startingLifeTotal);
        timeRemaining = get(startingTimeLeftSeconds);
        statusClass = "alive-player";
        activeClass = "inactive-player";
    }

    function isDead() {
        return lifeTotal <= 0;
    }

    let lifeChangeTimeoutHandler = null;

    export function addToLife(value) {
        lifeTotal += value;

        lifeChange = lifeChange + value;
        if (lifeChangeTimestamp === 0) {
            lifeChangeClass = "life-change-indicator-show-me";
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
        lifeChangeTimeoutHandler = setTimeout((changeTimestamp) => {
                if (changeTimestamp === lifeChangeTimestamp) {
                    console.log(`Hiding life change for player ${index} with value ${lifeChange}`);
                    lifeChangeClass = "life-change-indicator-hide-me";
                    recordLifeChangeToHistory();
                    setTimeout(() => {
                        console.log(`Resetting life change indicator for player ${index}`);
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
        .map((p, i) => ({...p, index: i}))
        .filter(p => p.index !== index);

</script>

<div class="{baseClass} {statusClass} {activeClass} unselectable"
     style="background-color: {player.color}"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <div class="commander-damage-container">
        {#each otherPlayers as other}
            <CommanderDamage
                    playerIndex={index}
                    enemyIndex={other.index}
                    enemyName="{other.name}"
                    enemyColor="{other.color}"
                    enemyColorSecondary="{other.colorSecondary}"
                    commanderDamageGiven={commanderDamageGivenList[other.index] || 0}
                    on:addToCommanderDamage/>
        {/each}
    </div>
    <div class="player-selection-area" role="button" tabindex="0" on:click={timeContainerClicked}>
        <div class="name-and-time-container">
            <div class="player-name">
                {player.name}
            </div>
            <div class="time-remaining">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)
                .toString()
                .padStart(2, "0")}
            </div>
        </div>
        <div class="stopwatch">
            <StopWatch bind:this={stopWatch} />
        </div>
    </div>

    <div class="life-container">
        <div style="background-color: {player.colorSecondary}"
                class="life-change-button"
                on:click={(event) => {
                    event.stopPropagation();
                    addToLife(-1);
                }}>
            -
        </div>

        <div class="life-total-and-change-text">
            <div class="life-total">
                {lifeTotal}
            </div>
            <div class="life-change-container">
                <div class={lifeChangeClass}>
                    {lifeChange > 0 ? "+" + lifeChange : lifeChange}
                </div>
            </div>
        </div>

        <div style="background-color: {player.colorSecondary}"
                class="life-change-button" on:click={(event) => {
                    event.stopPropagation();
                    addToLife(1);
                }}>
            +
        </div>
    </div>
</div>

<style>
    .player-field {
        font-family: sans-serif;
        align-content: center;
        align-items: center;
        justify-content: stretch;
        border: 2px solid #000000;
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 20% 50% 30%;
        z-index: 1;
    }

    .commander-damage-container {
        width: 90%;
        height: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .player-selection-area {
        display: grid;
        grid-template-columns: 65% 35%;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .name-and-time-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: relative;
        justify-content: space-between;
        align-items: stretch;
    }

    .player-name {
        font-size: 90px;
        text-align: center;
        align-content: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        max-height: 100%;
    }

    .time-remaining {
        font-size: 250px;
        text-align: center;
        /*padding-left: 20px;*/
        /*padding-right: 10px;*/
        /*width: 100%;*/
        /*height: 100%;*/
    }

    .stopwatch {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .life-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 35% 30% 35%;
        align-content: stretch;
        align-items: center;
        justify-items: center;
        justify-content: center;
    }

    .life-change-button {
        min-width: 100%;
        max-width: 100%;
        min-height: 100%;
        max-height: 100%;
        font-size: 15vh;
        border: 4px solid rgba(0, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }

    .life-total-and-change-text {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: nowrap;
        align-content: flex-end;
        justify-content: flex-start;
        align-items: center;
    }

    .life-total {
        font-size: 175px;
        text-align: center;
        z-index: 1;
        margin: 0;
        padding: 0;
        line-height: 1;
    }

    .life-change-container {
        width: 0;
        height: 0;
        z-index: 2;
    }

    .life-change-container > div {
        width:  86px;
        height: 86px;
        border-radius: 50%;
        transform: translate(-50%, -90%);
        background: rgba(200, 200, 200, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 64px;
        color: #000;
        margin: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.45)
    }

    .life-change-indicator-show-me {
        animation: life-change-indicator-fadeIn ease-out 225ms;
        animation-fill-mode: forwards;
    }

    @keyframes life-change-indicator-fadeOut {
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

    @keyframes life-change-indicator-fadeIn {
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

    .life-change-indicator-hide-me {
        animation: life-change-indicator-fadeOut ease-in 450ms;
        animation-fill-mode: forwards;
    }

    .upside-down {
        rotate: 180deg;
    }
</style>
