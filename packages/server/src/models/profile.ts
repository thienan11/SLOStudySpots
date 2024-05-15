export interface Profile {
  userid: string;
  name: string;
  email: string;
  bio: string | undefined;
  avatar: string | undefined;
  reviewsCount: number | undefined; // Number of reviews user has written
  reviews: string[] | undefined; // User's reviews, as IDs
  favSpots: string[] | undefined; // User's favorite study spots, as IDs
  dateJoined: Date;
}