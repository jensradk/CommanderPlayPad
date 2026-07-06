<script>
    import CommanderDamage from "./CommanderDamage.svelte";
    import StopWatch from "./StopWatch.svelte";
    import Crown from "./Crown.svelte";
    import { game, isDead, addToLife, addPoison, setActivePlayer, setMonarch } from "$lib/game.svelte.js";

    let { index, baseClass } = $props();

    let player = $derived(game.players[index]);
    let dead = $derived(isDead(player));
    let active = $derived(game.activePlayerIndex === index);
    let elapsedSeconds = $derived(
        game.settings.startingTimeMinutes * 60 - player.timeRemainingSeconds
    );

    let lifeChangeClass = $derived(
        player.lifeChangePhase === "shown"
            ? "life-change-indicator-show-me"
            : player.lifeChangePhase === "fading"
              ? "life-change-indicator-hide-me"
              : "hidden"
    );

    let otherPlayers = $derived(
        game.players
            .map((p, i) => ({ player: p, index: i }))
            .filter((entry) => entry.index !== index)
    );

    let monarch = $derived(game.monarchIndex === index);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="{baseClass} {dead ? 'dead-player' : 'alive-player'} {active
        ? 'active-player'
        : 'inactive-player'} {monarch ? 'monarch-player' : ''} unselectable"
    style="background-color: {player.color}"
>
    <div class="commander-damage-container">
        {#each otherPlayers as other}
            <CommanderDamage playerIndex={index} enemyIndex={other.index} />
        {/each}
    </div>
    <div
        class="player-selection-area"
        role="button"
        tabindex="0"
        onclick={() => setActivePlayer(index)}
    >
        <div class="name-and-time-container">
            <div class="name-row">
                <div
                    class="crown-button"
                    onclick={(event) => {
                        event.stopPropagation();
                        setMonarch(index);
                    }}
                >
                    <Crown filled={monarch} />
                </div>
                <div class="player-name">
                    {player.name}
                </div>
            </div>
            <div class="time-remaining">
                {Math.floor(player.timeRemainingSeconds / 60)}:{(
                    player.timeRemainingSeconds % 60
                )
                    .toString()
                    .padStart(2, "0")}
            </div>
        </div>
        <div class="stopwatch">
            <StopWatch running={active} {elapsedSeconds} />
        </div>
    </div>

    <div class="life-container">
        <div
            style="background-color: {player.colorSecondary}"
            class="life-change-button"
            onclick={(event) => {
                event.stopPropagation();
                addToLife(index, -1);
            }}
        >
            -
        </div>

        <div class="life-total-and-change-text">
            <div class="life-total">
                {player.life}
            </div>
            <div class="life-change-container">
                <div class={lifeChangeClass}>
                    {player.pendingLifeChange > 0
                        ? "+" + player.pendingLifeChange
                        : player.pendingLifeChange}
                </div>
            </div>
            <div class="poison-container">
                <div
                    class="poison-button"
                    onclick={(event) => {
                        event.stopPropagation();
                        addPoison(index, -1);
                    }}
                >
                    -
                </div>
                <div class="poison-count">☠ {player.poison}</div>
                <div
                    class="poison-button"
                    onclick={(event) => {
                        event.stopPropagation();
                        addPoison(index, 1);
                    }}
                >
                    +
                </div>
            </div>
        </div>

        <div
            style="background-color: {player.colorSecondary}"
            class="life-change-button"
            onclick={(event) => {
                event.stopPropagation();
                addToLife(index, 1);
            }}
        >
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .poison-container {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 44px;
    }

    .poison-button {
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 56px;
        border: 2px solid rgba(0, 0, 0, 0.5);
    }

    .poison-count {
        min-width: 110px;
        text-align: center;
    }

    .life-total {
        font-size: 175px;
        text-align: center;
        z-index: 1;
        margin: 0;
        padding: 0;
        line-height: 0.8;
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

    .name-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        max-width: 100%;
    }

    .crown-button {
        width: 90px;
        height: 90px;
        flex: 0 0 auto;
    }

    .monarch-player {
        box-shadow: inset 0 0 0 6px rgba(232, 195, 90, 0.55);
    }

    .upside-down {
        rotate: 180deg;
    }
</style>
