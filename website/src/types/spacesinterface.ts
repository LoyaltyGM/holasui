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
  id: string;
  name: string;
  description: string;
  image: string;
  start_time: number;
  end_time: number;
  quests: IQuest[] | null;
}

export interface IQuest {
  id: string;
  points_amount: number;
  name: string;
  description: string;
  total_completed: number;
}
