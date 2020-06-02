#!/usr/bin/env -S ts-node -r dotenv/config
// import dotenv from 'dotenv';
// dotenv.config({ debug: true });

import * as gfm from '../src/sources/gofundme';
import got from 'got';
import * as fs from 'fs';
import { orderBy } from 'lodash';
import promiseLimit from 'promise-limit';
import { Campaign, handleData } from '../src/sources/gofundme-isomorphic';
import * as faunadb from 'faunadb';
import pkgDir from 'pkg-dir';
const { query: q } = faunadb;

interface CampaignDef {
  name: string;
  state: string;
}

console.log(process.env.FAUNADB_KEY);
const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY });

async function getData() {
  let values = await client.query<{ data: [string, string][] }>(
    q.Paginate(q.Match(q.Index('approved'), true))
  );

  return values.data.map(([name, state]) => {
    return { name, state };
  });
}

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

const useLocal = Boolean(process.env.LOCAL_GET);

const getCampaign = useLocal ? gfm.getCampaign : getCampaignNet;
const parallel = useLocal ? 2 : 20;

function getCampaignNet(name: string) {
  return got(`https://fundtherebuild.com/api/get-campaign`, {
    searchParams: { campaign: name },
  }).json();
}

async function run() {
  let data = await getData();

  const limit = promiseLimit(parallel);
  let campaignData: Campaign[] = await Promise.all(
    data.map(({ name, state }) => {
      return limit(async () => {
        console.log(`Reading campaign ${name}`);
        try {
          let json = await getCampaign(name);
          return handleData(json, name, state);
        } catch (e) {
          console.error(`Failed reading campaign ${name}`, e.stack);
        }
      }) as Promise<Campaign>;
    })
  );

  campaignData = campaignData
    .filter((c) => {
      if (!c) {
        return false;
      }

      if (c.deactivated) {
        console.error(`Rejected: ${c.id} is deactivated`);
        return false;
      } else if (!c.launched) {
        console.error(`Rejected: ${c.id} is not launched`);
        return false;
      } else if (!c.donations_enabled) {
        console.error(`Rejected: ${c.id} is not accepting donations`);
        return false;
      }

      return true;
    })
    .map((c, i) => ({ ...c, index: i }));

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

  let root = pkgDir.sync();
  fs.writeFileSync(`${root}/data/regions.json`, JSON.stringify(regions));
  fs.writeFileSync(`${root}/data/campaigns.json`, JSON.stringify(output));
  console.log('Wrote output to ../data');
}

run().catch(console.error);
