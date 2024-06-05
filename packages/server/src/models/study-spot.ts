export interface StudySpot {
  name: string;
  address: string;
  locationType: string; // e.g. "Cafe", "Library", "Park", "Other" and will be added to the tags
  hoursOfOperation: Array<OperatingHours> | undefined;
  ratings: Ratings;
  tags: string[] | undefined;
  photos: string[] | undefined;
  link: string | undefined; // any link to the study spot's website if available
  createdBy: string; // userid of the user who created the study spot (for future reference)
}

interface Ratings {
  overall: number;
  quietness: number;
  wifiQuality: number;
  crowdedness: number;
  powerOutlets: number;
  amenities: number;
}

interface OperatingHours {
  startDay: Day;
  endDay: Day;
  open: number; // Time in minutes since midnight or -1 if closed
  close: number; // Time in minutes since midnight or -1 if closed
  isOpen24Hours: boolean;
  isClosed: boolean;
}

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";