import { Schema, Model, Document, model } from "mongoose";
import { Profile } from "../models/profile";

const ProfileSchema = new Schema<Profile>(
  {
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: null },
    bio: { type: String, default: null},
    avatar: String,
    favSpots: {type: [String], default: []},
    reviewsCount: { type: Number, default: 0 },
    dateJoined: { type: Date, default: Date.now }
  },
  { collection: "user_profiles" }
);

const ProfileModel = model<Profile>("Profile", ProfileSchema);

function index(): Promise<Profile[]> {
  return ProfileModel.find();
}

function get(userid: String): Promise<Profile> {
  return ProfileModel.find({ userid })
    .then((list) => list[0])
    .catch((err) => {
      throw `${userid} Not Found`;
    });
}

function create(profile: Profile): Promise<Profile> {
  const p = new ProfileModel(profile);
  return p.save();
}

export default { index, get, create };