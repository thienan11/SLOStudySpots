import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";
import profileSvc from "./profile-svc";
import { Profile } from "../models/profile";
import { ProfileModel } from "./profile-svc";

const credentialSchema = new Schema<Credential>(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    }
  },
  { collection: "user_credentials" }
);

const credentialModel = model<Credential>(
  "Credential",
  credentialSchema
);

function createProfile(username: string) {
  return new Promise<Profile>((resolve, reject) => {
    const newProfile = new ProfileModel({
      userid: username,
      name: username
    });

    profileSvc
      .create(newProfile)
      .then((createdProfile) => {
        console.log("Profile created successfully:", createdProfile);
        resolve(createdProfile);
      })
      .catch((err) => {
        console.error("Error creating profile:", err);
        reject(new Error("unable to create new profile for user"));
      });
  });
}

function create(username: string, password: string) {
  return new Promise<Credential>((resolve, reject) => {
    if (!username || !password) {
      reject("must provide username and password");
    }
    credentialModel
      .find({ username })
      .then((found: Credential[]) => {
        if (found.length) {
          reject("username exists");
          return Promise.reject('username exists'); // This stops the chain from proceeding to the next then
        };
      })
      .then(() =>
        bcrypt
          .genSalt(10)
          .then((salt: string) => bcrypt.hash(password, salt))
          .then((hashedPassword: string) => {
            const creds = new credentialModel({
              username,
              hashedPassword
            });
            return creds.save();
          })
      )
      .then((created: Credential) => {
        if (created) {
          return createProfile(username)
            .then(() => resolve(created))
            .catch((error) => {
              // Handle profile creation error
              console.error("Profile creation failed:", error);
              reject("Profile creation failed");
            });
        } else {
          reject("Failed to create credentials");
        }
      })
      .catch(error => {
        reject(error); // Handle any errors that occur during the process
      });
  });
}

function verify(
  username: string,
  password: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    credentialModel
      .find({ username })
      .then((found) => {
        if (found && found.length === 1) return found[0];
        else reject("Invalid username or password");
      })
      .then((credsOnFile) => {
        if (credsOnFile)
          bcrypt.compare(
            password,
            credsOnFile.hashedPassword,
            (_, result) => {
              console.log(
                "Verified",
                result,
                credsOnFile.username
              );
              if (result) resolve(credsOnFile.username);
              else reject("Invalid username or password");
            }
          );
        else reject("Invalid username or password");
      });
  });
}

export default { create, verify };