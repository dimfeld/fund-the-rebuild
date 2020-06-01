<script>
  import GoFundMeEmbed from './GoFundMeEmbed.svelte';

  const campaigns = [
    'rebuilding-bole-ethiopian-cuisine',
    'twin-cities-recovery-project-south-mpls-support',
    'georgefloyd',
  ];
</script>

<div class="flex flex-col space-y-8">
  {#each campaigns as campaign}
    <GoFundMeEmbed {campaign} />
  {/each}
</div>
