<script>
    import {createEventDispatcher} from 'svelte';
    import {onMount} from 'svelte';

    const dispatch = createEventDispatcher();

    export let playerIndex;
    export let playerName;

    let inputEL;

    function submitNameChange() {
        console.log(`Submitting name change for player ${playerIndex}: ${playerName}`);
        if (playerName.trim()) {
            dispatch('nameChanged', {playerIndex: playerIndex, playerName: playerName.trim()});
        }
    }

    onMount(() => {
        inputEL.focus();
        inputEL.select();
    });
</script>

<div class="modal-backdrop" role="button" tabindex="0" on:click={() => dispatch("closeChangeNameModal")}>
</div>
<div class="modal">
    <div class="header">Type new player name:</div>
    <input class="new-name-input"
           type="text"
           bind:this={inputEL}
           bind:value={playerName}
           on:keydown={(e) => e.key === "Enter" && submitNameChange()}
    />
    <div class="button-ok" on:click={submitNameChange}>OK</div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 1000;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #aaa;
        padding: 2em;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 1400px;
        height: 400px;
        align-items: center;
        border-radius: 16px;
    }

    .header {
        font-size: 82px;
    }

    .new-name-input {
        font-size: 96px;
    }

    .button-ok {
        font-size: 72px;
        border: 2px black solid;
        border-radius: 15px;
        padding: 16px 48px;
        background-color: #ccc;
    }
</style>