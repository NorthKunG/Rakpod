import { Request, Response } from "express";
import UserModel from "../models/user.model";
import {
  generateToken,
  comparePassword,
  hashedPassword,
} from "../utils/auth.util";
import * as dotenv from "dotenv";
dotenv.config();

class AuthController {
  registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "The user already exists" });
    }

    const _hashedPassword = await hashedPassword(password);

    const user = await UserModel.create({
      name: name,
      email: email,
      password: _hashedPassword,
    });

    if (user) {
      res.status(201).json({
        message: "Create user successfully",
      });
    } else {
      res
        .status(400)
        .json({ message: "An error occurred in creating the user" });
    }
  };

  authenticateUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user && (await comparePassword(password, user.password))) {
      const token = await generateToken(res, user);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: "User not found / password incorrect" });
    }
  };
}

export default new AuthController();
