export interface ISpace {
  id: number;
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
  id: number;
  reward_type: number;
  reward_required_points: number;
  reward_image_url: string;
  name: string;
  description: string;
  start_time: number;
  end_time: number;
  total_completed: number;
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
  total_completed: number;
}
