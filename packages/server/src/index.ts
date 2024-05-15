import express, { Request, Response } from "express";
import profiles from "./routes/profiles";
import auth, { authenticateUser } from "./routes/auth";
import { connect } from "./services/mongo";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("slostudyspots");

app.use(express.static(staticDir));
app.use(express.json()); // JSON parsing middleware

// Auth routes
app.use("/auth", auth);

// Profile routes
app.use("/api/profiles", authenticateUser, profiles);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});