<script>
    import {createEventDispatcher} from "svelte";
    import {startingLifeTotal, startingTimeLeftMinutes} from "./stores.js";
    import SettingsMenuLifeTotalHistory from "./SettingsMenuLifeTotalHistory.svelte";

    const dispatch = createEventDispatcher();

    const DEFAULT_STARTING_LIFE = 40;
    const DEFAULT_STARTING_TIME_MINUTES = 23;

    let showSettings = false;

    function restartClicked() {
        toggleShowSettings();
        dispatch("restartGame");
    }

    function toggleShowSettings() {
        showSettings = !showSettings;
        if (showSettings) {
            dispatch("showSettings");
        }
    }
</script>

{#if showSettings}
    <div class="grid-settings unselectable">
        <div class="grid-content">
            <div class="setting-description">
                Starting life: <input class="setting-input" type="number" bind:value={$startingLifeTotal}/>
            </div>
            <div class="value-changer-flex-container">
                <button
                        class="value-changer-button"
                        on:click={() => {
          $startingLifeTotal--;
        }}>-
                </button
                >
                <button
                        class="value-changer-button"
                        on:click={() => {
          $startingLifeTotal++;
        }}>+
                </button
                >
                <button
                        class="value-changer-button"
                        on:click={() => {
          $startingLifeTotal = DEFAULT_STARTING_LIFE;
        }}>Reset
                </button
                >
            </div>
            <div class="setting-description">
                Starting time: <input class="setting-input"
                    type="number"
                    bind:value={$startingTimeLeftMinutes}
            />
            </div>
            <div class="value-changer-flex-container">
                <button
                        class="value-changer-button"
                        on:click={() => {
          $startingTimeLeftMinutes--;
        }}>-
                </button
                >
                <button
                        class="value-changer-button"
                        on:click={() => {
          $startingTimeLeftMinutes++;
        }}>+
                </button
                >
                <button
                        class="value-changer-button"
                        on:click={() => {
          $startingTimeLeftMinutes = DEFAULT_STARTING_TIME_MINUTES;
        }}>Reset
                </button
                >
            </div>
        </div>
        <SettingsMenuLifeTotalHistory
                on:openChangeNameModal
        />
        <div class="grid-content">
            <button class="restart-button" on:click={restartClicked}
            ><i class="fa fa-refresh"/>Restart
            </button
            >
        </div>
        <div class="grid-content">
            <p>Space reserved for future use...perhaps just extend the life total history?</p>
        </div>
    </div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="settings-button" class="unselectable" on:click={toggleShowSettings}>
    <i
            class="fa-sharp fa-solid fa-gear spin"
    />
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
