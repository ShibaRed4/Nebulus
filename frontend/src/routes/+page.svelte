<!-- src/routes/+page.svelte -->
<script>
  import { goto } from "$app/navigation"; // For programmatic navigation

  // Let's create some dummy data for our feed items
  const feedItems = [
    { id: 1, text: "Video 1", bgColor: "bg-blue-500" },
    { id: 2, text: "Video 2", bgColor: "bg-green-500" },
    { id: 3, text: "Video 3", bgColor: "bg-red-500" },
    { id: 4, text: "Video 4", bgColor: "bg-yellow-500" },
    { id: 5, text: "Video 5", bgColor: "bg-purple-500" },
  ];
</script>

<div class="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center">
  <h1 class="text-3xl font-bold mb-6">Welcome to the App</h1>
  <p class="text-lg mb-4">Click below to start the fill-in-the-blank exercise.</p>

  <!-- Button to navigate to the fill-in-the-blank page -->
  <button
    class="bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-pink-600 transition"
    on:click={() => goto('/create')}
  >
    Go to Create
  </button>
</div>

<div class="feed-container">
  {#each feedItems as item (item.id)}
    <div class="feed-item {item.bgColor}">
      <!-- Content for each feed item -->
      <div class="content">
        <h1>{item.text}</h1>
        <!-- You'd put your video player or other content here -->
      </div>
    </div>
  {/each}
</div>

<style>
  /* Ensure body and html take full height and have no margin/padding */
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden; /* Prevent body scroll */
  }

  .feed-container {
    height: 100vh; /* Full viewport height */
    overflow-y: scroll; /* Enable vertical scrolling */
    scroll-snap-type: y mandatory; /* Snap vertically, always snap */
    /* Optional: for smoother snapping on some browsers */
    scroll-behavior: smooth;
  }

  .feed-item {
    height: 100vh; /* Each item takes full viewport height */
    scroll-snap-align: start; /* Snap to the start of the item */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: white;
    text-align: center;
    /* Just for visual separation */
    border-bottom: 1px solid #555;
    box-sizing: border-box; /* Include padding/border in height */
  }

  .content {
    /* Add some padding or styling for the content within the item */
    padding: 20px;
  }

  /* Simple background colors for demo */
  .bg-blue-500 {
    background-color: #3b82f6;
  }
  .bg-green-500 {
    background-color: #22c55e;
  }
  .bg-red-500 {
    background-color: #ef4444;
  }
  .bg-yellow-500 {
    background-color: #eab308;
  }
  .bg-purple-500 {
    background-color: #a855f7;
  }
</style>
