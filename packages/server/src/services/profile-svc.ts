import { Profile } from "../models/profile";

// in-memory DB
let profiles: Array<Profile> = [
  {
    userid: "susan",
    name: "Susan Sloth",
    email: "123@gmail.com",
    bio: "I'm a sloth who likes to study!",
    avatar: "../icons/avatar.svg",
    favSpots: ["Starbucks", "Library"],
    reviewsCount: 5,
    dateJoined: new Date(),
  }
  // add a few more profile objects here
];

export function get(id: String): Profile | undefined {
  return profiles.find((t) => t.userid === id);
}

export default { get };