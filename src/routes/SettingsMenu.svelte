<script>
    import { game, restartGame, pauseGame } from "$lib/game.svelte.js";
    import SettingsMenuLifeTotalHistory from "./SettingsMenuLifeTotalHistory.svelte";

    let { onOpenChangeNameModal } = $props();

    const DEFAULT_STARTING_LIFE = 40;
    const DEFAULT_STARTING_TIME_MINUTES = 23;

    let showSettings = $state(false);

    function toggleShowSettings() {
        showSettings = !showSettings;
        if (showSettings) {
            pauseGame();
        }
    }

    function restartClicked() {
        toggleShowSettings();
        restartGame();
    }
</script>

{#if showSettings}
    <div class="grid-settings unselectable">
        <div class="grid-content">
            <div class="setting-description">
                Starting life: <input
                    class="setting-input"
                    type="number"
                    bind:value={game.settings.startingLife}
                />
            </div>
            <div class="value-changer-flex-container">
                <button
                    class="value-changer-button"
                    onclick={() => game.settings.startingLife--}>-</button
                >
                <button
                    class="value-changer-button"
                    onclick={() => game.settings.startingLife++}>+</button
                >
                <button
                    class="value-changer-button"
                    onclick={() => (game.settings.startingLife = DEFAULT_STARTING_LIFE)}
                    >Reset</button
                >
            </div>
            <div class="setting-description">
                Starting time: <input
                    class="setting-input"
                    type="number"
                    bind:value={game.settings.startingTimeMinutes}
                />
            </div>
            <div class="value-changer-flex-container">
                <button
                    class="value-changer-button"
                    onclick={() => game.settings.startingTimeMinutes--}>-</button
                >
                <button
                    class="value-changer-button"
                    onclick={() => game.settings.startingTimeMinutes++}>+</button
                >
                <button
                    class="value-changer-button"
                    onclick={() =>
                        (game.settings.startingTimeMinutes =
                            DEFAULT_STARTING_TIME_MINUTES)}>Reset</button
                >
            </div>
        </div>
        <SettingsMenuLifeTotalHistory {onOpenChangeNameModal} />
        <div class="grid-content">
            <button class="restart-button" onclick={restartClicked}
                ><i class="fa fa-refresh"></i>Restart</button
            >
        </div>
        <div class="grid-content">
            <p>Space reserved for future use...perhaps just extend the life total history?</p>
        </div>
    </div>
{/if}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="settings-button" class="unselectable" onclick={toggleShowSettings}>
    <i class="fa-sharp fa-solid fa-gear spin"></i>
</div>

<style>
    .grid-settings {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;
        background-color: black;
        color: #d1a215;
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 99;
        opacity: 0.95;
    }

    .grid-content {
        margin: auto;
    }

    .setting-description {
        font-size: 72px;
    }

    .setting-input {
        font-size: 72px;
        width: 200px;
    }

    .value-changer-flex-container {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .value-changer-button {
        font-size: 96px;
        border: 2px solid rgba(175, 175, 175, 0.6);
        padding: 15px;
        /*width: 30%;*/
    }

    .restart-button {
        font-size: 128px;
        border: 2px solid rgba(175, 175, 175, 0.6);
        padding: 20px;
    }


    .spin {
        animation: fa-spin 120s infinite linear;
    }

    #settings-button {
        display: flex;
        position: absolute;
        z-index: 100;
        top: 50%;
        left: 50%;
        height: 90px;
        width: 90px;
        transform: translate(-50%, -50%);
        color: #aaa;
        background-color: #333;
        border-radius: 50%;
        border: 2px solid rgb(0, 0, 0);
        font-size: 80px;
        justify-content: center;
        align-items: center;
    }
</style>
