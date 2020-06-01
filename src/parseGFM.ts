import { JSDOM } from 'jsdom';
import * as fs from 'fs';

function extract(data) {
  const dom = new JSDOM(data, {
    includeNodeLocations: true,
    runScripts: 'dangerously',
  });

  let campaign = dom.window.initialState.feed.campaign;
  let { fund_description, ...rest } = campaign;
  return rest;
}

console.log(JSON.stringify(extract(fs.readFileSync('a.html'))));
