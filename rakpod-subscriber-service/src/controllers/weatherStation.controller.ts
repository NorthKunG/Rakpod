import * as express from "express";

// controllers
import EnvironmentController from "./environment.controller";

// models
import WeatherStationModel from "../models/weatherStation.model";
// import EnvironmentModel from '../models/environment.model';

// prototype
import {
  WeatherStationPrototype,
  WeatherStationPrototypeDB,
} from "../prototypes/weatherStation.prototype";
import HttpException from "../utils/HttpException.utils";

import { removeUndefineKey } from "../utils/removeUndefineKey.utils";
import { provinceCodeTH } from "../province";

const provinceTH: any[] = provinceCodeTH;
class WeatherStationController {
  getWeatherStationSensor = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const sensorList: string[] = [
      "PM1",
      "PM10",
      "PM25",
      "CO",
      "CO2",
      "O3",
      "NO2",
      "SO2",
      "hum",
      "light",
      "rain",
      "temp",
      "windDr",
      "windSp",
      "UV"
    ];
    const sensorListKey: string[] = [
      "pm1_microgram_per_cubicmeter",
      "pm10_microgram_per_cubicmeter",
      "pm25_microgram_per_cubicmeter",
      "CO_ppm",
      "CO2_ppm",
      "O3_ppb",
      "NO2_ppb",
      "SO2_ppb",
      "humidity_percent",
      "light_lux",
      "rain_gauge_mm",
      "temperature_celsius",
      "wind_direction_degree",
      "wind_speed_kmph",
      "UV_watt_per_squaremeter",
    ];
    let weatherStationSensor =
      await WeatherStationModel.mapWstationWithSensor();

    if (!weatherStationSensor.length) {
      throw new HttpException(404, "Weather Station not found");
    }
    var weatherStationArr: Array<any> = [];
    for (let i in sensorList) {
      let wstationList: Array<any> = [];

      for (let j in weatherStationSensor) {
        const wsensor = JSON.parse(weatherStationSensor[j].sensor);
        if (wsensor.includes(sensorList[i])) {
          wstationList.push({
            name: weatherStationSensor[j].name,
            uuid: weatherStationSensor[j].uuid,
            province: weatherStationSensor[j].address_province,
          });
        }
      }
      if (wstationList.length) {
        weatherStationArr.push({
          sensor: sensorList[i],
          sensor_key: sensorListKey[i],
          wstation: wstationList,
        });
      }
    }

    if (!weatherStationArr.length) {
      throw new HttpException(404, "Sensor not found");
    }

    res.status(200).send({
      type: "success",
      status: 200,
      massage: "All Weather Station Sensor",
      results: weatherStationArr.length,
      data: weatherStationArr,
    });
  };

  getAllWeatherStation = async (
    req: express.Request,
    res: express.Response
  ) => {
    const provCode: string = req.params.provinceCode;
    let weatherStationArr: any = [];
    // console.log(provCode)
    if (provCode != undefined) {
      const provinceCode: string = provCode.toUpperCase();
      const found = provinceTH.find(
        (element: any) =>
          element.code == provinceCode || element.province == provinceCode
      );
      if (found) {
        const provinceName = found.province;
        weatherStationArr = await WeatherStationModel.find({
          address_province: provinceName,
        });
      } else {
        weatherStationArr = await WeatherStationModel.find();
      }
    } else {
      // console.log("no province code");
      weatherStationArr = await WeatherStationModel.find();
    }

    let weatherStationArrPrototype: Array<any> = [];
    for (let i in weatherStationArr) {
      // if (
      //   weatherStationArr[i].isDisplay == null ||
      //   !weatherStationArr[i].isDisplay
      // ) {
      //   continue;
      // }
      let weatherStation = new WeatherStationPrototype(weatherStationArr[i]);
      weatherStation.environmentInformation =
        await EnvironmentController.getCurrentEnvironmentOfWeatherStation(
          weatherStationArr[i].id
        );
      weatherStationArrPrototype.push(weatherStation);
    }
    res.status(200).send({
      type: "success",
      status: 200,
      massage: "All Weather Station",
      results: weatherStationArrPrototype.length,
      data: weatherStationArrPrototype,
    });
  };
  getWeatherStationDetail = async (
    req: express.Request,
    res: express.Response
  ) => {
    const stationid: string = req.params.stationid;

    let weatherStationDetail: any = await WeatherStationModel.findOne({
      uuid: stationid,
    });

    // console.log(JSON.parse(weatherStationDetail.sensor))
    var weatherStationDetailPrototype: any;

    if (req.query.datetime) {
      const date = req.query.datetime.toString();

      var weatherStationDetailPrototype: any;
      if (weatherStationDetail) {
        weatherStationDetailPrototype = new WeatherStationPrototype(
          weatherStationDetail
        );
        weatherStationDetailPrototype.environmentInformation =
          await EnvironmentController.getCurrentEnvironmentOfWeatherStationWithDate(
            weatherStationDetail.id,
            date
          );
      }
    } else {
      if (weatherStationDetail) {
        weatherStationDetailPrototype = new WeatherStationPrototype(
          weatherStationDetail
        );
        weatherStationDetailPrototype.environmentInformation =
          await EnvironmentController.getCurrentEnvironmentOfWeatherStation(
            weatherStationDetail.id
          );
      }
    }

    res.status(200).send({
      type: "success",
      status: 200,
      massage: "Weather Station Detail",
      data: weatherStationDetailPrototype,
    });
  };

  createWeatherStation = async (
    req: express.Request,
    res: express.Response
  ) => {
    const body = req.body;
    const weatherStationPrototypeBody = new WeatherStationPrototypeDB(body);
    console.log(weatherStationPrototypeBody)
    let result: any = await WeatherStationModel.create(
      weatherStationPrototypeBody
    );
    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }
    res.status(201).send({
      type: "success",
      status: 201,
      massage: "Weather Station was created",
    });
  };

  updateWeatherStation = async (
    req: express.Request,
    res: express.Response
  ) => {
    const stationid = req.params.stationid;
    const body = req.body;
    const weatherStationPrototypeBody = await removeUndefineKey(
      new WeatherStationPrototypeDB(body)
    );
    // console.log(body, weatherStationPrototypeBody)
    const result = await WeatherStationModel.update(
      weatherStationPrototypeBody,
      stationid
    );
    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Weather Station not found"
      : affectedRows && changedRows
      ? "Weather Station updated successfully"
      : "Updated faild";

    if (message == "Weather Station not found") {
      res.status(404).send({ type: "error", status: 404, message: message });
      return;
    }
    if (message == "Updated faild") {
      res.status(400).send({ type: "error", status: 400, message: message });
      return;
    }

    res
      .status(200)
      .send({ type: "success", status: 200, message: message, info });
  };

  deleteWeatherStation = async (
    req: express.Request,
    res: express.Response
  ) => {
    const stationid = req.params.stationid;
    const result = await WeatherStationModel.delete(stationid);
    if (!result) {
      throw new HttpException(404, "WeatherStation not found");
    }
    res.status(200).send({
      type: "success",
      status: 200,
      massage: "WeatherStation has been deleted",
    });
  };

  getWeatherStationAllPlace = async (stationId: string) => {
    let weatherStationDetail: any = await WeatherStationModel.findOne({
      uuid: stationId,
    });
    // console.log(JSON.parse(weatherStationDetail.sensor))
    var weatherStationDetailPrototype: any;
    if (weatherStationDetail) {
      weatherStationDetailPrototype = new WeatherStationPrototype(
        weatherStationDetail
      );
      weatherStationDetailPrototype.environmentInformation =
        await EnvironmentController.getCurrentEnvironmentOfWeatherStationMQTT(
          weatherStationDetail.id
        );
    }

    return JSON.stringify(weatherStationDetailPrototype);
  };

  getWeatherStation = async (stationId: string) => {
    let weatherStationDetail: any = await WeatherStationModel.findOne({
      uuid: stationId,
    });
    // console.log(JSON.parse(weatherStationDetail.sensor))
    var weatherStationDetailPrototype: any;
    if (weatherStationDetail) {
      weatherStationDetailPrototype = new WeatherStationPrototype(
        weatherStationDetail
      );
    }

    return JSON.stringify(weatherStationDetailPrototype);
  };

  getAllWeatherStationMQTT = async () => {
    let weatherStationArr = await WeatherStationModel.find({
      status: "online",
    });
    return weatherStationArr;
  };

  getAllWeatherStationForMessage = async () => {
    let weatherStationArr = await WeatherStationModel.find();
    return weatherStationArr;
  };
}

export default new WeatherStationController();
