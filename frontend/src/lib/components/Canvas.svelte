<script>
  import { onMount } from 'svelte';
  import FillInTheBlank from "./FillInTheBlank.svelte";
  import MultipleChoice from "./MultipleChoice.svelte";

  export let elements; // Store passed from parent

  // Add logging to verify elements are being received
  $: {
    console.log('Canvas elements:', $elements);
  }
</script>

<div class="flex-1 p-6 bg-gray-700">
  {#if $elements.length === 0}
    <p class="text-white">No elements added yet</p>
  {/if}

  {#each $elements as element (element.id)}
    <div class="mb-4">
      {#if element.type === "fill-in-the-blank"}
        <FillInTheBlank {element} />
      {:else if element.type === "multiple-choice"}
        <MultipleChoice {element} />
      {:else if element.type === "paragraph"}
        <p class="text-white bg-gray-800 p-4 rounded shadow">
          [Paragraph Placeholder]
        </p>
      {/if}
    </div>
  {/each}
</div>