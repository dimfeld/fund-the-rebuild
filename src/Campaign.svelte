<script>
  import { formatDistanceToNow } from 'date-fns';

  export let campaign;

  $: launched = formatDistanceToNow(new Date(campaign.launched), {
    addSuffix: true,
  });
</script>

<style>
  a:hover {
    @apply underline;
  }
</style>

<div class="bg-white overflow-hidden shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6 flex flex-col">
    <div class="text-teal-800 text-xl sm:text-2xl">
      <a href="https://gofundme.com/f/{campaign.id}">{campaign.name}</a>
    </div>
    <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
      <img
        class="w-full sm:w-64 self-start"
        src={campaign.image}
        alt="Campaign" />
      <div class="flex flex-col space-y-4">
        <div>Launched {launched} in {campaign.region}</div>
        <div>
          {campaign.donations} people donated ${campaign.current} out of ${campaign.goal}
        </div>
        <div>{campaign.desc}…</div>

        <div class="flex flex-row space-x-4">

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

          <div class="flex flex-row space-x-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94
                2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0
                000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span class="text-gray-700 font-medium">
              {campaign.shared_count}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
