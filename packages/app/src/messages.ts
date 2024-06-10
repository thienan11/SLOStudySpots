import { Profile, Review, StudySpot, Ratings} from "server/models";

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
  | ["study-spot/index"]
  | ["study-spot/add",
    {
      spot: StudySpot;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }]
  | ["study-spot/update",
    {
      spotid: string;
      rating: Ratings;
      reviewsCount: number;
      onSuccess?: () => void,
      onFailure?: (err: Error) => void
    }]
  | ["review/list-by-spot", { spotId: string }]
  | ["review/add",
    {
      review: Review;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }]
  | ["review/list-by-user", { userId: string }]
  | ["review/clear"];