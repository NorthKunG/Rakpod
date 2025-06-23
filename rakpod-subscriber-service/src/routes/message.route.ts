import * as express from "express";
import { awaitHandlerFactory } from "../middlewares/awaitHandlerFactory.middleware";
import MessageController from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";
const router = express.Router();

router.get(
  "/",
  authenticate,
  awaitHandlerFactory(MessageController.getAllMessage)
);
router.get(
  "/station",
  authenticate,
  awaitHandlerFactory(MessageController.getAllStation)
);
router.post("/",authenticate, awaitHandlerFactory(MessageController.createMessage));

export default router;
