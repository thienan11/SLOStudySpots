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
var review_svc_exports = {};
__export(review_svc_exports, {
  default: () => review_svc_default
});
module.exports = __toCommonJS(review_svc_exports);
var import_mongoose = require("mongoose");
var import_profile_svc = __toESM(require("./profile-svc"));
const ReviewSchema = new import_mongoose.Schema(
  {
    userId: { type: import_mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    spotId: { type: String, required: true },
    quietnessRating: { type: Number, required: true, min: 0, max: 5 },
    wifiQualityRating: { type: Number, required: true, min: 0, max: 5 },
    crowdednessRating: { type: Number, required: true, min: 0, max: 5 },
    powerOutletRating: { type: Number, required: true, min: 0, max: 5 },
    amenitiesRating: { type: Number, required: true, min: 0, max: 5 },
    overallRating: { type: Number, min: 0, max: 5 },
    comment: { type: String, required: true },
    bestTimeToGo: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  },
  { collection: "reviews" }
);
ReviewSchema.pre("save", function(next) {
  const review = this;
  review.overallRating = (review.quietnessRating + review.wifiQualityRating + review.crowdednessRating + review.powerOutletRating + review.amenitiesRating) / 5;
  next();
});
const ReviewModel = (0, import_mongoose.model)("Review", ReviewSchema);
function index() {
  return ReviewModel.find();
}
function getReviewById(id) {
  return ReviewModel.findById(id).populate("userId", "userid name").exec().then((review) => {
    return review;
  }).catch((error) => {
    console.error("Error fetching review by id:", error);
    throw error;
  });
}
function getReviewsBySpotId(spotId) {
  return ReviewModel.find({ spotId }).populate("userId", "userid name").exec().then((reviews) => {
    return reviews;
  }).catch((error) => {
    console.error("Error fetching reviews by spot id:", error);
    throw error;
  });
}
function getReviewsByUserId(userId) {
  return ReviewModel.find({ userId: new import_mongoose.Types.ObjectId(userId) }).populate("userId", "userid name").exec().then((reviews) => reviews).catch((error) => {
    console.error("Error fetching reviews by user id:", error);
    throw error;
  });
}
function create(reviewData) {
  const newReview = new ReviewModel(reviewData);
  return newReview.save().then((review) => {
    return import_profile_svc.default.incrementReviewCount(reviewData.userId.userid).then(() => {
      return ReviewModel.findById(review._id).populate("userId", "userid name").exec();
    }).then((populatedReview) => {
      if (populatedReview) {
        console.log("Creating review for user:", populatedReview.userId.userid);
      }
      console.log("Review Data:", populatedReview);
      return populatedReview;
    });
  }).catch((error) => {
    console.error("Error creating review:", error);
    throw error;
  });
}
function update(id, reviewData) {
  return ReviewModel.findByIdAndUpdate(id, reviewData, { new: true }).exec().then((review) => {
    return review;
  }).catch((error) => {
    console.error("Error updating review:", error);
    throw error;
  });
}
function deleteReviewById(id) {
  return ReviewModel.findByIdAndDelete(id).exec().then((review) => {
    return review;
  }).catch((error) => {
    console.error("Error deleting review by id:", error);
    throw error;
  });
}
var review_svc_default = {
  index,
  getReviewById,
  getReviewsBySpotId,
  getReviewsByUserId,
  create,
  update,
  deleteReviewById
};
