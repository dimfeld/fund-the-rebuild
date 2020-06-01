import { JSDOM } from 'jsdom';
import got from 'got';

function isUrl(u) {
  try {
    new URL(u);
    return true;
  } catch (e) {
    return false;
  }
}

function campaignFromUrl(p) {
  try {
    var url = new URL(p);
  } catch (e) {
    return null;
  }
  if (url) {
    let segments = url.pathname.split('/');
    let fSegment = segments.indexOf('f');
    if (fSegment >= 0) {
      return segments[fSegment + 1];
    }
  }
}

export function parseResponse(data) {
  const dom = new JSDOM(data, {
    includeNodeLocations: true,
    runScripts: 'dangerously',
  });

  let campaign = dom.window.initialState.feed.campaign;
  let { fund_description, ...rest } = campaign;
  return rest;
}

export async function getCampaign(value: string) {
  let campaign = campaignFromUrl(value);
  if (!campaign) {
    campaign = value;
  }

  let campaignUrl = `https://gofundme.com/f/${campaign}`;
  let data = await got(campaignUrl + '/embed/large').text();
  return parseResponse(data);
}
