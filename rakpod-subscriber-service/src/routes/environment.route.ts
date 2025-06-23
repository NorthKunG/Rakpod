import * as express from "express";
const router = express.Router();

// controllers
import EnvironmentController from "../controllers/environment.controller";

// validator
import EnvironmentValidator from "../middlewares/validators/environment.validator";
import { handleValidator } from "../middlewares/validators/handleValidator";

// utils
import { awaitHandlerFactory } from "../middlewares/awaitHandlerFactory.middleware";

router.get(
  "/weather-station",
  EnvironmentValidator.getEnvironmentOfWeatherStation(),
  handleValidator(),
  awaitHandlerFactory(EnvironmentController.getEnvironmentOfWeatherStation)
);

router.post(
  "/compare",
  // EnvironmentValidator.getEnvironmentCompare(),
  // handleValidator(),
  awaitHandlerFactory(EnvironmentController.getEnvironmentCompare)
);

router.post(
  "/export/:stationid",
  EnvironmentValidator.getExportEnvironmentOfWeatherStation(),
  handleValidator(),
  awaitHandlerFactory(
    EnvironmentController.getExportEnvironmentOfWeatherStation
  )
);

router.post(
  "/export",
  EnvironmentValidator.getExportEnvironmentOfWeatherStation(),
  handleValidator(),
  awaitHandlerFactory(
    EnvironmentController.getExportEnvironmentOfWeatherStationAll
  )
);

router.get(
  "/export/get-file/:filename",
  awaitHandlerFactory(EnvironmentController.getFile)
);

router.get("/image/:name", awaitHandlerFactory(EnvironmentController.getImage));

router.get(
  "/broadcast",
  awaitHandlerFactory(EnvironmentController.sendBroadcast)
);

export default router;
