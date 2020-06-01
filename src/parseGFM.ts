import { JSDOM } from 'jsdom';

export default function(data) {
  const dom = new JSDOM(data, {
    includeNodeLocations: true,
    runScripts: 'dangerously',
  });

  let campaign = dom.window.initialState.feed.campaign;
  let { fund_description, ...rest } = campaign;
  return rest;
}
