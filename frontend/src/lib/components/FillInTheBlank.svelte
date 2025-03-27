<script>
    export let element; // Element data passed from parent
    
    // Initialize possibleWords from element config, with a fallback to an empty array
    let possibleWords = element?.config?.possibleWords || [];
    let newWord = '';
  
    function addWord() {
      if (newWord.trim()) {
        possibleWords = [...possibleWords, newWord.trim()];
        newWord = '';
        
        // Ensure element and its config exist before updating
        if (element && element.config) {
          element.config.possibleWords = possibleWords;
        }
      }
    }
</script>
  
<div class="p-4 bg-gray-800 text-white rounded shadow-lg">
    <h3 class="text-lg font-bold mb-2">Fill-in-the-Blank</h3>
    <p class="text-lg">
      The universe, then, is God, of whom the popular gods are manifestations;
      while legends and myths are
      <span class="border-b border-pink-500 inline-block w-32 text-center">
        [blank]
      </span>
    </p>
  
    <!-- Possible Words Configuration -->
    <div class="mt-4">
        <h4 class="text-sm font-bold mb-2">Possible Words:</h4>
        <ul class="space-y-1">
            {#each possibleWords as word}
                <li class="bg-gray-700 rounded p-2">{word}</li>
            {/each}
        </ul>
        <div class="mt-2 flex">
            <input
                type="text"
                class="flex-1 bg-gray-600 text-white p-2 rounded"
                bind:value={newWord}
                placeholder="Add a word..."
            />
            <button
                class="bg-pink-500 text-white px-4 py-2 rounded ml-2"
                on:click={addWord}
            >
                Add
            </button>
        </div>
    </div>
</div>