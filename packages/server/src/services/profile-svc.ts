import { Schema, Model, Document, model } from "mongoose";
import { Profile } from "../models/profile";

const ProfileSchema = new Schema<Profile>(
  {
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: null },
    bio: { type: String, default: null},
    // avatar: { type: String, default: null},
    avatar: { data: Buffer, contentType: String },
    reviewsCount: { type: Number, default: 0 },
    favSpots: { type: [String], default: [] },
    dateJoined: { type: Date, default: Date.now },
  },
  { collection: "user_profiles" }
);

export const ProfileModel = model<Profile>("Profile", ProfileSchema);

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
  // const p = new ProfileModel(profile);
  // return p.save();

  // Check if the user ID already exists
  return ProfileModel.findOne({ userid: profile.userid })
    .then(existingUserIdProfile => {
      if (existingUserIdProfile) {
        throw new Error("User ID already exists");
      } else {
        // Check if the email already exists
        return ProfileModel.findOne({ email: profile.email });
      }
    })

    .then(existingEmailProfile => {
      if (existingEmailProfile?.email != null) {
        console.log(existingEmailProfile);
        throw new Error("Email already exists");
      } else {
        // If both user ID and email are unique, save the profile
        const p = new ProfileModel(profile);
        return p.save();
      }
    });
}

function update(
  userid: String,
  profile: Profile
): Promise<Profile> {
  return ProfileModel.findOne({ userid })
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      else
        return ProfileModel.findByIdAndUpdate(
          found._id,
          profile,
          {
            new: true
          }
        );
    })
    .then((updated) => {
      if (!updated) throw `${userid} not updated`;
      else return updated as Profile;
    });
}

function remove(userid: String): Promise<void> {
  return ProfileModel.findOneAndDelete({ userid }).then(
    (deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    }
  );
}

function incrementReviewCount(userid: string): Promise<void> {
  return ProfileModel.findOneAndUpdate({ userid }, { $inc: { reviewsCount: 1 } })
    .exec()
    .then((updated) => {
    if (!updated) {
      throw new Error(`incrementReviewCount: ${userid} Not Found`);
    }
  })
  .catch((error) => {
    console.error("Error incrementing review count:", error);
    throw error;
  });
}

export default { index, get, create, update , remove, incrementReviewCount};