import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

interface JwtPayload {
  username: string;
}

// Middleware to authorize access to a profile based on the JWT token 
// Prevent unauthorized access to other users' profiles
function authorizeProfileAccess(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send("Unauthorized: Invalid token");
    }

    const payload = decoded as JwtPayload;
    const username = payload.username;
    const profileUserId = req.params.userid;

    if (username !== profileUserId) {
      return res.status(403).send("Forbidden: Access denied");
    }

    next();
  });
}

export default authorizeProfileAccess;
