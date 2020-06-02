import { JSDOM } from 'jsdom';
import { get } from 'lodash';
import got from 'got';

function isUrl(u) {
  try {
    new URL(u);
    return true;
  } catch (e) {
    return false;
  }
}

export function parseResponse(data) {
  const dom = new JSDOM(data, {
    includeNodeLocations: true,
    runScripts: 'dangerously',
  });

  return get(dom.window, ['initialState', 'feed', 'campaign']);
}

export async function getCampaign(value: string) {
  let data;
  if (isUrl(value)) {
    data = await got(value).text();
  } else {
    let campaignUrl = `https://gofundme.com/f/${value}/embed/large`;
    data = await got(campaignUrl).text();
  }
  return parseResponse(data);
}
