export interface StudySpot {
  name: string;
  description: string;
  address: string;
  hoursOfOperation: string | undefined;
  location: string;
  image: string;
  ratings: {
    overall: number;
    quietness: number | undefined;
    wifiQuality: number | undefined;
    accessibility: number | undefined;
    comfort: number | undefined;
    safety: number | undefined;
  };
  reviews: string[] | undefined; // User's reviews, as IDs
  tags: string[] | undefined;
}