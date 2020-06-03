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
  let values: { ref: string; name: string }[] = [];
  await client
    .paginate(q.Match(q.Index('approved'), false))
    .each((rows: [string, string][]) => {
      for (let [ref, name] of rows) {
        values.push({ ref, name });
      }
    });

  for (let { ref, name } of values) {
    await client.query(q.Update(ref, { data: { approved: true } }));
    console.log(`Approved ${name}`);
  }
}

run().catch(console.error);
