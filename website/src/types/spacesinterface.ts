export interface ISpace {
  id: string;
  version: string;
  name: string;
  description: string;
  image_url: string;
  website_url: string;
  twitter_url: string;
  journeys: any;
  points: any;
}

export interface IJourney {
  id: string;
  reward_type: string;
  reward_required_points: number;
  reward_image_url: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  total_completed: string;
  quests: any;
  completed_users: any;
  users_points: any;
  users_completed_quests: any;
}

export interface IQuest {
  id: string;
  points_amount: number;
  name: string;
  description: string;
  call_to_action_url: string;
  package_id: string;
  module_name: string;
  function_name: string;
  arguments: string[];
  total_completed: number;
  completed_users: any;
}

export interface ISpaceAdminCap {
  id: { id: string };
  name: string;
  space_id: string;
}
