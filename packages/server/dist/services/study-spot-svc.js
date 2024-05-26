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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var study_spot_svc_exports = {};
__export(study_spot_svc_exports, {
  default: () => study_spot_svc_default
});
module.exports = __toCommonJS(study_spot_svc_exports);
var import_mongoose = require("mongoose");
const StudySpotSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // description: { type: String, default: null },
    address: { type: String, required: true },
    hoursOfOperation: { type: String, default: null },
    ratings: {
      overall: { type: Number, default: 0 },
      quietness: { type: Number, default: 0 },
      wifiQuality: { type: Number, default: 0 },
      crowdedness: { type: Number, default: 0 },
      powerOutlets: { type: Number, default: 0 },
      amenities: { type: Number, default: 0 }
    },
    tags: { type: [String], default: [] },
    photos: { type: [String], default: [] }
  },
  { collection: "study_spots" }
);
const StudySpotModel = (0, import_mongoose.model)("StudySpot", StudySpotSchema);
function getStudySpotbyId(id) {
  return StudySpotModel.findById(id).exec().then((studySpot) => {
    return studySpot;
  }).catch((error) => {
    console.error("Error fetching study spot by id:", error);
    throw error;
  });
}
function create(studySpotData) {
  const newStudySpot = new StudySpotModel(studySpotData);
  return newStudySpot.save().then((studySpotData2) => {
    return studySpotData2;
  }).catch((error) => {
    console.error("Error creating study spot:", error);
    throw error;
  });
}
function getStudySpotsByTag(tag) {
  return __async(this, null, function* () {
    try {
      const spots = yield StudySpotModel.find({ tags: tag }).exec();
      return spots;
    } catch (error) {
      console.error("Error fetching study spot by tag:", error);
      throw error;
    }
  });
}
function getFavoriteStudySpots(favoriteStudySpotIds) {
  return __async(this, null, function* () {
    try {
      const spots = yield StudySpotModel.find({
        _id: { $in: favoriteStudySpotIds }
      }).exec();
      return spots;
    } catch (error) {
      console.error("Error fetching favorite study spots:", error);
      throw error;
    }
  });
}
var study_spot_svc_default = { getStudySpotbyId, create, getStudySpotsByTag, getFavoriteStudySpots };
