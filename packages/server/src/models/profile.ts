export interface Profile {
  userid: string;
  name: string;
  email: string;
  // nickname: string | undefined;
  dateJoined: Date;
  bio?: string;
  numPosts: Array<string>;
  // comments: Array<String>;
  avatar: string | undefined;
  // color: string | undefined;
}