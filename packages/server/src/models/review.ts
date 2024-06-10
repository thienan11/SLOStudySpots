import { Profile } from './profile';

export interface Review {
  // userId: string;  // ID of the user who wrote the review
  userId: Profile;
  spotId: string;  // ID of the study spot being reviewed
  quietnessRating: number;
  wifiQualityRating: number;
  crowdednessRating: number;
  powerOutletRating: number;
  amenitiesRating: number; 
  overallRating: number;  // Calculated average of all the ratings
  comment: string;
  bestTimeToGo: string; // short description of the best time to go to the study spot (optional?)
  createdAt: Date;
  likes: number;
  edited: Boolean;
}