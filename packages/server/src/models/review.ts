export interface Review {
  id: string;  // Unique identifier for the review
  userid: string;  // Identifier of the user who wrote the review
  userName: string;  // Username of the reviewer
  spotId: string;

  quietnessRating: number;
  wifiQualityRating: number;
  crowdednessRating: number;
  powerOutletRating: number;
  safetyRating: number; 
  overallRating: number;  // Calculated average of all the ratings
  comment: string;
  createdAt: Date;
}

// function calculateOverallRating(review: Review): number {
//   const total = review.quietnessRating + review.wifiQualityRating + review.crowdednessRating + review.powerOutletRating + review.safetyRating;
//   return total / 5;
// }