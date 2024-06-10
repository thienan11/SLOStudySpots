import { Schema, Model, Document, model, Types } from "mongoose";
import { Review } from "../models/review";

const ReviewSchema = new Schema<Review>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    spotId: { type: String, required: true },
    quietnessRating: { type: Number, required: true, min: 0, max: 5 },
    wifiQualityRating: { type: Number, required: true, min: 0, max: 5 },
    crowdednessRating: { type: Number, required: true, min: 0, max: 5 },
    powerOutletRating: { type: Number, required: true, min: 0, max: 5 },
    amenitiesRating: { type: Number, required: true, min: 0, max: 5 },
    overallRating: { type: Number, min: 0, max: 5 },
    comment: { type: String, required: true },
    bestTimeToGo: { type: String, default: ""},
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  },
  { collection: "reviews" }
);

ReviewSchema.pre('save', function(next) {
  const review = this;
  review.overallRating = (
    review.quietnessRating +
    review.wifiQualityRating +
    review.crowdednessRating +
    review.powerOutletRating +
    review.amenitiesRating
  ) / 5;
  next();
});

const ReviewModel = model<Review>("Review", ReviewSchema);

function index(): Promise<Review[]> {
  return ReviewModel.find();
}

// Return a review by its ID
function getReviewById(id: string): Promise<Review | null> {
  return ReviewModel.findById(id)
    .exec()
    .then((review) => {
      return review;
    })
    .catch((error) => {
      console.error("Error fetching review by id:", error);
      throw error;
    });
}

// Return all reviews for a given spot
function getReviewsBySpotId(spotId: string): Promise<Review[]> {
  return ReviewModel.find({ spotId }).populate('userId', 'userid name')
    .exec()
    .then((reviews) => {
      return reviews;
    })
    .catch((error) => {
      console.error("Error fetching reviews by spot id:", error);
      throw error;
    });
}

// Return all reviews by a given user
function getReviewsByUserId(userId: string): Promise<Review[]> {
  // return ReviewModel.find({ userId })
  //   .exec()
  //   .then((reviews) => {
  //     return reviews;
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching reviews by user id:", error);
  //     throw error;
  //   });
  return ReviewModel.find({ userId: new Types.ObjectId(userId) })
    .populate('userId', 'userid name')
    .exec()
    .then((reviews) => reviews)
    .catch((error) => {
      console.error("Error fetching reviews by user id:", error);
      throw error;
    });
}

// Create a new review
function create(reviewData: Review): Promise<Review> {
  const newReview = new ReviewModel(reviewData);

  return newReview
    .save()
    .then((reviewData) => {
      return reviewData;
    })
    .catch((error) => {
      console.error("Error creating review:", error);
      throw error;
    });
}

// Update an existing review
function update(id: string, reviewData: Review): Promise < Review | null > {
  return ReviewModel.findByIdAndUpdate
    (id, reviewData, { new: true })
    .exec()
    .then((review) => {
      return review;
    })
    .catch((error) => {
      console.error("Error updating review:", error);
      throw error;
    });
}

// Delete a review by its ID
function deleteReviewById(id: string): Promise<Review | null> {
  return ReviewModel.findByIdAndDelete(id)
    .exec()
    .then((review) => {
      return review;
    })
    .catch((error) => {
      console.error("Error deleting review by id:", error);
      throw error;
    });
}

export default {
  index,
  getReviewById,
  getReviewsBySpotId,
  getReviewsByUserId,
  create,
  update,
  deleteReviewById
};
