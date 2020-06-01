<script>
  import { fade } from 'svelte/transition';
  import { url, isActive } from '@sveltech/routify';

  let menuOpen = false;
</script>

<style>
  #mobile-nav a.selected {
    @apply border-teal-500 text-teal-700 bg-teal-50;
  }

  #mobile-nav a.selected:focus {
    @apply border-teal-700 text-teal-800 bg-teal-100;
  }

  #mobile-nav a:not(.selected) {
    @apply border-transparent text-gray-600;
  }

  #mobile-nav a:not(.selected):focus {
    @apply border-transparent text-gray-800 bg-gray-50 border-gray-300;
  }

  #mobile-nav a:not(.selected):hover {
    @apply text-gray-800 bg-gray-50 border-gray-300;
  }

  #desktop-nav a.selected {
    @apply border-teal-500 text-gray-900;
  }

  #desktop-nav a.selected:focus {
    @apply border-teal-700;
  }

  #desktop-nav a:not(.selected) {
    @apply text-gray-500 border-transparent;
  }

  #desktop-nav a:not(.selected):focus {
    @apply text-gray-700 border-gray-300;
  }

  #desktop-nav a:not(.selected):hover {
    @apply text-gray-700 border-gray-300;
  }
</style>

<div class="min-h-screen bg-white">
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span
              class="text-lg text-teal-800 font-medium"
              style="font-variant: small-caps">
              Fund The Rebuild
            </span>
            <!-- <img
              class="block lg:hidden h-8 w-auto"
              src="/img/logos/workflow-mark-on-white.svg"
              alt="FundTheRebuild logo" />
            <img
              class="hidden lg:block h-8 w-auto"
              src="/img/logos/workflow-logo-on-white.svg"
              alt="FundTheRebuild logo" /> -->
          </div>
          <div id="desktop-nav" class="hidden sm:-my-px sm:ml-6 sm:flex">
            <a
              href={$url('/')}
              class:selected={$isActive('/index')}
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm
              font-medium leading-5 focus:outline-none transition duration-150
              ease-in-out">
              Causes
            </a>
            <a
              href={$url('add')}
              class:selected={$isActive('/add')}
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 text-sm
              font-medium leading-5 focus:outline-none transition duration-150
              ease-in-out">
              Add
            </a>
            <a
              href={$url('about')}
              class:selected={$isActive('/about')}
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 text-sm
              font-medium leading-5 focus:outline-none transition duration-150
              ease-in-out">
              About
            </a>
          </div>
        </div>

        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <button
            on:click={() => (menuOpen = !menuOpen)}
            class="inline-flex items-center justify-center p-2 rounded-md
            text-gray-400 hover:text-gray-500 hover:bg-gray-100
            focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition
            duration-150 ease-in-out">
            <svg
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24">
              {#if menuOpen}
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              {/if}
            </svg>

          </button>
        </div>
      </div>
    </div>

    {#if menuOpen}
      <div
        id="mobile-nav"
        transition:fade={{ duration: 200 }}
        class="absolute inset-x-0 z-40 bg-white shadow sm:hidden">
        <div class="pt-2 pb-3">
          <a
            on:click={() => (menuOpen = false)}
            href={$url('/')}
            class:selected={$isActive('/index')}
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium
            focus:outline-none transition duration-150 ease-in-out">
            Causes
          </a>
          <a
            on:click={() => (menuOpen = false)}
            href={$url('add')}
            class:selected={$isActive('/add')}
            class="mt-1 block pl-3 pr-4 py-2 border-l-4 text-base font-medium
            focus:outline-none transition duration-150 ease-in-out">
            Add
          </a>
          <a
            on:click={() => (menuOpen = false)}
            href={$url('about')}
            class:selected={$isActive('/about')}
            class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent
            text-base font-medium focus:outline-none transition duration-150
            ease-in-out">
            About
          </a>
        </div>
      </div>
    {/if}
  </nav>

  <div class="pb-10 pt-4 sm:pt-6">
    <!-- <header>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Causes</h1>
      </div>
    </header> -->
    <main>
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</div>
