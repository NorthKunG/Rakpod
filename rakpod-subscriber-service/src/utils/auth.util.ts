import jwt from "jsonwebtoken";
import { Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
const bcrypt = require("bcryptjs");

const generateToken = (res: Response, user: any) => {
  const jwtSecret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ userId: user.id, uuid: user.uuid }, jwtSecret, {
    expiresIn: "4h",
  });

  return token;
};

async function hashedPassword(plainPassword: String) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  return hashedPassword;
}

async function comparePassword(
  enteredPassword: String,
  storedHashedPassword: String
) {
  return await bcrypt.compare(enteredPassword, storedHashedPassword);
}

export { generateToken, hashedPassword, comparePassword };
