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

<div class="flex flex-col max-w-full">
  <div class="flex sm:hidden justify-end items-end space-x-2 px-2">

    <div style="width:61px" class="overflow-hidden">
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        class="twitter-share-button"
        data-url="https://fund-the-rebuild.now.sh"
        data-show-count="false">
        Tweet
      </a>
    </div>
    <div>
      <iframe
        src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ffundtherebuild.com&layout=button_count&size=small&width=96&height=20&appId"
        width="96"
        height="20"
        style="border:none;overflow:hidden"
        scrolling="no"
        frameborder="0"
        allowTransparency="true"
        allow="encrypted-media" />
    </div>

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
      <div style="width:76px" class="overflow-hidden">
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          class="twitter-share-button"
          data-size="large"
          data-url="https://fund-the-rebuild.now.sh"
          data-show-count="true">
          Tweet
        </a>
      </div>
      <iframe
        src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ffundtherebuild.com&layout=button_count&size=large&width=102&height=28&appId"
        width="102"
        height="28"
        style="border:none;overflow:hidden"
        scrolling="no"
        frameborder="0"
        allowTransparency="true"
        allow="encrypted-media" />

    </div>

  </div>

  <div class="mt-4 flex flex-col divide-y sm:space-y-8">
    {#each showCampaigns as campaign}
      <Campaign {campaign} />
    {/each}
  </div>
</div>
