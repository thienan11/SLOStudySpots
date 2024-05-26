export interface Review {
  userId: string;  // ID of the user who wrote the review
  studySpotId: string;  // ID of the study spot being reviewed
  quietnessRating: number;
  wifiQualityRating: number;
  crowdednessRating: number;
  powerOutletRating: number;
  amenitiesRating: number; 
  overallRating: number;  // Calculated average of all the ratings
  comment: string;
  createdAt: Date;
  likes: number;
  edited: Boolean;
}

// function calculateOverallRating(review: Review): number {
//   const total = review.quietnessRating + review.wifiQualityRating + review.crowdednessRating + review.powerOutletRating + review.safetyRating;
//   return total / 5;
// }