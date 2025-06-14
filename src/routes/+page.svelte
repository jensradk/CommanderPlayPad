<script>
    import {onMount} from "svelte";
    import Player from "./Player.svelte";
    import SettingsMenu from "./SettingsMenu.svelte";
    import ChangeNameModal from "./ChangeNameModal.svelte";
    import {nameList} from "./namelist.js";
    import {get} from "svelte/store";
    import {
        startingLifeTotal,
        startingTimeLeftSeconds,
        playerDataList,
        resetPlayerLifeTotalHistory,
        resetCommanderDamageGiven,
        setPlayerName,
        addToPlayerCommanderDamageGiven,
    } from "./stores";

    let playerList = [4];

    let playerBaseClassList = [
        "player-field upside-down",
        "player-field upside-down",
        "player-field",
        "player-field",
    ];
    let activePlayerIndex = -1;

    onMount(() => {
        resetPlayerLifeTotalHistory();
        // resetCommanderDamageGiven();
        setRandomPlayerNames();
    });

    function setRandomPlayerNames() {
        let randomNames = nameList.slice().sort(() => Math.random() - 0.5).slice(0, playerList.length);
        for (let i = 0; i < playerList.length; i++) {
            setPlayerName(i, randomNames[i]);
        }
    }

    function handleUpdateActivePlayer(event) {
        let playerIndex = event.detail.index;

        for (let i = 0; i < playerList.length; i++) {
            playerList[i].stopTimer();
        }

        if (activePlayerIndex === playerIndex) {
            playerList[playerIndex].stopTimer();
            activePlayerIndex = -1;
        } else {
            activePlayerIndex = playerIndex;
            playerList[activePlayerIndex].startTimer();
        }
    }

    function handleShowSettings() {
        for (let i = 0; i < playerList.length; i++) {
            playerList[i].stopTimer();
        }
        activePlayerIndex = -1;
    }

    function handleRestartGame(event) {
        for (let i = 0; i < playerList.length; i++) {
            playerList[i].reset();
        }
        resetPlayerLifeTotalHistory();
        resetCommanderDamageGiven();
    }

    let changeNameModalShow = false;
    let changeNameModalExistingName = "";
    let changeNameModalPlayerIndex = -1;

    function openChangeNameModal(playerIndex, playerName) {
        changeNameModalExistingName = playerName;
        changeNameModalPlayerIndex = playerIndex;
        changeNameModalShow = true;
    }

    function submitNameChange(index, newName) {
        if (newName.trim() !== "") {
            setPlayerName(index, newName.trim());
        }
        changeNameModalShow = false;
    }

    function handleCommanderDamageGiven(event) {
        let playerIndex = event.detail.playerIndex;
        let enemyIndex = event.detail.enemyIndex;
        let damage = event.detail.value;
        function canAddToCommanderDamage(playerIndex, enemyIndex, damage) {
            if (enemyIndex >= 0 && enemyIndex < playerList.length) {
                if (damage > 0) {
                    return $playerDataList[playerIndex].commanderDamageGivenList[enemyIndex] < 21;
                } else if (damage < 0) {
                    return $playerDataList[playerIndex].commanderDamageGivenList[enemyIndex] > 0;
                } else {
                    return false;
                }
            }
        }

        console.log(`Page: Commander damage given for player ${playerIndex} against enemy ${enemyIndex}`);
        if (canAddToCommanderDamage(playerIndex, enemyIndex, damage)) {
            addToPlayerCommanderDamageGiven(playerIndex, enemyIndex, damage);
            playerList[enemyIndex].addToLife(-damage);
        }
    }

</script>

<div class="top">
    <div class="grid">
        {#each $playerDataList as playerData, i}
            <Player class="{playerBaseClassList[i]}"
                    index={i}
                    bind:this={playerList[i]}
                    baseClass={playerBaseClassList[i]}
                    lifeTotal={get(startingLifeTotal)}
                    timeRemaining={get(startingTimeLeftSeconds)}
                    commanderDamageGivenList={playerData.commanderDamageGivenList}
                    on:updateActivePlayer={handleUpdateActivePlayer}
                    on:addToCommanderDamage={handleCommanderDamageGiven}
            />
        {/each}

        <SettingsMenu
                on:restartGame={handleRestartGame}
                on:showSettings={handleShowSettings}
                on:openChangeNameModal={(event) => {
            console.log(`Page: Opening change name modal for player ${event.detail.playerIndex}: ${event.detail.playerName}`);
            openChangeNameModal(event.detail.playerIndex, event.detail.playerName);
        }}
        />
    </div>
    {#if changeNameModalShow}
        <ChangeNameModal
                playerName={changeNameModalExistingName}
                playerIndex={changeNameModalPlayerIndex}
                on:nameChanged={(event) => {
            console.log(`Name changed for player ${event.detail.playerIndex}: ${event.detail.playerName}`);
            submitNameChange(event.detail.playerIndex, event.detail.playerName);
        }}
                on:closeChangeNameModal={() => {
            changeNameModalShow = false;
        }}
        />
    {/if}
</div>

<style>
    .top {
        position: fixed;
        top: 0;
        left: 0;
    }

    .grid {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;
        gap: 0;
        width: 100vw;
        height: 100vh;
    }

    :global(.unselectable) {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
