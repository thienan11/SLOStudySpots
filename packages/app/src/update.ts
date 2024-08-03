import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import {
  Profile,
  StudySpot,
  Review,
  Ratings
} from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "profile/save":
      saveProfile(message[1], user)
        .then((profile) =>
          apply((model) => ({ ...model, profile }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "profile/select":
      selectProfile(message[1], user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
    case "study-spot/index":
      indexStudySpots().then((studySpotIndex: StudySpot[] | undefined) =>
        apply((model) => ({ ...model, studySpotIndex }))
      ).catch(error => {
        console.error("Failed to fetch study spots", error);
      });
      break;
    case "study-spot/select":
      selectStudySpot(message[1]).then((studySpot: StudySpot | undefined) =>
        apply((model) => ({ ...model, studySpot }))
      );
      break;
    case "study-spot/add":
      addStudySpot(message[1], user)
        .then((spot) =>
          apply((model) => ({ ...model, studySpot: spot }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "study-spot/update":
      updateStudySpot({
        spotid: message[1].spotid,
        ratings: message[1].rating,
        reviewsCount: message[1].reviewsCount
      }, user)
        .then((spot) =>
          apply((model) => ({ ...model, studySpot: spot }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "review/list-by-spot":
      listReviewsBySpot(message[1].spotId).then((reviews: Review[]) =>
        apply((model) => ({ ...model, reviews }))
      );
      break;
    case "review/list-by-user":
      listReviewsByUser(message[1].userId).then((reviews: Review[]) =>
        apply((model) => ({ ...model, reviews }))
      );
      break;
    case "review/add":
      addReview(message[1], user)
        .then((review) => {
          if (review) {
            apply((model) => ({ ...model, reviews: [...(model.reviews ?? []), review] }));
          }
        })
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "review/delete":
      deleteReview(message[1].reviewId)
      .then(() => {
        apply((model) => ({
          ...model,
          reviews: model.reviews?.filter(review => (review as Review & { _id: string })._id !== message[1].reviewId)
        }));
      })
      .then(() => {
        const { onSuccess } = message[1];
        if (onSuccess) onSuccess();
      })
      .catch((error: Error) => {
        const { onFailure } = message[1];
        if (onFailure) onFailure(error);
      });
      break;
    case "review/update":
      updateReview(message[1].review, user)
        .then((updatedReview) => {
          if (updatedReview) {
            apply((model) => ({
              ...model,
              reviews: model.reviews?.map(r =>
                (r as Review & { _id: string })._id === (updatedReview as Review & { _id: string })._id ? updatedReview : r)
            }));
          }
        })
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "review/select":
      selectReview(message[1]).then((review: Review | undefined) =>
        apply((model) => ({ ...model, review }))
      );
      break;
    case "review/clear":
      apply(model => ({ ...model, reviews: [] }));
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}

function saveProfile(
  msg: {
    userid: string;
    profile: Profile;
  },
  user: Auth.User
) {
  return fetch(`/api/profiles/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.profile)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else
        throw new Error(
          `Failed to save profile for ${msg.userid}`
        );
    })
    .then((json: unknown) => {
      if (json) return json as Profile;
      return undefined;
    });
}

function selectProfile(
  msg: { userid: string },
  user: Auth.User
) {
  return fetch(`/api/profiles/${msg.userid}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Profile:", json);
        return json as Profile;
      }
    });
}

function indexStudySpots() {
  return fetch("/study-spots", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw undefined;
    })
    .then((json: unknown) => {
      if (json) {
        // console.log("Study Spots:", json);
        // return json as StudySpot[];

        const { data } = json as {
          data: StudySpot[];
        };
        return data;
      }
    })
}

function selectStudySpot(
  msg: { spotid: string }
) {
  return fetch(`/study-spots/${msg.spotid}`, {
    method: "GET"
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Study Spot:", json);
        return json as StudySpot;
      }
  });
}

function addStudySpot(
  msg: {
    spot: StudySpot;
  },
  user: Auth.User
) {
  return fetch("/study-spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.spot)
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      else
        throw new Error(
          `Failed to add study spot`
        );
    })
    .then((json: unknown) => {
      if (json) return json as StudySpot;
      return undefined;
    });
}

function updateStudySpot(
  msg: {
    spotid: string;
    ratings: Ratings;
    reviewsCount: number;
  },
  user: Auth.User
) {
  return fetch(`/study-spots/${msg.spotid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify({
      ratings: msg.ratings,
      reviewsCount: msg.reviewsCount
    })
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else
        throw new Error(
          `Failed to update study spot ${msg.spotid}`
        );
    })
    .then((json: unknown) => {
      if (json) return json as StudySpot;
      return undefined;
    });
}

function listReviewsBySpot(spotId: string) {
  return fetch(`/reviews/spot/${spotId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response: Response) => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      // Handle 404 specifically for the case where no reviews are found
      console.log(`No reviews found for study spot ${spotId}`);
      return []; // Return an empty array to indicate no reviews
    } else {
      // For other statuses, throw an error to be caught by the catch block
      throw new Error(`Failed to fetch reviews for study spot ${spotId}. Status: ${response.status}`);
    }
  })
  .then((json: unknown) => {
    if (json) {
      return json as Review[]; // Assume json is always an array (empty or filled with reviews)
    }
    return [];
  })
  .catch((error: Error) => {
    console.error(error.message);
    throw error;  // Rethrow the error to allow for handling or logging at a higher level
  });
}

function addReview(
  msg: {
    review: Review;
  },
  user: Auth.User
) {
  return fetch("/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.review)
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      else
        throw new Error(
          `Failed to add review`
        );
    })
    .then((json: unknown) => {
      if (json) return json as Review;
      return undefined;
    });
}

function deleteReview(reviewId: string) {
  return fetch(`/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response: Response) => {
    if (response.status === 204) {
      return;
    } else if (response.status === 404) {
      // Handle 404 specifically for the case where the review is not found
      console.log(`Review ${reviewId} not found`);
    } else {
      // For other statuses, throw an error
      throw new Error(`Failed to delete review ${reviewId}`);
    }
  });
}

function updateReview(
  review: Review,
  user: Auth.User
) {
  return fetch(`/reviews/${(review as Review & { _id: string })._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(review)
  })
  .then((response: Response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`Failed to update review ${(review as Review & { _id: string })._id}`);
    }
  })
  .then((json: unknown) => {
    if (json) {
      return json as Review;
    }
    return undefined;
  });
}

function selectReview(
  msg: { reviewId: string }
) {
  return fetch(`/reviews/${msg.reviewId}`, {
    method: "GET"
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Review Found:", json);
        return json as Review;
      }
  });
}

function listReviewsByUser(userId: string) {
  return fetch(`/reviews/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to fetch reviews for user ${userId}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Review[];
      }
      return [];
    });
}