<script>
  import { formatDistanceToNow } from 'date-fns';

  export let campaign;

  $: launched = formatDistanceToNow(new Date(campaign.launched), {
    addSuffix: true,
  });
</script>

<div class="bg-white overflow-hidden shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6 flex flex-col">
    <div class="text-teal-800 text-2xl">{campaign.name}</div>
    <div class="flex flex-row space-x-4">
      <img class="w-64" src={campaign.image} alt="Campaign" />
      <div class="flex flex-col space-y-4">
        <div>Launched {launched}</div>
        <div>
          {campaign.donations} people donated ${campaign.current} out of ${campaign.goal}
        </div>
        <div>{campaign.short_desc}</div>
        <div>{campaign.region}</div>
        <div>{campaign.hearts} hearts, {campaign.shared_count} shares</div>
      </div>
    </div>

  </div>
</div>
