import { JSDOM } from 'jsdom';
import { get } from 'lodash';
import got from 'got';

function isUrl(u) {
  try {
    new URL(u);
    return u;
  } catch (e) {
    try {
      let withHttp = `https://${u}`;
      new URL(withHttp);
      return withHttp;
    } catch (e) {}
    return null;
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

  let url = isUrl(value);
  if (url) {
    data = await got(url).text();
  } else {
    let campaignUrl = `https://gofundme.com/f/${value}/embed/large`;
    data = await got(campaignUrl).text();
  }
  return parseResponse(data);
}
