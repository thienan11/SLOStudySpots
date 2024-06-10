import express, { Request, Response } from "express";
import studySpots from "../services/study-spot-svc";
import { StudySpot } from "../models/study-spot";

const router = express.Router();


// GET route (get all)
router.get("/", (req: Request, res: Response) => {
  studySpots
    .index()
    .then((list: StudySpot[]) =>
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

  studySpots
    .getStudySpotbyId(id)
    .then((studySpot) => {
      if (studySpot) {
        res.json(studySpot);
      } else {
        res.status(404).send("Study spot not found!");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// POST route
router.post("/", (req: Request, res: Response) => {
  const newStudySpot = req.body;

  studySpots
    .create(newStudySpot)
    .then((studySpot: StudySpot) => {
      res.status(201).send(studySpot); // use .json() instead?
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// PUT route
router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedStudySpot = req.body;

  studySpots
    .update(id, updatedStudySpot)
    .then((studySpot) => {
      if (studySpot) {
        res.json(studySpot);
      } else {
        res.status(404).send("Study spot not found!");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

export default router;