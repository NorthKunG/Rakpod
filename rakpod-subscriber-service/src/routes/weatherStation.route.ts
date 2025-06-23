import * as express from 'express';
const router = express.Router();

// controllers 
import WeatherStationContoller from '../controllers/weatherStation.controller';

// validators
import StationValidator from '../middlewares/validators/station.validator'
import { handleValidator } from '../middlewares/validators/handleValidator';

// utils
import { awaitHandlerFactory } from '../middlewares/awaitHandlerFactory.middleware';

router.get('/',
    awaitHandlerFactory(WeatherStationContoller.getAllWeatherStation)
);

router.get('/province/:provinceCode',
    awaitHandlerFactory(WeatherStationContoller.getAllWeatherStation)
);

router.get('/id/:stationid',
    awaitHandlerFactory(WeatherStationContoller.getWeatherStationDetail)
)

router.get('/sensor',
    awaitHandlerFactory(WeatherStationContoller.getWeatherStationSensor)
)

router.post('/',
    StationValidator.create(),
    handleValidator(),
    awaitHandlerFactory(WeatherStationContoller.createWeatherStation)
)

router.put('/id/:stationid',
    StationValidator.update(),
    handleValidator(),
    awaitHandlerFactory(WeatherStationContoller.updateWeatherStation)
);

router.delete('/id/:stationid',
    StationValidator.delete(),
    handleValidator(),
    awaitHandlerFactory(WeatherStationContoller.deleteWeatherStation)
);

export default router;