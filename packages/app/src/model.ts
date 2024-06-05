import { Profile, StudySpot } from "server/models";

export interface Model {
  profile?: Profile;
  studySpot?: StudySpot;
  studySpotIndex?: StudySpot[];
}

export const init: Model = {};