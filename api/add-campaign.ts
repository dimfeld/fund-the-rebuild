import { NowRequest, NowResponse } from '@now/node';
import * as faunadb from 'faunadb';
const { query: q } = faunadb;

const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY });

export default async function (req: NowRequest, res: NowResponse) {
  try {
    let { name, state } = req.query;
    await client.query(
      q.Create(q.Collection('cause-submissions'), {
        data: { name, state, approved: false },
      })
    );
    res.status(200).json({ added: true });
  } catch (e) {
    res.status(500).json({ message: e.stack });
  }
}
