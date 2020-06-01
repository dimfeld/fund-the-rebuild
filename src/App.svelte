<script>
  import Campaign from './Campaign.svelte';
  import data from '../data/campaigns.json';

  let showCampaigns = data.all.byRaised.map((index) => data.campaigns[index]);
</script>

<div class="flex flex-col space-y-8">
  {#each showCampaigns as campaign}
    <Campaign {campaign} />
  {/each}
</div>
