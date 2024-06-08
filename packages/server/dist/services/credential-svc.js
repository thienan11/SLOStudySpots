"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var credential_svc_exports = {};
__export(credential_svc_exports, {
  default: () => credential_svc_default
});
module.exports = __toCommonJS(credential_svc_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_mongoose = require("mongoose");
var import_profile_svc = __toESM(require("./profile-svc"));
var import_profile_svc2 = require("./profile-svc");
const credentialSchema = new import_mongoose.Schema(
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
const credentialModel = (0, import_mongoose.model)(
  "Credential",
  credentialSchema
);
function createProfile(username) {
  return new Promise((resolve, reject) => {
    const newProfile = new import_profile_svc2.ProfileModel({
      userid: username,
      name: username
    });
    import_profile_svc.default.create(newProfile).then((createdProfile) => {
      console.log("Profile created successfully:", createdProfile);
      resolve(createdProfile);
    }).catch((err) => {
      console.error("Error creating profile:", err);
      reject(new Error("unable to create new profile for user"));
    });
  });
}
function create(username, password) {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      reject("must provide username and password");
    }
    credentialModel.find({ username }).then((found) => {
      if (found.length) {
        reject("username exists");
        return Promise.reject("username exists");
      }
      ;
    }).then(
      () => import_bcryptjs.default.genSalt(10).then((salt) => import_bcryptjs.default.hash(password, salt)).then((hashedPassword) => {
        const creds = new credentialModel({
          username,
          hashedPassword
        });
        return creds.save();
      })
    ).then((created) => {
      if (created) {
        return createProfile(username).then(() => resolve(created)).catch((error) => {
          console.error("Profile creation failed:", error);
          reject("Profile creation failed");
        });
      } else {
        reject("Failed to create credentials");
      }
    }).catch((error) => {
      reject(error);
    });
  });
}
function verify(username, password) {
  return new Promise((resolve, reject) => {
    credentialModel.find({ username }).then((found) => {
      if (found && found.length === 1)
        return found[0];
      else
        reject("Invalid username or password");
    }).then((credsOnFile) => {
      if (credsOnFile)
        import_bcryptjs.default.compare(
          password,
          credsOnFile.hashedPassword,
          (_, result) => {
            console.log(
              "Verified",
              result,
              credsOnFile.username
            );
            if (result)
              resolve(credsOnFile.username);
            else
              reject("Invalid username or password");
          }
        );
      else
        reject("Invalid username or password");
    });
  });
}
var credential_svc_default = { create, verify };
