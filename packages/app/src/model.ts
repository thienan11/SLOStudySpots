import { Profile, StudySpot, Review} from "server/models";

export interface Model {
  profile?: Profile;
  studySpot?: StudySpot;
  studySpotIndex?: StudySpot[];
  reviews?: Review[];
  review?: Review;
}

export const init: Model = {};