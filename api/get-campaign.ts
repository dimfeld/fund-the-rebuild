import { NowRequest, NowResponse } from '@now/node';
import got from 'got';
import { JSDOM } from 'jsdom';

import { getCampaign } from '../src/sources/gofundme';

async function tryGet(req: NowRequest, res: NowResponse, tryAgain = true) {
  try {
    let { campaign } = req.query;
    if (!campaign) {
      return res.status(404).json({
        error: 'MISSING_CAMPAIGN',
      });
    }

    let x = new JSDOM();

    let result = await getCampaign(campaign as string);
    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof got.HTTPError && e.response.statusCode === 404) {
      return res.status(404).json({
        error: 'CAMPAIGN_NOT_FOUND',
      });
    }

    if (tryAgain) {
      return tryGet(req, res, false);
    } else {
      return res.status(500).json({
        error: e.stack,
        response: e.response,
      });
    }
  }
}

export default async function (req: NowRequest, res: NowResponse) {
  return tryGet(req, res, true);
}
