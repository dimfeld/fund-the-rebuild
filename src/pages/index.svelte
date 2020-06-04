<script>
  import Campaign from './_Campaign.svelte';
  import data from '../../data/campaigns.json';
  import regions from '../../data/regions.json';

  let currentRegion = 'all';
  let currentSort = 'byRaised';
  $: showCampaigns = data.regions[currentRegion][currentSort].map(
    (index) => data.campaigns[index]
  );
</script>

<div class="flex flex-col">
  <div
    class="flex flex-row text-sm text-gray-700 font-medium justify-between px-2
    sm:px-0 sm:justify-start sm:space-x-4">
    <div class="flex flex-col">
      <span>Region</span>
      <select
        class="text-sm text-gray-700 font-medium mt-1 form-select"
        bind:value={currentRegion}>
        <option value="all">All</option>
        {#each regions as region}
          <option value={region}>{region}</option>
        {/each}
      </select>
    </div>

    <div class="flex flex-col">
      <span class="text-sm text-gray-700 font-medium">Show First</span>
      <select
        class="text-sm text-gray-700 font-medium mt-1 form-select"
        bind:value={currentSort}>
        <option value="byRaised">Money Raised</option>
        <option value="byDonations">Number of Donations</option>
        <option value="byRemaining">Remaining Needed</option>
        <option value="byPercent">Percent to Goal</option>
        <option value="bySharedCount">Times Shared</option>
        <!-- <option value="byHearts">Followers</option> -->

      </select>
    </div>
  </div>

  <div class="mt-4 flex flex-col divide-y sm:space-y-8">
    {#each showCampaigns as campaign}
      <Campaign {campaign} />
    {/each}
  </div>
</div>
