export interface StudySpot {
  name: string;
  description: string;
  address: string;
  hoursOfOperation: string;
  ratings: {
    overall: number;
    quietness: number;
    wifiQuality: number;
    crowdedness: number;
    powerOutlets: number;
    amenities: number;
  };
  // reviews: string[]; // User's reviews, as IDs
  tags: string[] | undefined;
  photos: string[] | undefined;
}