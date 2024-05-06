import { Profile } from "../models/profile";

// in-memory DB
let profiles: Array<Profile> = [
  {
    userid: "susan",
    name: "Susan Sloth",
    email: "123@gmail.com",
    dateJoined: new Date(),
    bio: "I'm a sloth who likes to study!",
    numPosts: [],
    avatar: "../proto/public/icons/avatar.svg"
  }
  // add a few more profile objects here
];

export function get(id: String): Profile | undefined {
  return profiles.find((t) => t.userid === id);
}

export default { get };