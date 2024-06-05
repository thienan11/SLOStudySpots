"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var profile_svc_exports = {};
__export(profile_svc_exports, {
  default: () => profile_svc_default
});
module.exports = __toCommonJS(profile_svc_exports);
var import_mongoose = require("mongoose");
const ProfileSchema = new import_mongoose.Schema(
  {
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: null },
    bio: { type: String, default: null },
    // avatar: { type: String, default: null},
    avatar: { data: Buffer, contentType: String },
    reviewsCount: { type: Number, default: 0 },
    favSpots: { type: [String], default: [] },
    dateJoined: { type: Date, default: Date.now }
  },
  { collection: "user_profiles" }
);
const ProfileModel = (0, import_mongoose.model)("Profile", ProfileSchema);
function index() {
  return ProfileModel.find();
}
function get(userid) {
  return ProfileModel.find({ userid }).then((list) => list[0]).catch((err) => {
    throw `${userid} Not Found`;
  });
}
function create(profile) {
  return ProfileModel.findOne({ userid: profile.userid }).then((existingUserIdProfile) => {
    if (existingUserIdProfile) {
      throw new Error("User ID already exists");
    } else {
      return ProfileModel.findOne({ email: profile.email });
    }
  }).then((existingEmailProfile) => {
    if ((existingEmailProfile == null ? void 0 : existingEmailProfile.email) != null) {
      console.log(existingEmailProfile);
      throw new Error("Email already exists");
    } else {
      const p = new ProfileModel(profile);
      return p.save();
    }
  });
}
function update(userid, profile) {
  return ProfileModel.findOne({ userid }).then((found) => {
    if (!found)
      throw `${userid} Not Found`;
    else
      return ProfileModel.findByIdAndUpdate(
        found._id,
        profile,
        {
          new: true
        }
      );
  }).then((updated) => {
    if (!updated)
      throw `${userid} not updated`;
    else
      return updated;
  });
}
function remove(userid) {
  return ProfileModel.findOneAndDelete({ userid }).then(
    (deleted) => {
      if (!deleted)
        throw `${userid} not deleted`;
    }
  );
}
var profile_svc_default = { index, get, create, update, remove };
