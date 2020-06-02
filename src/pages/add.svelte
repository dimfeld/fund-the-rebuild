<script>
  import ky from 'ky';
  import { handleData } from '../sources/gofundme-isomorphic';
  import Campaign from './_Campaign.svelte';
  let url = '';

  const STATE_IDLE = 0,
    STATE_LOADING = 1,
    STATE_ERROR = 2,
    STATE_DONE = 3,
    STATE_SUBMITTING = 4,
    STATE_SUBMITTED = 5;
  let state = STATE_IDLE;
  let campaign;
  const abort = new AbortController();

  async function fetch() {
    if (!url) {
      return;
    }

    // Cancel any currently-running fetches.
    abort.abort();

    state = STATE_LOADING;
    try {
      let result = await ky
        .get('/api/get-campaign', {
          searchParams: { campaign: url },
          signal: abort.signal,
        })
        .json();

      campaign = handleData(result);
      console.dir(campaign);
      state = STATE_DONE;
    } catch (e) {
      if (e.name === 'AbortError') {
        // Something else is running.
        return;
      }
      state = STATE_ERROR;
      console.error(e);
    }
  }

  async function submitCampaign() {
    if (!campaign) {
      return;
    }

    let campaignState = campaign.region.trim();
    let m = /, ([A-Z]{2})$/.exec(state);
    if (m) {
      console.log(m);
      campaignState = m[1];
    }

    state = STATE_SUBMITTING;
    try {
      await ky
        .post('/api/add-campaign', {
          searchParams: { name: campaign.id, state: campaignState },
        })
        .json();
    } catch (e) {
      console.error(e);
    }

    // TODO Handle if the item already exists.

    state = STATE_SUBMITTED;
  }
</script>

<div class="mx-8">
  <div class="flex flex-col">
    <form action="#" on:submit={fetch}>
      <label
        for="campaign-url"
        class="block text-sm font-medium leading-5 text-gray-700">
        GoFundMe campaign URL
      </label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <div class="relative flex-grow focus-within:z-10">
          <input
            id="campaign-url"
            bind:value={url}
            class="form-input block w-full rounded-none rounded-l-md transition
            ease-in-out duration-150 sm:text-sm sm:leading-5" />
        </div>
        <button
          class="-ml-px relative inline-flex items-center px-4 py-2 border
          border-gray-300 text-sm leading-5 font-medium rounded-r-md
          text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white
          focus:outline-none focus:shadow-outline-blue focus:border-blue-300
          active:bg-gray-100 active:text-gray-700 transition ease-in-out
          duration-150">
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <span class="ml-2">Find</span>
        </button>
      </div>
      <!-- <p class="mt-2 text-sm text-gray-500" id="email-description">Copy</p> -->
    </form>

    <div class="mt-2">
      {#if state === STATE_IDLE}
        <span class="text-sm font-medium text-gray-700">
          Add the URL of the campaign above and it will show up here.
        </span>
      {:else if state === STATE_LOADING}
        Loading spinner!
      {:else if state === STATE_ERROR}
        <span class="text-sm font-medium text-gray-700">
          Couldn't load this campaign. Please check the URL you used.
        </span>
      {:else if state === STATE_DONE || state === STATE_SUBMITTING || state === STATE_SUBMITTED}
        <span class="text-sm font-medium text-gray-700">
          {#if state === STATE_DONE}
            If this is the right campaign, click this button to add it.
            <button
              type="button"
              on:click={submitCampaign}
              class="inline-flex items-center px-2.5 py-1.5 border
              border-transparent text-xs leading-4 font-medium rounded
              text-white bg-teal-600 hover:bg-teal-500 focus:outline-none
              focus:border-teal-700 focus:shadow-outline-teal active:bg-teal-700
              transition ease-in-out duration-150">
              Add
            </button>
          {:else if state === STATE_SUBMITTING}
            Submitting...
          {:else if state === STATE_SUBMITTED}
            I'll try to process your submission and get it on the site within a
            day. Thank you!
          {/if}
        </span>
        <Campaign {campaign} />
      {/if}
    </div>

  </div>

</div>
