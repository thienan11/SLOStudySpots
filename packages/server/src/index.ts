import express, { Request, Response } from "express";
import profiles from "./routes/profiles";
import studySpots from "./routes/study-spots";
import auth, { authenticateUser } from "./routes/auth";
import { connect } from "./services/mongo";
import path from "path";

// MongoDB connection
connect("slostudyspots");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express.static(staticDir));

// JSON parsing middleware
app.use(express.json());

// Serve NPM packages
const nodeModules = path.resolve(
  __dirname,
  "../../../node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", express.static(nodeModules));

// Auth routes
app.use("/auth", auth);

// Profile routes
app.use("/api/profiles", authenticateUser, profiles);

// Study Spot routes
app.use("/study-spots", studySpots);

// Hello, World route
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});