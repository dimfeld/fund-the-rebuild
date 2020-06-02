import striptags from 'striptags';

export interface Campaign {
  source: string;
  image: string;
  hearts: string;
  launched: string;
  current: number;
  deactivated: boolean;
  donations: number;
  donations_enabled: boolean;
  goal: number;
  name: string;
  id: string;
  desc: string;
  longDesc: string;
  region: string;
  shared_count: number;
  campaign_state: string;
  user: string;
}

export function handleData(json: any, name: string, state: string) {
  let desc = json.fund_description_excerpt;
  let descEllipsis = desc.lastIndexOf('…');
  if (descEllipsis >= 0) {
    desc = desc.slice(0, descEllipsis);
  }

  return {
    source: 'gfm',
    image: json.campaign_photo.scaled['3x2-640'],
    hearts: json.campaign_hearts,
    launched: json.launch_date,
    current: json.current_amount,
    deactivated: json.deactivated,
    donations: json.donation_count,
    donations_enabled: json.donations_enabled,
    goal: json.goal_amount,
    name: json.fund_name,
    id: name || json.url,
    longDesc: striptags(json.fund_description, []),
    desc,
    region: state || json.location.city,
    shared_count: json.social_share_total,
    campaign_state: json.state,
    user: [json.user_first_name, json.user_last_name].filter(Boolean).join(' '),
  } as Campaign;
}
