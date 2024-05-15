export interface Review {
  userId: string;  // ID of the user who wrote the review
  spotId: string;  // ID of the study spot being reviewed
  quietnessRating: number;
  wifiQualityRating: number;
  crowdednessRating: number;
  powerOutletRating: number;
  safetyRating: number; 
  overallRating: number;  // Calculated average of all the ratings
  comment: string;
  createdAt: Date;
  likes: Number,
  edited: Boolean,
}

// function calculateOverallRating(review: Review): number {
//   const total = review.quietnessRating + review.wifiQualityRating + review.crowdednessRating + review.powerOutletRating + review.safetyRating;
//   return total / 5;
// }