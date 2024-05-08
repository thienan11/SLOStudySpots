export interface Profile {
  userid: string;
  name: string;
  email: string;
  // nickname: string | undefined;
  bio?: string; // optional
  avatar: string | undefined;
  favSpots?: string[] | undefined; // Array<String>;
  reviewsCount?: number;
  dateJoined: Date;
}