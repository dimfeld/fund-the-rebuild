#!/usr/bin/env ts-node
import * as gfm from '../src/sources/gofundme';
import got from 'got';
import * as fs from 'fs';
import { orderBy } from 'lodash';
import promiseLimit from 'promise-limit';
import striptags from 'striptags';

interface CampaignDef {
  name: string;
  state: string;
}

const campaigns: CampaignDef[] = [
  { name: 'rebuilding-bole-ethiopian-cuisine', state: 'MN' },
  {
    name: 'twin-cities-recovery-project-south-mpls-support',
    state: 'MN',
  },
  { name: 'georgefloyd', state: 'MN' },
  { name: 'restore-japanla', state: 'CA' },
  { name: 'lynn-nguyen-and-brent-collier-riot-relief', state: 'OR' },
  { name: 'help-buranko-cafe', state: 'OR' },
  { name: 'help-poc-owned-business-recover-from-riot', state: 'OR' },
  { name: 'la-mesa-business-disaster-recovery', state: 'CA' },
  { name: 'zahalea-anderson', state: 'CA' },
  { name: 'protesters-and-bond-funds', state: 'GA' },
  { name: 'justicefordavidmcatee', state: 'KY' },
  { name: 'help-minneapolis-small-businesses', state: 'MN' },
  { name: '20ux59f8yo', state: 'TX' },
  { name: 'neighbors4stephanie', state: 'MN' },
  { name: 'inails-amp-spa-long-beach', state: 'CA' },
  { name: 'philadelphia-black-owned-business-relief', state: 'PA' },
  { name: 'help-sb-small-businesses-rebuild-amp-recover', state: 'CA' },
  { name: 'rebuild-san-bernardino', state: 'CA' },
  { name: 'alanbertos-vandalized-help-to-cover-repair-cost', state: 'CA' },
  { name: 'for-james-scurlocks-family', state: 'NE' },
  { name: 'fundraiser-for-small-business-destroyed', state: 'NY' },
  { name: 'express-food-market-relief', state: 'IL' },
  { name: 'bay-area-black-owned-business-relief-fund', state: 'CA' },
  { name: 'help-black-owned-businesses-rebuild', state: 'CA' },
];

function generateIndex(
  data,
  key: string | ((c: Campaign) => number),
  sortOrder = 'asc'
) {
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
  longDesc: string;
  region: string;
  shared_count: number;
  campaign_state: string;
  user: string;
}

const useLocal = Boolean(process.env.LOCAL_GET);

const getCampaign = useLocal ? gfm.getCampaign : getCampaignNet;
const parallel = useLocal ? 2 : 10;

function getCampaignNet(name: string) {
  return got(`https://fundtherebuild.com/api/get-campaign`, {
    searchParams: { campaign: name },
  }).json();
}

async function run() {
  const limit = promiseLimit(parallel);
  let campaignData: Campaign[] = await Promise.all(
    campaigns.map(({ name, state }) => {
      return limit(async () => {
        console.log(`Reading campaign ${name}`);
        let json = await getCampaign(name);

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
          longDesc: striptags(json.fund_description, []),
          desc,
          region: state || json.location.city,
          shared_count: json.social_share_total,
          campaign_state: json.state,
          user: [json.user_first_name, json.user_last_name]
            .filter(Boolean)
            .join(' '),
        } as Campaign;
      }) as Promise<Campaign>;
    })
  );

  campaignData = campaignData
    .map((c, i) => ({ ...c, index: i }))
    .filter((c) => !c.deactivated && c.launched && c.donations_enabled);

  let indices = {
    byHearts: generateIndex(campaignData, 'hearts'),
    byLaunched: generateIndex(campaignData, (c) =>
      new Date(c.launched).valueOf()
    ),
    byRaised: generateIndex(campaignData, 'current'),
    byDonations: generateIndex(campaignData, 'donations'),
    byGoal: generateIndex(campaignData, 'goal'),
    byRemaining: generateIndex(campaignData, (c) => c.goal - c.current, 'desc'),
    byPercent: generateIndex(campaignData, (c) => c.current / c.goal),
    bySharedCount: generateIndex(campaignData, 'shared_count'),
  };

  let regions = Array.from(new Set(campaignData.map((c) => c.region))).sort();

  let perRegion = {};
  for (let region of regions) {
    perRegion[region] = filterByRegion(campaignData, indices, region);
  }

  let output = {
    campaigns: campaignData,
    regions: {
      ...perRegion,
      all: indices,
    },
  };

  fs.writeFileSync('../data/regions.json', JSON.stringify(regions));
  fs.writeFileSync('../data/campaigns.json', JSON.stringify(output));
  console.log('Wrote output to ../data');
}

run().catch(console.error);
