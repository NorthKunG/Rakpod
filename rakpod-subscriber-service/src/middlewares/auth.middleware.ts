import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user.model";
import asyncHandler from "express-async-handler";
import * as dotenv from "dotenv";
dotenv.config();

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;

      // Check for the Authorization header and extract the token
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1]; // Extract the token part after "Bearer"
      }

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, token not found");
      }

      const jwtSecret = process.env.JWT_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded || !decoded.uuid) {
        res.status(401);
        throw new Error("Not authorized, userId not found");
      }

      const user = await UserModel.findOne({ uuid: decoded.uuid });

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      req.user = user; // Attach user to the request object
      next();
    } catch (e) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }
);
