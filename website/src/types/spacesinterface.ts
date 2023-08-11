export interface ISpaces {
  id: string;
  name: string;
  description: string;
  image: string;
  total_completed: number;
  start_time: number;
  end_time: number;
  points: number;
  journeys: IJourney[] | null;
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
