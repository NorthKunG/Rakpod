import * as express from "express";
import AuthController from "../controllers/auth.controller";
import { awaitHandlerFactory } from "../middlewares/awaitHandlerFactory.middleware";
const router = express.Router();

router.post("/register", awaitHandlerFactory(AuthController.registerUser));
router.post("/login", awaitHandlerFactory(AuthController.authenticateUser));

export default router;
