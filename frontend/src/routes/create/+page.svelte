<script>
    import Toolbox from "../../lib/components/Toolbox.svelte";
    import Canvas from "../../lib/components/Canvas.svelte";
    import { writable } from "svelte/store";
  
    // Store for tracking elements added to the canvas
    const elements = writable([]);
  </script>
  
  <div class="min-h-screen bg-gray-800 text-white flex flex-col">
    <!-- Header -->
    <header class="p-4 bg-gray-900 shadow-lg">
      <h1 class="text-2xl font-bold">Interactive Editor</h1>
    </header>
  
    <!-- Main Content -->
    <div class="flex flex-1">
      <!-- Toolbox -->
      <Toolbox {elements} />
  
      <!-- Canvas -->
      <Canvas {elements} />
    </div>
  </div>