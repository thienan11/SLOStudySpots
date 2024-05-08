import { Review } from './review';

export interface StudySpot {
  id: string;
  name: string;
  description: string;
  address: string;
  hoursOfOperation?: string;
  location: string;
  image: string;
  ratings: {
    overall: number;
    quietness?: number;
    wifiQuality?: number;
    accessibility?: number;
    comfort?: number;
  };
  reviews: Review[];
  tags: string[];
}