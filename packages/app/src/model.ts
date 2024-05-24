import { Profile } from "server/models";

export interface Model {
  profile?: Profile;
}

export const init: Model = {};