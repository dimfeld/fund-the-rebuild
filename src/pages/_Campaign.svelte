<script>
  import { formatDistanceToNow } from 'date-fns';
  import states from '../../data/states.json';

  export let campaign;

  $: launched = formatDistanceToNow(new Date(campaign.launched), {
    addSuffix: true,
  });

  function formatDollars(n) {
    return Intl.NumberFormat({ style: 'currency' }).format(n);
  }

  function donate() {
    window.plausible('donate');
  }

  function share() {
    window.plausible('share');
  }

  function gotoCampaign() {
    window.plausible('gotoCampaign');
  }

  function regionString(region) {
    return states[region] || region;
  }
</script>

<div class="bg-white overflow-hidden sm:shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6 flex flex-col space-y-2">
    <div class="text-teal-800 text-xl sm:text-2xl">
      <a
        class="hover:underline"
        target="_blank"
        rel="noopener"
        on:click={gotoCampaign}
        href="https://gofundme.com/f/{campaign.id}">
        {campaign.name}
      </a>
    </div>
    <div
      class="flex flex-col sm:items-stretch space-y-4 sm:space-y-0 sm:flex-row
      sm:space-x-4">
      <div class="w-full sm:w-64 ">
        <img class="w-full self-start" src={campaign.image} alt="Campaign" />
      </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-row justify-between">

          <div class="text-sm font-medium text-gray-700 flex flex-col">
            <div>{campaign.donations} donations</div>
            <div>
              ${formatDollars(campaign.current)} out of ${formatDollars(campaign.goal)}
            </div>
          </div>

          <div class="flex flex-row space-x-2 ml-auto text-teal-800">

            <a
              target="_blank"
              rel="noopener"
              on:click={share}
              href="https://www.gofundme.com/f/{campaign.id}/share">
              <span class="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  class="inline-flex items-center px-2.5 py-1.5 border
                  border-gray-300 text-xs leading-4 font-medium rounded
                  text-gray-700 bg-white hover:text-gray-500 focus:outline-none
                  focus:border-blue-300 focus:shadow-outline-blue
                  active:text-gray-800 active:bg-gray-50 transition ease-in-out
                  duration-150">
                  Share
                </button>
              </span>
            </a>
            <a
              target="_blank"
              rel="noopener"
              on:click={donate}
              href="https://www.gofundme.com/f/{campaign.id}/donate">
              <span class="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  class="inline-flex items-center px-2.5 py-1.5 border
                  border-transparent text-xs leading-4 font-medium rounded
                  text-white bg-teal-600 hover:bg-teal-500 focus:outline-none
                  focus:border-teal-700 focus:shadow-outline-teal
                  active:bg-teal-700 transition ease-in-out duration-150">
                  Donate
                </button>
              </span>
            </a>

          </div>
        </div>
        <div
          class="mt-4 overflow-hidden font-serif"
          style="display:-webkit-box;text-overflow:ellipsis;-webkit-box-orient:
          vertical;-webkit-line-clamp:4">
          {@html campaign.longDesc}
        </div>

        <div
          class="text-gray-700 font-medium text-sm mt-4 flex flex-row
          justify-between">
          <div>
            Launched {launched} in
            <span class="inline sm:hidden">{campaign.region}</span>
            <span class="hidden sm:inline">
              {regionString(campaign.region)}
            </span>
          </div>

          <div class="flex flex-row space-x-4">
            {#if typeof campaign.hearts === 'number'}
              <div class="flex flex-row space-x-2">
                <svg
                  class="w-6 h-6 text-red-800"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0
                    115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd" />
                </svg>

                <span class="text-gray-700 font-medium">{campaign.hearts}</span>
              </div>
            {/if}

            {#if typeof campaign.shared_count === 'number'}
              <div class="flex flex-row w-full">
                <div class="flex flex-row space-x-2">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100
                      4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027
                      0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span class="text-gray-700 font-medium">
                    {campaign.shared_count}
                  </span>
                </div>

              </div>
            {/if}
          </div>

        </div>
      </div>
    </div>

  </div>
</div>
