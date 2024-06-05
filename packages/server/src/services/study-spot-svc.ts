import { Schema, Model, Document, model } from "mongoose";
import { StudySpot } from "../models/study-spot";

const StudySpotSchema = new Schema<StudySpot>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    locationType: { type: String, required: true },
    hoursOfOperation: 
    {
      type: [
        {
          startDay: { type: String, required: true },
          endDay: { type: String, required: true },
          open: { type: Number, required: true, min: 0, max: 1440 },  // Time in minutes from midnight
          close: { type: Number, required: true, min: 0, max: 1440 },  // Time in minutes from midnight
          isOpen24Hours: { type: Boolean, default: false },
          isClosed: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    ratings: {
      overall: { type: Number, default: 0, min: 0, max: 5},
      quietness: { type: Number, default: 0, min: 0, max: 5 },
      wifiQuality: { type: Number, default: 0, min: 0, max: 5},
      crowdedness: { type: Number, default: 0, min: 0, max: 5},
      powerOutlets: { type: Number, default: 0, min: 0, max: 5},
      amenities: { type: Number, default: 0, min: 0, max: 5},
    },
    tags: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    link: { type: String, default: null },
    createdBy: { type: String, required: true }
  },
  { collection: "study_spots" }
);

const StudySpotModel = model<StudySpot>("StudySpot", StudySpotSchema);

function getStudySpotbyId(id: string): Promise<StudySpot | null> {
  return StudySpotModel.findById(id)
    .exec()
    .then((studySpot) => {
      return studySpot;
    })
    .catch((error) => {
      console.error("Error fetching study spot by id:", error);
      throw error;
    });
}

function create(studySpotData: StudySpot): Promise<StudySpot> {
  const newStudySpot = new StudySpotModel(studySpotData);

  return newStudySpot
    .save()
    .then((studySpotData) => {
      return studySpotData;
    })
    .catch((error) => {
      console.error("Error creating study spot:", error);
      throw error;
    });
}

async function getStudySpotsByTag(tag: string): Promise<StudySpot[]> {
  try {
    // Find study spots that contain the provided tag in their 'tags' array
    const spots = await StudySpotModel.find({ tags: tag }).exec();
    return spots;
  } catch (error) {
    console.error("Error fetching study spot by tag:", error);
    throw error;
  }
}

// get study spots in user's favorite list
async function getFavoriteStudySpots(
  favoriteStudySpotIds: string[]
): Promise<StudySpot[]> {
  try {
    // Find study spots that have ids in the provided array
    const spots = await StudySpotModel.find({
      _id: { $in: favoriteStudySpotIds },
    }).exec();
    return spots;
  } catch (error) {
    console.error("Error fetching favorite study spots:", error);
    throw error;
  }
}

export default { getStudySpotbyId, create, getStudySpotsByTag, getFavoriteStudySpots };