<script>
  import Campaign from './Campaign.svelte';
  import data from '../data/campaigns.json';

  let showCampaigns = data.all.byRaised.map((index) => data.campaigns[index]);
</script>

<div class="container mx-auto sm:px-6 lg:px-8">

  <div class="sm:mt-4 mb-4 flex flex-col divide-y sm:space-y-8">
    {#each showCampaigns as campaign}
      <Campaign {campaign} />
    {/each}
  </div>
</div>
