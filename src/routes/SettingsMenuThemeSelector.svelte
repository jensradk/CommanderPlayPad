<script>
  let themeNameList = ["orange-brown", "silver-green"];
  let themeName = themeNameList[0];

  function setTheme(newTheme) {
    themeName = newTheme;
  }
</script>

<svelte:head>
  {#if themeName === "orange-brown"}
    <style>
      :root {
        --color-active-a: #977612;
        --color-active-b: #d1a215;
        --color-inactive-a: #403001;
        --color-inactive-b: #6b5101;
        --color-player-dead: #501818;
      }
    </style>
  {:else if themeName === "silver-green"}
    <style>
      :root {
        --color-active-a: #143b15;
        --color-active-b: #0c4f0e;
        --color-inactive-a: #646464;
        --color-inactive-b: #919090;
        --color-player-dead: #3b1212;
      }
    </style>
  {/if}
</svelte:head>

<main>
  <div class="unselectable">
    <h3>Select color theme:</h3>
    <div class="theme-button-flex-container">
    {#each themeNameList as themeId}
      <button
        on:click={() => {
          setTheme(themeId);
        }}
      >
        {themeId}
      </button>
    {/each}
    </div>
  </div>
</main>

<style>
  h3 {
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: center;
  }

  .theme-button-flex-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }

  button {
    padding: 5px;
    margin: 10px;
  }
</style>
