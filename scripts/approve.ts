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

const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY });

async function getData() {
  let values = await client.query<{ data: [string, string][] }>(
    q.Paginate(q.Match(q.Index('approved'), false))
  );

  return values.data.map(([ref, name]) => {
    return { ref, name };
  });
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
  for (let { ref, name } of data) {
    await client.query(q.Update(ref, { data: { approved: true } }));
    console.log(`Approved ${name}`);
  }

  return;

  // const limit = promiseLimit(parallel);
  // let campaignData: Campaign[] = await Promise.all(
  //   data.map((name) => {
  //     return limit(async () => {
  //       console.log(`Reading campaign ${name}`);
  //       try {
  //         let json = await getCampaign(name);
  //         return handleData(json, name, state);
  //       } catch (e) {
  //         console.error(`Failed reading campaign ${name}`, e.stack);
  //       }
  //     }) as Promise<Campaign>;
  //   })
  // );

  // campaignData = campaignData
  //   .filter((c) => {
  //     if (!c) {
  //       return false;
  //     }

  //     if (c.deactivated) {
  //       console.error(`Rejected: ${c.id} is deactivated`);
  //       return false;
  //     } else if (!c.launched) {
  //       console.error(`Rejected: ${c.id} is not launched`);
  //       return false;
  //     } else if (!c.donations_enabled) {
  //       console.error(`Rejected: ${c.id} is not accepting donations`);
  //       return false;
  //     }

  //     return true;
  //   })
  //   .map((c, i) => ({ ...c, index: i }));
}

run().catch(console.error);
