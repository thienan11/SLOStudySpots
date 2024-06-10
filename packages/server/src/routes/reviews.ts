import express, { Request, Response } from "express";
import reviews from "../services/review-svc";
import { Review } from "../models/review";

const router = express.Router();

// GET route (get all)
router.get("/", (req: Request, res: Response) => {
  reviews
    .index()
    .then((list: Review[]) =>
      res.status(200).send({
        count: list.length,
        data: list
      })
    )
    .catch((err) => res.status(500).send(err));
});

// GET route (get by id)
router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  reviews
    .getReviewById(id)
    .then((review) => {
      if (review) {
        res.json(review);
      } else {
        res.status(404).send("Review not found!");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// POST route
router.post("/", (req: Request, res: Response) => {
  const newReview = req.body;

  reviews
    .create(newReview)
    .then((review: Review) => {
      res.status(201).send(review); // use .json() instead?
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// PUT route
router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedReview = req.body;

  reviews
    .update(id, updatedReview)
    .then((review) => {
      if (review) {
        res.json(review);
      } else {
        res.status(404).send("Review not found!");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// GET route (get by spot id)
router.get("/spot/:spotid", (req: Request, res: Response) => {
  const spotId = req.params.spotid;

  reviews
    .getReviewsBySpotId(spotId)
    .then((reviews) => {
      if (reviews.length > 0) {
        res.json(reviews);
      } else {
        res.status(404).send("No reviews found for this study spot.");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

// GET route (get by user id)
router.get("/user/:userid", (req: Request, res: Response) => {
  const userId = req.params.userid;

  reviews
    .getReviewsByUserId(userId)
    .then((reviews) => {
      if (reviews) {
        res.json(reviews);
      } else {
        res.status(404).send("No reviews found for this user!");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// DELETE route
router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  reviews
    .deleteReviewById(id)
    .then((review) => {
      if (review) {
        res.status(200).send({ message: "Review deleted successfully" });
      } else {
        res.status(404).send("Review not found!");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

export default router;