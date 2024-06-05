import { Profile } from "server/models";

export type Msg =
  | [
    "profile/save",
    {
      userid: string;
      profile: Profile;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }
  ]
  | ["profile/select", { userid: string }]
  | ["study-spot/select", { spotid: string }]
  | ["study-spot/index"];