<script>
    import { get } from 'svelte/store';
  
    export let elements; // Store passed from parent
  
    let isOpen = false;
  
    function toggleToolbox() {
      isOpen = !isOpen;
    }
  
    function addElement(type) {
      // Use get() to ensure we're working with the current store value
      const currentElements = get(elements);
      
      elements.update(() => [
        ...currentElements,
        { 
          id: Date.now(), 
          type, 
          config: type === 'fill-in-the-blank' ? { possibleWords: [] } : {} 
        }
      ]);
      
      toggleToolbox(); // Close toolbox after adding
    }
</script>
  
<div class="relative">
    <!-- "+" Icon -->
    <button
      class="bg-pink-500 rounded-full p-4 text-white shadow-lg fixed bottom-8 left-8"
      on:click={toggleToolbox}
      aria-label="Open toolbox"
    >
      +
    </button>
  
    <!-- Toolbox -->
    {#if isOpen}
      <div
        class="absolute bottom-16 left-8 bg-gray-900 text-white p-4 rounded shadow-lg w-64"
      >
        <h2 class="text-lg font-bold mb-2">Toolbox</h2>
        <ul class="space-y-2">
          <li>
            <button
              class="w-full bg-gray-700 hover:bg-gray-600 rounded p-2"
              on:click={() => addElement('fill-in-the-blank')}
            >
              Fill-in-the-Blank
            </button>
          </li>
          <li>
            <button
              class="w-full bg-gray-700 hover:bg-gray-600 rounded p-2"
              on:click={() => addElement('multiple-choice')}
            >
              Multiple Choice
            </button>
          </li>
          <li>
            <button
              class="w-full bg-gray-700 hover:bg-gray-600 rounded p-2"
              on:click={() => addElement('paragraph')}
            >
              Paragraph
            </button>
          </li>
        </ul>
      </div>
    {/if}
</div>