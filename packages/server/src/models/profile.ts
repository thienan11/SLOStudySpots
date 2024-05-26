export interface Profile {
  userid: string;
  name: string;
  email: string;
  bio: string | undefined;
  avatar: string | undefined;
  reviewsCount: number; // Number of reviews user has written
  favSpots: Array<String>; // List of study spot IDs
  dateJoined: Date;
}