<script>
  import Campaign from './_Campaign.svelte';
  import data from '../../data/campaigns.json';
  import regions from '../../data/regions.json';
  import states from '../../data/states.json';

  let currentRegion = 'all';
  let currentSort = 'byRaised';
  $: showCampaigns = data.regions[currentRegion][currentSort].map(
    (index) => data.campaigns[index]
  );

  $: regionOptions = regions.map((region) => {
    let numCampaigns = data.regions[region][currentSort].length;
    let regionName = states[region] || region;
    return {
      region,
      label: `${regionName} (${numCampaigns})`,
    };
  });
</script>

<div class="flex flex-col">
  <div class="flex sm:hidden justify-end items-end space-x-2 px-2">
    <div
      class="fb-share-button"
      data-href="https://fundtherebuild.com"
      data-layout="button_count"
      data-size="small">
      <a
        target="_blank"
        href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffundtherebuild.com%2F&amp;src=sdkpreparse"
        class="fb-xfbml-parse-ignore">
        Share
      </a>
    </div>
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-url="https://fund-the-rebuild.now.sh"
      data-show-count="false">
      Tweet
    </a>

  </div>
  <div
    class="flex flex-col space-y-2 px-2 sm:px-0 sm:space-y-0 sm:flex-row text-sm
    text-gray-700 font-medium sm:items-end">
    <div class="flex flex-col sm:ml-4">
      <span>Region</span>
      <select
        class="text-base sm:text-sm text-gray-700 font-medium mt-1 form-select"
        bind:value={currentRegion}>
        <option value="all">
          All ({data.regions.all[currentSort].length})
        </option>
        {#each regionOptions as { region, label }}
          <option value={region}>{label}</option>
        {/each}
      </select>
    </div>

    <div class="flex flex-col sm:ml-4">
      <span class="text-sm text-gray-700 font-medium">Show First</span>
      <select
        class="text-base sm:text-sm text-gray-700 font-medium mt-1 form-select"
        bind:value={currentSort}>
        <option value="byRaised">Money Raised</option>
        <option value="byDonations">Number of Donations</option>
        <option value="byRemaining">Remaining Needed</option>
        <option value="byPercent">Percent to Goal</option>
        <option value="bySharedCount">Times Shared</option>
        <!-- <option value="byHearts">Followers</option> -->

      </select>
    </div>

    <div class="hidden sm:ml-auto sm:flex space-x-2">
      <div
        class="fb-share-button"
        data-href="https://fundtherebuild.com"
        data-layout="button_count"
        data-size="large">
        <a
          target="_blank"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffundtherebuild.com%2F&amp;src=sdkpreparse"
          class="fb-xfbml-parse-ignore">
          Share
        </a>
      </div>
      <div>
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          class="twitter-share-button"
          data-size="large"
          data-url="https://fund-the-rebuild.now.sh"
          data-show-count="true">
          Tweet
        </a>
      </div>
    </div>

  </div>

  <div class="mt-4 flex flex-col divide-y sm:space-y-8">
    {#each showCampaigns as campaign}
      <Campaign {campaign} />
    {/each}
  </div>
</div>
