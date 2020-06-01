import { NowRequest, NowResponse } from '@now/node';
import got from 'got';

import parseGFM from '../src/parseGFM';

function isUrl(u) {
  try {
    new URL(u);
    return true;
  } catch (e) {
    return false;
  }
}

export default async function(req: NowRequest, res: NowResponse) {
  try {
    let value: string = req.query.campaign as string;

    let campaignUrl: string;
    if (isUrl(value)) {
      campaignUrl = value;
    } else {
      // Try this?
      campaignUrl = `https://gofundme.com/f/${value}`;
    }

    let data = await got(campaignUrl + '/embed/large');
    let result = parseGFM(data);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      error: e.stack,
    });
  }
}
