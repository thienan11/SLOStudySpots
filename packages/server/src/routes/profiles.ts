import express, { Request, Response } from "express";
import profiles from "../services/profile-svc";

const router = express.Router();

router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  const got = profiles.get(userid);

  if (got) res.send(got);
  else res.status(404).end();
});

export default router;