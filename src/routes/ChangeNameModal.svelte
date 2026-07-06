<script>
    let { playerIndex, playerName, onSubmit, onClose } = $props();

    let name = $state(playerName);
    let inputEl;

    function submitNameChange() {
        if (name.trim()) {
            onSubmit(playerIndex, name.trim());
        }
    }

    $effect(() => {
        inputEl?.focus();
        inputEl?.select();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" role="button" tabindex="0" onclick={onClose}></div>
<div class="modal">
    <div class="header">Type new player name:</div>
    <input
        class="new-name-input"
        type="text"
        bind:this={inputEl}
        bind:value={name}
        onkeydown={(e) => e.key === "Enter" && submitNameChange()}
    />
    <div class="button-ok" onclick={submitNameChange}>OK</div>
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
        background: #1c1e22;
        color: #f2f2f2;
        border: 1px solid rgba(255, 255, 255, 0.18);
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
        background: #0b0c0e;
        color: #f2f2f2;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 8px;
    }

    .button-ok {
        font-size: 72px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 15px;
        padding: 16px 48px;
        background-color: #24313f;
    }
</style>
