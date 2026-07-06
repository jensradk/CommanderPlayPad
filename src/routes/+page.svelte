<script>
    import { onMount } from "svelte";
    import Player from "./Player.svelte";
    import SettingsMenu from "./SettingsMenu.svelte";
    import ChangeNameModal from "./ChangeNameModal.svelte";
    import { nameList } from "./namelist.js";
    import { game, setPlayerName } from "$lib/game.svelte.js";

    const playerBaseClassList = [
        "player-field upside-down",
        "player-field upside-down",
        "player-field",
        "player-field",
    ];

    let rootEl;
    let modal = $state(null); // { playerIndex, playerName } | null

    function scaleToWindow() {
        const baseWidth = 2048;
        const baseHeight = 1536;
        const scaleX = window.innerWidth / baseWidth;
        const scaleY = window.innerHeight / baseHeight;
        rootEl.style.transform = `scale(${scaleX}, ${scaleY})`;
        rootEl.style.transformOrigin = "top left";
        rootEl.style.width = baseWidth + "px";
        rootEl.style.height = baseHeight + "px";
    }

    function setRandomPlayerNames() {
        const randomNames = nameList.slice().sort(() => Math.random() - 0.5);
        for (let i = 0; i < game.players.length; i++) {
            setPlayerName(i, randomNames[i]);
        }
    }

    onMount(() => {
        setRandomPlayerNames();
        scaleToWindow();
        window.addEventListener("resize", scaleToWindow);
        return () => window.removeEventListener("resize", scaleToWindow);
    });
</script>

<div class="top" bind:this={rootEl}>
    <div class="grid">
        {#each game.players as _, i}
            <Player index={i} baseClass={playerBaseClassList[i]} />
        {/each}

        <SettingsMenu
            onOpenChangeNameModal={(playerIndex, playerName) =>
                (modal = { playerIndex, playerName })}
        />
    </div>
    {#if modal}
        <ChangeNameModal
            playerIndex={modal.playerIndex}
            playerName={modal.playerName}
            onSubmit={(index, newName) => {
                setPlayerName(index, newName);
                modal = null;
            }}
            onClose={() => (modal = null)}
        />
    {/if}
</div>

<style>
    .top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .grid {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;
        gap: 0;
        width: 100%;
        height: 100%;
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
