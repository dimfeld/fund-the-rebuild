#!/usr/bin/env ts-node
import * as gfm from '../src/sources/gofundme';
import * as fs from 'fs';
import { orderBy } from 'lodash';
import promiseLimit from 'promise-limit';

const campaigns = [
  { name: 'rebuilding-bole-ethiopian-cuisine', state: 'MN' },
  {
    name: 'twin-cities-recovery-project-south-mpls-support',
    state: 'MN',
  },
  { name: 'georgefloyd', state: 'MN' },
  { name: 'restore-japanla', state: 'CA' },
];

function generateIndex(data, key, sortOrder = 'asc') {
  return orderBy(data, key, sortOrder).map((c) => c.index);
}

function filterByRegion(
  data,
  indices: { [key: string]: number[] },
  region: string
) {
  let output = {};

  for (let [indexName, campaigns] of Object.entries(indices)) {
    output[indexName] = campaigns.filter((c) => data[c].region === region);
  }

  return output;
}

interface Campaign {
  source: string;
  image: string;
  hearts: string;
  launched: string;
  current: number;
  deactivated: boolean;
  donations: number;
  donations_enabled: boolean;
  goal: number;
  name: string;
  id: string;
  desc: string;
  region: string;
  shared_count: number;
  campaign_state: string;
}

async function run() {
  const limit = promiseLimit(2);
  let campaignData: Campaign[] = await Promise.all(
    campaigns.map(({ name, state }) => {
      return limit(async () => {
        console.log(`Reading campaign ${name}`);
        let json = await gfm.getCampaign(name);

        let desc = json.fund_description_excerpt;
        let descEllipsis = desc.lastIndexOf('…');
        if (descEllipsis >= 0) {
          desc = desc.slice(0, descEllipsis);
        }

        return {
          source: 'gfm',
          image: json.campaign_photo.scaled['3x2-640'],
          hearts: json.campaign_hearts,
          launched: json.launch_date,
          current: json.current_amount,
          deactivated: json.deactivated,
          donations: json.donation_count,
          donations_enabled: json.donations_enabled,
          goal: json.goal_amount,
          name: json.fund_name,
          id: name,
          desc,
          region: state || json.location.city,
          shared_count: json.social_share_total,
          campaign_state: json.state,
        } as Campaign;
      }) as Promise<Campaign>;
    })
  );

  campaignData = campaignData
    .map((c, i) => ({ ...c, index: i }))
    .filter((c) => !c.deactivated);

  let indices = {
    byHearts: generateIndex(campaignData, 'hearts'),
    byLaunched: generateIndex(campaignData, (c) =>
      new Date(c.launched).valueOf()
    ),
    byRaised: generateIndex(campaignData, 'current'),
    byDonations: generateIndex(campaignData, 'donations'),
    byGoal: generateIndex(campaignData, 'goal'),
    byRemaining: generateIndex(campaignData, (c) => c.goal - c.current_amount),
    bySharedCount: generateIndex(campaignData, 'shared_count'),
  };

  let regions = Array.from(new Set(campaignData.map((c) => c.region))).sort();

  let perRegion = {};
  for (let region of regions) {
    perRegion[region] = filterByRegion(campaignData, indices, region);
  }

  let output = {
    campaigns: campaignData,
    regions: perRegion,
    all: indices,
  };

  fs.writeFileSync('../data/regions.json', JSON.stringify(regions));
  fs.writeFileSync('../data/campaigns.json', JSON.stringify(output));
  console.log('Wrote output to ../data');
}

run().catch(console.error);
