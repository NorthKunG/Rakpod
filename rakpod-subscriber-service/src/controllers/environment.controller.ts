import * as express from "express";
import moment from "moment";
import cron from "node-cron";
import path from "path";
import fs from "fs";

// models
import WeatherStationModel from "../models/weatherStation.model";
import EnvironmentModel from "../models/environment.model";

// prototype
import { EnvironmentPrototype } from "../prototypes/environment.prototype";
import {
  WeatherStationPrototype,
  WeatherStationPrototypeDB,
} from "../prototypes/weatherStation.prototype";

// utils
import HttpException from "../utils/HttpException.utils";
import { ExportData } from "../utils/export.utils";
import { ExportDataV2 } from "../utils/export.v2.utils";
import { downloadImage } from "../utils/image.utils";
import { card } from "../utils/line/template";
import { SendBroadcast } from "../utils/line.broadcast.utils";

const export_path: string = !process.env.EXPORT_PATH
  ? ""
  : process.env.EXPORT_PATH;
const exp_time: number = 1;
interface valueRange {
  level: number;
  aqi: Array<any>;
  PM25: Array<any>;
  PM10: Array<any>;
  O3: Array<any>;
  CO: Array<any>;
  NO2: Array<any>;
  SO2: Array<any>;
}
interface environmentInformation {
  datetime?: string;
  aqi?: any;
  temp?: any;
  hum?: any;
  PM1?: any;
  CO2?: any;
  windDr?: any;
  windSp?: any;
  rain?: any;
  light?: any;
  UV?: any;
}
class EnvironmentController {
  constructor() {
    this.cronAutoDeleteExportFile(exp_time);
  }

  cronAutoDeleteExportFile = async (time_to_del: number) => {
    console.log("set cronjob running a task every first minute");
    cron.schedule(`${time_to_del} * * * *`, async () => {
      await this.delFile();
    });
  };
  getEnvironmentOfWeatherStation = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let stationid = req.query.stationid;
    // console.log(stationid)
    let weatherStation = await WeatherStationModel.findOne({ uuid: stationid });
    if (!weatherStation) {
      throw new HttpException(404, "Weather Station not found");
    }
    var dateArr: Array<any> = [];
    var environmentArr: Array<any> = [];
    var environmentPrototypeArr: Array<any> = [];
    const today = moment(new Date()).format("YYYY-MM-DD HH:00:00");
    if (req.query.date) {
      const date = req.query.date.toString();
      environmentArr = await EnvironmentModel.findWeatherStationByOneDate(
        date,
        weatherStation.id
      );
      // console.log(environmentArr.length)

      for (let i = 0; i <= 23; i++) {
        var dateSetHour = moment(new Date(date).setHours(i)).format(
          "YYYY-MM-DD HH:mm:SS"
        );
        let environment = environmentArr.find((row) => {
          if (row.datetime == dateSetHour) return true;
        });
        if (!environment) {
          environment = {};
          environment.datetime = dateSetHour;
        }
        if (moment(dateSetHour).isSameOrAfter(today)) {
          continue;
        }
        environmentPrototypeArr.push(new EnvironmentPrototype(environment));
      }
      // console.log(environmentPrototypeArr.length)
    } else if (req.query.last && req.query.lastType) {
      const last = req.query.last;
      const lasttype = req.query.lastType;
      req.query = {
        stationid,
        last,
        lasttype,
      };
      switch (lasttype) {
        case "days":
          const xdays = +last;
          for (let i = xdays; i >= 1; i--) {
            const date = new Date();
            let dateBefore = moment(date.setDate(date.getDate() - i)).format(
              "YYYY-MM-DD"
            );
            dateArr.push(dateBefore);
          }
          if (!dateArr.length && xdays === 0) {
            const date = new Date();
            dateArr.push(
              moment(date.setDate(date.getDate())).format("YYYY-MM-DD")
            );
          }
          if (xdays === 0) {
            environmentArr = await EnvironmentModel.findWeatherStationByLastNow(
              xdays,
              weatherStation.id,
              "days"
            );
          } else {
            environmentArr = await EnvironmentModel.findWeatherStationByLastX(
              xdays,
              weatherStation.id,
              "days"
            );
          }
          // console.log(environmentArr)
          for (let j in dateArr) {
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateArr[j]) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateArr[j];
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
          }
          break;
        case "months":
          const xmonths = +last;
          for (let i = xmonths; i >= 1; i--) {
            const date = new Date();
            //  default getMonth 0 - 11
            const month = date.getMonth() + 1 - i;
            // console.log(month);
            const dateSetMonth = date.setMonth(month);
            const currentMonth = new Date(dateSetMonth).getMonth();
            const year = new Date(dateSetMonth).getFullYear();
            const daysInMonth = this.daysInMonth(month, year);
            // console.log(currentMonth, year);
            // console.log(daysInMonth);
            for (let j = 1; j <= daysInMonth; j++) {
              // console.log(j)
              const monthIndex = currentMonth - 1;
              let dateBefore = moment(new Date(year, monthIndex, j)).format(
                "YYYY-MM-DD"
              );
              dateArr.push(dateBefore);
            }
          }
          if (!dateArr.length && xmonths === 0) {
            const date = new Date();
            //  default getMonth 0 - 11
            const month = date.getMonth();
            // console.log(month);
            const dateSetMonth = date.setMonth(month);
            const currentMonth = new Date(dateSetMonth).getMonth();
            const year = new Date(dateSetMonth).getFullYear();
            const daysInMonth = this.daysInMonth(month, year);
            for (let j = 1; j <= daysInMonth; j++) {
              // console.log(j)
              if (j > date.getDate()) {
                break;
              }
              const monthIndex = currentMonth;
              let dateBefore = moment(new Date(year, monthIndex, j)).format(
                "YYYY-MM-DD"
              );
              dateArr.push(dateBefore);
            }
          }
          if (xmonths === 0) {
            environmentArr = await EnvironmentModel.findWeatherStationByLastNow(
              xmonths,
              weatherStation.id,
              "months"
            );
          } else {
            environmentArr = await EnvironmentModel.findWeatherStationByLastX(
              xmonths,
              weatherStation.id,
              "months"
            );
          }
          for (let j in dateArr) {
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateArr[j]) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateArr[j];
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
          }
          break;
        default:
          console.log("Invalid Last Type");
      }
      // environmentArr = await EnvironmentModel.find();
      // environmentArr = await EnvironmentModel.find();
    } else if (req.query.last && req.query.lastType) {
      const last = req.query.last;
      const lasttype = req.query.lastType;
      req.query = {
        stationid,
        last,
        lasttype,
      };
      switch (lasttype) {
        case "days":
          const xdays = +last;
          for (let i = xdays; i >= 1; i--) {
            const date = new Date();
            let dateBefore = moment(date.setDate(date.getDate() - i)).format(
              "YYYY-MM-DD"
            );
            dateArr.push(dateBefore);
          }
          if (!dateArr.length && xdays === 0) {
            const date = new Date();
            dateArr.push(
              moment(date.setDate(date.getDate())).format("YYYY-MM-DD")
            );
          }
          if (xdays === 0) {
            environmentArr = await EnvironmentModel.findWeatherStationByLastNow(
              xdays,
              weatherStation.id,
              "days"
            );
          } else {
            environmentArr = await EnvironmentModel.findWeatherStationByLastX(
              xdays,
              weatherStation.id,
              "days"
            );
          }
          // console.log(environmentArr)
          for (let j in dateArr) {
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateArr[j]) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateArr[j];
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
          }
          break;
        case "months":
          const xmonths = +last;
          for (let i = xmonths; i >= 1; i--) {
            const date = new Date();
            //  default getMonth 0 - 11
            const month = date.getMonth() + 1 - i;
            // console.log(month);
            const dateSetMonth = date.setMonth(month);
            const currentMonth = new Date(dateSetMonth).getMonth();
            const year = new Date(dateSetMonth).getFullYear();
            const daysInMonth = this.daysInMonth(month, year);
            // console.log(currentMonth, year);
            // console.log(daysInMonth);
            for (let j = 1; j <= daysInMonth; j++) {
              // console.log(j)
              const monthIndex = currentMonth - 1;
              let dateBefore = moment(new Date(year, monthIndex, j)).format(
                "YYYY-MM-DD"
              );
              dateArr.push(dateBefore);
            }
          }
          if (!dateArr.length && xmonths === 0) {
            const date = new Date();
            //  default getMonth 0 - 11
            const month = date.getMonth();
            // console.log(month);
            const dateSetMonth = date.setMonth(month);
            const currentMonth = new Date(dateSetMonth).getMonth();
            const year = new Date(dateSetMonth).getFullYear();
            const daysInMonth = this.daysInMonth(month, year);
            for (let j = 1; j <= daysInMonth; j++) {
              // console.log(j)
              if (j > date.getDate()) {
                break;
              }
              const monthIndex = currentMonth;
              let dateBefore = moment(new Date(year, monthIndex, j)).format(
                "YYYY-MM-DD"
              );
              dateArr.push(dateBefore);
            }
          }
          if (xmonths === 0) {
            environmentArr = await EnvironmentModel.findWeatherStationByLastNow(
              xmonths,
              weatherStation.id,
              "months"
            );
          } else {
            environmentArr = await EnvironmentModel.findWeatherStationByLastX(
              xmonths,
              weatherStation.id,
              "months"
            );
          }
          for (let j in dateArr) {
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateArr[j]) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateArr[j];
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
          }
          break;
        default:
          console.log("Invalid Last Type");
      }
      // environmentArr = await EnvironmentModel.find();
      // environmentArr = await EnvironmentModel.find();
    } else {
      throw new HttpException(400, "Invalid Option");
    }
    // else if (req.query.from && req.query.to) {
    //     const from = req.query.from
    //     const to = req.query.to
    //     req.query = {
    //         stationid,
    //         from,
    //         to
    //     }
    // }
    for (let i in environmentPrototypeArr) {
      const aqiInformation = await this.calculateAQI(
        environmentPrototypeArr[i]
      );
      environmentPrototypeArr[i].aqi = aqiInformation;
    }
    res.status(200).send({
      type: "success",
      parameters: req.query,
      status: 200,
      massage: "All Environment Custom type",
      // results: weatherStationArrPrototype.length,
      data: environmentPrototypeArr,
    });
  };

  getEnvironmentCompare = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const _wstationlist = req.body.stationlist;
    const wstationlist: string[] = JSON.parse(JSON.stringify(_wstationlist));
    let wstation_list: Array<any> = [];
    let wsIdList: string[] = [];
    var environmentArr: Array<any> = [];

    const qdate = req.query.date;
    const qfrom = req.query.from;
    const qto = req.query.to;

    for (let i in wstationlist) {
      let weatherStation = await WeatherStationModel.findOne({
        uuid: wstationlist[i],
      });
      if (!weatherStation) {
        throw new HttpException(404, "Weather Station not found");
      }

      const sensorKey: string = JSON.parse(JSON.stringify(req.body.sensor));
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

      var environmentCompareArr: Array<any> = [];

      if (!sensorListKey.includes(sensorKey)) {
        throw new HttpException(404, "Sensor key not found");
      }

      const today = moment(new Date()).format("YYYY-MM-DD HH:00:00");
      if (qdate) {
        const date = qdate.toString();
        req.query = {
          sensorKey,
          wstationlist,
          date,
        };
        let environmentArr =
          await EnvironmentModel.findCompareEnvironmentByDate(
            sensorKey,
            date,
            weatherStation.id
          );

        for (let i = 0; i <= 23; i++) {
          var dateSetHour = moment(new Date(date).setHours(i)).format(
            "YYYY-MM-DD HH:mm:SS"
          );
          let environment: any = {};
          let _environment = environmentArr.filter((row: any) => {
            if (row.datetime == dateSetHour) return true;
          });

          for (let j in _environment) {
            environment.datetime = dateSetHour;
            environment["weather_station_id"] = _environment[j].station_id;
            environment["weather_station_uuid"] = weatherStation.uuid;
            environment["weather_station_name"] = weatherStation.name;
            environment["sensor"] = !_environment[j].sensor
              ? 0
              : Math.round(_environment[j].sensor * 100) / 100;
          }

          if (!environment) {
            environment = {};
            environment.datetime = dateSetHour;
          }
          if (moment(dateSetHour).isSameOrAfter(today)) {
            break;
          }
          environmentCompareArr.push(environment);
        }
        // console.log(environmentPrototypeArr.length)
      } else if (qfrom && qto) {
        const begindate = qfrom.toString();
        const enddate = qto.toString();
        req.query = {
          sensorKey,
          wstationlist,
          begindate,
          enddate,
        };

        const e_date = moment(enddate).format("YYYY-MM-DD");
        let running_date = moment(begindate).format("YYYY-MM-DD");
        while (moment(running_date).isSameOrBefore(e_date)) {
          let environmentDateArr =
            await EnvironmentModel.findCompareEnvironmentByDate(
              sensorKey,
              running_date,
              weatherStation.id
            );

          for (let i = 0; i <= 23; i++) {
            var dateSetHour = moment(new Date(running_date).setHours(i)).format(
              "YYYY-MM-DD HH:mm:SS"
            );
            let environment: any = {};
            let _environment = environmentDateArr.filter((row: any) => {
              if (row.datetime == dateSetHour) return true;
            });

            for (let j in _environment) {
              environment.datetime = dateSetHour;
              environment["weather_station_id"] = _environment[j].station_id;
              environment["weather_station_uuid"] = weatherStation.uuid;
              environment["weather_station_name"] = weatherStation.name;
              environment["sensor"] = !_environment[j].sensor
                ? 0
                : Math.round(_environment[j].sensor * 100) / 100;
            }

            if (!environment) {
              environment = {};
              environment.datetime = dateSetHour;
            }
            if (moment(dateSetHour).isSameOrAfter(today)) {
              continue;
            }

            environmentCompareArr.push(environment);

            // console.log(environmentPrototypeArr.length)
          }
          running_date = moment(new Date(running_date))
            .add(1, "days")
            .format("YYYY-MM-DD");
        }
      } else {
        throw new HttpException(400, "Invalid Option");
      }
      environmentArr.push({
        sensor: sensorKey,
        weather_station_name: weatherStation.name,
        data: environmentCompareArr,
      });
    }

    res.status(200).send({
      type: "success",
      parameters: req.query,
      status: 200,
      massage: "All Environment Compare",
      // results: weatherStationArrPrototype.length,
      data: environmentArr,
    });
  };

  cleanDirectory = async (directory: string) => {
    try {
      await fs.promises
        .readdir(directory)
        .then((files) =>
          Promise.all(
            files.map((file) => fs.promises.unlink(`${directory}/${file}`))
          )
        );
    } catch (err) {
      console.log(err);
    }
  };

  delFile = async () => {
    const directoryPath = path.join(__dirname, `../../${export_path}`);
    this.cleanDirectory(directoryPath).then((e) => {
      console.log("Clear Export Directory : ", e);
    });
  };
  isFileExist = (fileName: string) => {
    const directoryPath = path.join(
      __dirname,
      `../../${export_path}/${fileName}.xlsx`
    );
    return fs.existsSync(directoryPath);
  };

  getFile = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const directoryPath = path.join(
      __dirname,
      `../../${export_path}/${req.params.filename}.xlsx`
    );
    if (fs.existsSync(directoryPath)) {
      //file exists
      res.sendFile(path.join(directoryPath));
    } else {
      res.status(404).send({
        type: "error",
        status: 404,
        message: "File not found",
      });
    }
  };

  getExportEnvironmentOfWeatherStation = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let stationid = req.params.stationid;
    // console.log(stationid)
    let weatherStation = await WeatherStationModel.findOne({ uuid: stationid });
    if (!weatherStation) {
      throw new HttpException(404, "Weather Station not found");
    }
    const chk_type = ["hourly", "daily", "minutely"];
    let sameDayMinutely: boolean = false;
    let filename = `envy_ws${weatherStation.id}_`;
    var dateArr: Array<any> = [];
    var environmentArr: Array<any> = [];
    var environmentPrototypeArr: Array<any> = [];
    const today = moment(new Date()).format("YYYY-MM-DD HH:00:00");
    const strDate = moment(new Date()).format("YYYYMMDD");
    const _type: string = !req.query.type
      ? "hourly"
      : req.query.type.toString();
    const type = chk_type.includes(_type) ? _type : "hourly";
    const isavg = !req.query.AQI ? false : true;
    console.log(`type : ${type} , AQI : ${isavg}`);
    if (req.query.date) {
      const date = req.query.date.toString();
      const dateString: string = moment(new Date(date)).format("YYYYMMDD");
      filename += dateString;
      req.query = {
        stationid,
        date,
      };
      if (type == "daily") {
        throw new HttpException(400, "Invalid Option");
      }

      if (type == "minutely") {
        if (isavg) {
          throw new HttpException(400, "Invalid Option");
        }
        let checkFile: string = "";
        if (strDate === dateString) {
          // ! request file in today
          sameDayMinutely = true;
          checkFile = `${filename}_${type}_req${strDate}_NC${moment(
            new Date()
          ).format("HH")}`;
        } else {
          // ! request old file
          checkFile = `${filename}_${type}_req${strDate}`;
        }
        // ! check if file exist
        if (this.isFileExist(checkFile)) {
          console.log("old file found", checkFile);
          res.status(201).send({
            type: "success",
            parameters: req.query,
            status: 201,
            massage: "Export All Environment Custom type",
            // results: weatherStationArrPrototype.length,
            data: {
              path: `/environment/export/get-file/${checkFile}`,
            },
          });
        } else {
          console.log("old file not found", checkFile);
        }

        // 10 minute
        environmentArr =
          await EnvironmentModel.findWeatherStationByDateMinutely(
            date,
            weatherStation.id
          );
        // console.log(environmentArr.length)
        for (let i = 0; i <= 23; i++) {
          let step = 0;
          while (step < 60) {
            var dateSetHour = moment(new Date(date).setHours(i, step)).format(
              "YYYY-MM-DD HH:mm:00"
            );
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateSetHour) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateSetHour;
            }
            if (moment(dateSetHour).isSameOrAfter(today)) {
              break;
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
            step += 10;
          }
        }

        // console.log(environmentPrototypeArr.length)
      } else {
        if (isavg) {
          for (let i = 0; i <= 23; i++) {
            var dateSetHour = moment(new Date(date).setHours(i)).format(
              "YYYY-MM-DD HH:00:00"
            );
            let environment = await EnvironmentModel.findAqiDataInHourly(
              weatherStation.id,
              dateSetHour
            );

            if (!environment || environment == undefined) {
              environment = {};
              environment.datetime = dateSetHour;
            }
            if (moment(dateSetHour).isAfter(today)) {
              break;
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
          }
        } else {
          environmentArr = await EnvironmentModel.findWeatherStationByOneDate(
            date,
            weatherStation.id
          );
          // console.log(environmentArr.length)

          for (let i = 0; i <= 23; i++) {
            var dateSetHour = moment(new Date(date).setHours(i)).format(
              "YYYY-MM-DD HH:00:00"
            );
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateSetHour) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateSetHour;
            }
            if (moment(dateSetHour).isSameOrAfter(today)) {
              break;
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));
          }
          // console.log(environmentPrototypeArr.length)
        }
      }
    } else if (req.query.from && req.query.to) {
      const begindate = req.query.from.toString();
      const enddate = req.query.to.toString();
      req.query = {
        stationid,
        begindate,
        enddate,
      };
      filename += `${moment(begindate).format("YYYYMMDD")}to${moment(
        enddate
      ).format("YYYYMMDD")}`;
      if (type == "minutely") {
        throw new HttpException(400, "Invalid Option");
        // ! ttttttttttttttttttttttttttttttttttttttttttttttttt
      } else if (type == "daily") {
        if (isavg) {
          const e_date = moment(enddate).format("YYYY-MM-DD");
          let running_date = moment(begindate).format("YYYY-MM-DD");
          while (moment(running_date).isSameOrBefore(e_date)) {
            let environment = await EnvironmentModel.findAqiDataInDaily(
              weatherStation.id,
              running_date
            );
            if (!environment || environment == undefined) {
              environment = {};
              environment.datetime = running_date;
            }
            if (moment(running_date).isAfter(today)) {
              break;
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));

            running_date = moment(new Date(running_date))
              .add(1, "days")
              .format("YYYY-MM-DD");
            // console.log(environmentPrototypeArr.length)
          }
        } else {
          environmentArr =
            await EnvironmentModel.findWeatherStationByBetweenDayDaily(
              begindate,
              enddate,
              weatherStation.id
            );
          const e_date = moment(enddate).format("YYYY-MM-DD");
          let running_date = moment(begindate).format("YYYY-MM-DD");
          while (moment(running_date).isSameOrBefore(e_date)) {
            var dateSetHour = moment(new Date(running_date)).format(
              "YYYY-MM-DD"
            );
            let environment = environmentArr.find((row) => {
              if (row.datetime == dateSetHour) return true;
            });
            if (!environment) {
              environment = {};
              environment.datetime = dateSetHour;
            }
            if (moment(dateSetHour).isSameOrAfter(today)) {
              break;
            }
            environmentPrototypeArr.push(new EnvironmentPrototype(environment));

            running_date = moment(new Date(running_date))
              .add(1, "days")
              .format("YYYY-MM-DD");
            // console.log(environmentPrototypeArr.length)
          }
        }
      } else {
        // * HOUR
        if (isavg) {
          const e_date = moment(enddate).format("YYYY-MM-DD HH:00:00");
          let running_date = moment(begindate).format("YYYY-MM-DD HH:00:00");
          while (moment(running_date).isSameOrBefore(e_date)) {
            for (let i = 0; i <= 23; i++) {
              var dateSetHour = moment(
                new Date(running_date).setHours(i)
              ).format("YYYY-MM-DD HH:00:00");
              let environment = await EnvironmentModel.findAqiDataInHourly(
                weatherStation.id,
                dateSetHour
              );

              if (!environment || environment == undefined) {
                environment = {};
                environment.datetime = dateSetHour;
              }
              if (moment(dateSetHour).isAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );
            }
            running_date = moment(new Date(running_date))
              .add(1, "days")
              .format("YYYY-MM-DD HH:00:00");
            // console.log(environmentPrototypeArr.length)
          }
        } else {
          environmentArr =
            await EnvironmentModel.findWeatherStationByBetweenDayHourly(
              begindate,
              enddate,
              weatherStation.id
            );
          // console.log(environmentArr.length)
          const b_date = moment(begindate).format("YYYY-MM-DD HH:00:00");
          const e_date = moment(enddate).format("YYYY-MM-DD HH:00:00");
          let running_date = moment(begindate).format("YYYY-MM-DD HH:00:00");
          while (moment(running_date).isSameOrBefore(e_date)) {
            for (let i = 0; i <= 23; i++) {
              var dateSetHour = moment(
                new Date(running_date).setHours(i)
              ).format("YYYY-MM-DD HH:00:00");
              let environment = environmentArr.find((row) => {
                if (row.datetime == dateSetHour) return true;
              });
              if (!environment) {
                environment = {};
                environment.datetime = dateSetHour;
              }
              if (moment(dateSetHour).isSameOrAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );
            }
            running_date = moment(new Date(running_date))
              .add(1, "days")
              .format("YYYY-MM-DD HH:00:00");
            // console.log(environmentPrototypeArr.length)
          }
        }
      }
    } else if (req.query.last && req.query.lastType) {
      const last = req.query.last;
      const lasttype = req.query.lastType;
      req.query = {
        stationid,
        last,
        lasttype,
      };
      filename += `${last}${lasttype}`;
      if (type == "minutely") {
        throw new HttpException(400, "Invalid Option");
      }
      if (type == "daily") {
        if (isavg) {
          // * last with avg
          switch (lasttype) {
            case "days":
              const xdays = +last;
              for (let i = xdays; i >= 1; i--) {
                const date = new Date();
                let dateBefore = moment(
                  date.setDate(date.getDate() - i)
                ).format("YYYY-MM-DD");
                dateArr.push(dateBefore);
              }
              for (let j in dateArr) {
                var dateSetHour = moment(new Date(dateArr[j])).format(
                  "YYYY-MM-DD"
                );
                let environment = await EnvironmentModel.findAqiDataInDaily(
                  weatherStation.id,
                  dateSetHour
                );

                if (!environment || environment == undefined) {
                  environment = {};
                  environment.datetime = dateSetHour;
                }
                if (moment(dateSetHour).isAfter(today)) {
                  break;
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }

              break;
            case "months":
              const xmonths = +last;
              for (let i = xmonths; i >= 1; i--) {
                const date = new Date();
                //  default getMonth 0 - 11
                const month = date.getMonth() + 1 - i;
                // console.log(month);
                const dateSetMonth = date.setMonth(month);
                const currentMonth = new Date(dateSetMonth).getMonth();
                const year = new Date(dateSetMonth).getFullYear();
                const daysInMonth = this.daysInMonth(month, year);
                // console.log(currentMonth, year);
                // console.log(daysInMonth);
                for (let j = 1; j <= daysInMonth; j++) {
                  // console.log(j)
                  const monthIndex = currentMonth - 1;
                  let dateBefore = moment(new Date(year, monthIndex, j)).format(
                    "YYYY-MM-DD"
                  );
                  dateArr.push(dateBefore);
                }
              }
              // environmentArr = await EnvironmentModel.findWeatherStationByHourLastX(xmonths, weatherStation.id, "months");
              for (let j in dateArr) {
                var dateSetHour = moment(new Date(dateArr[j])).format(
                  "YYYY-MM-DD"
                );
                let environment = await EnvironmentModel.findAqiDataInDaily(
                  weatherStation.id,
                  dateSetHour
                );

                if (!environment || environment == undefined) {
                  environment = {};
                  environment.datetime = dateSetHour;
                }
                if (moment(dateSetHour).isAfter(today)) {
                  break;
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }
              break;
            default:
              console.log("Invalid Last Type");
          }
        } else {
          // * last without avg
          switch (lasttype) {
            case "days":
              const xdays = +last;
              for (let i = xdays; i >= 1; i--) {
                const date = new Date();
                let dateBefore = moment(
                  date.setDate(date.getDate() - i)
                ).format("YYYY-MM-DD");
                dateArr.push(dateBefore);
              }
              environmentArr = await EnvironmentModel.findWeatherStationByLastX(
                xdays,
                weatherStation.id,
                "days"
              );
              // console.log(environmentArr)
              for (let j in dateArr) {
                let environment = environmentArr.find((row) => {
                  if (row.datetime == dateArr[j]) return true;
                });
                if (!environment) {
                  environment = {};
                  environment.datetime = dateArr[j];
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }
              break;
            case "months":
              const xmonths = +last;
              for (let i = xmonths; i >= 1; i--) {
                const date = new Date();
                //  default getMonth 0 - 11
                const month = date.getMonth() + 1 - i;
                // console.log(month);
                const dateSetMonth = date.setMonth(month);
                const currentMonth = new Date(dateSetMonth).getMonth();
                const year = new Date(dateSetMonth).getFullYear();
                const daysInMonth = this.daysInMonth(month, year);
                // console.log(currentMonth, year);
                // console.log(daysInMonth);
                for (let j = 1; j <= daysInMonth; j++) {
                  // console.log(j)
                  const monthIndex = currentMonth - 1;
                  let dateBefore = moment(new Date(year, monthIndex, j)).format(
                    "YYYY-MM-DD"
                  );
                  dateArr.push(dateBefore);
                }
              }
              environmentArr = await EnvironmentModel.findWeatherStationByLastX(
                xmonths,
                weatherStation.id,
                "months"
              );
              for (let j in dateArr) {
                let environment = environmentArr.find((row) => {
                  if (row.datetime == dateArr[j]) return true;
                });
                if (!environment) {
                  environment = {};
                  environment.datetime = dateArr[j];
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }
              break;
            default:
              console.log("Invalid Last Type");
          }
        }
      } else {
        // * HOUR
        if (isavg) {
          switch (lasttype) {
            case "days":
              const xdays = +last;
              for (let i = xdays; i >= 1; i--) {
                const date = new Date();
                let dateBefore = moment(
                  date.setDate(date.getDate() - i)
                ).format("YYYY-MM-DD");
                dateArr.push(dateBefore);
              }
              // environmentArr = await EnvironmentModel.findWeatherStationByHourLastX(xdays, weatherStation.id, "days");
              // console.log(environmentArr)
              for (let j in dateArr) {
                for (let i = 0; i <= 23; i++) {
                  var dateSetHour = moment(
                    new Date(dateArr[j]).setHours(i)
                  ).format("YYYY-MM-DD HH:00:00");
                  let environment = await EnvironmentModel.findAqiDataInHourly(
                    weatherStation.id,
                    dateSetHour
                  );

                  if (!environment || environment == undefined) {
                    environment = {};
                    environment.datetime = dateSetHour;
                  }
                  if (moment(dateSetHour).isAfter(today)) {
                    break;
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
              }

              break;
            case "months":
              const xmonths = +last;
              for (let i = xmonths; i >= 1; i--) {
                const date = new Date();
                //  default getMonth 0 - 11
                const month = date.getMonth() + 1 - i;
                // console.log(month);
                const dateSetMonth = date.setMonth(month);
                const currentMonth = new Date(dateSetMonth).getMonth();
                const year = new Date(dateSetMonth).getFullYear();
                const daysInMonth = this.daysInMonth(month, year);
                // console.log(currentMonth, year);
                // console.log(daysInMonth);
                for (let j = 1; j <= daysInMonth; j++) {
                  // console.log(j)
                  const monthIndex = currentMonth - 1;
                  let dateBefore = moment(new Date(year, monthIndex, j)).format(
                    "YYYY-MM-DD"
                  );
                  dateArr.push(dateBefore);
                }
              }
              // environmentArr = await EnvironmentModel.findWeatherStationByHourLastX(xmonths, weatherStation.id, "months");
              for (let j in dateArr) {
                for (let i = 0; i <= 23; i++) {
                  var dateSetHour = moment(
                    new Date(dateArr[j]).setHours(i)
                  ).format("YYYY-MM-DD HH:00:00");
                  let environment = await EnvironmentModel.findAqiDataInHourly(
                    weatherStation.id,
                    dateSetHour
                  );

                  if (!environment || environment == undefined) {
                    environment = {};
                    environment.datetime = dateSetHour;
                  }
                  if (moment(dateSetHour).isAfter(today)) {
                    break;
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
              }
              break;
            default:
              console.log("Invalid Last Type");
          }
        } else {
          switch (lasttype) {
            case "days":
              const xdays = +last;
              for (let i = xdays; i >= 1; i--) {
                const date = new Date();
                let dateBefore = moment(
                  date.setDate(date.getDate() - i)
                ).format("YYYY-MM-DD");
                dateArr.push(dateBefore);
              }
              environmentArr =
                await EnvironmentModel.findWeatherStationByHourLastX(
                  xdays,
                  weatherStation.id,
                  "days"
                );
              // console.log(environmentArr)
              for (let j in dateArr) {
                for (let i = 0; i <= 23; i++) {
                  var dateSetHour = moment(
                    new Date(dateArr[j]).setHours(i)
                  ).format("YYYY-MM-DD HH:mm:SS");
                  let environment = environmentArr.find((row) => {
                    if (row.datetime == dateSetHour) return true;
                  });
                  if (!environment) {
                    environment = {};
                    environment.datetime = dateSetHour;
                  }
                  if (moment(dateSetHour).isSameOrAfter(today)) {
                    break;
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
              }

              break;
            case "months":
              const xmonths = +last;
              for (let i = xmonths; i >= 1; i--) {
                const date = new Date();
                //  default getMonth 0 - 11
                const month = date.getMonth() + 1 - i;
                // console.log(month);
                const dateSetMonth = date.setMonth(month);
                const currentMonth = new Date(dateSetMonth).getMonth();
                const year = new Date(dateSetMonth).getFullYear();
                const daysInMonth = this.daysInMonth(month, year);
                // console.log(currentMonth, year);
                // console.log(daysInMonth);
                for (let j = 1; j <= daysInMonth; j++) {
                  // console.log(j)
                  const monthIndex = currentMonth - 1;
                  let dateBefore = moment(new Date(year, monthIndex, j)).format(
                    "YYYY-MM-DD"
                  );
                  dateArr.push(dateBefore);
                }
              }
              environmentArr =
                await EnvironmentModel.findWeatherStationByHourLastX(
                  xmonths,
                  weatherStation.id,
                  "months"
                );
              for (let j in dateArr) {
                for (let i = 0; i <= 23; i++) {
                  var dateSetHour = moment(
                    new Date(dateArr[j]).setHours(i)
                  ).format("YYYY-MM-DD HH:mm:SS");
                  let environment = environmentArr.find((row) => {
                    if (row.datetime == dateSetHour) return true;
                  });
                  if (!environment) {
                    environment = {};
                    environment.datetime = dateSetHour;
                  }
                  if (moment(dateSetHour).isSameOrAfter(today)) {
                    break;
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
              }
              break;
            default:
              console.log("Invalid Last Type");
          }
        }
      }
    } else {
      throw new HttpException(400, "Invalid Option");
    }
    if (isavg) {
      for (let i in environmentPrototypeArr) {
        const aqiInformation = await this.calculateAQI(
          environmentPrototypeArr[i]
        );
        environmentPrototypeArr[i].aqi = aqiInformation;
      }
    }
    const wsname = filename;
    filename += `_${type}`;
    if (isavg) {
      filename += `_AQI`;
    }
    filename += `_req${strDate}`;
    if (sameDayMinutely) {
      filename += `_NC${moment(new Date()).format("HH")}`;
    }

    const exportDetail = {
      isaqi: isavg,
      wstation_id: weatherStation["id"],
      wstation_name: weatherStation["name"],
      datatype: type,
      req_date: moment(new Date()).format("YYYY-MM-DD HH:mm:SS"),
    };
    if (!environmentPrototypeArr.length) {
      throw new HttpException(404, "Export Data Not Found");
    }
    const isExported = await ExportData(
      environmentPrototypeArr,
      exportDetail,
      JSON.parse(weatherStation["sensor"]),
      filename,
      wsname,
      export_path
    );
    if (!isExported) {
      throw new HttpException(500, "Can not get Export Data");
    }
    res.status(201).send({
      type: "success",
      parameters: req.query,
      status: 201,
      massage: "Export All Environment Custom type",
      // results: weatherStationArrPrototype.length,
      data: {
        path: `/environment/export/get-file/${filename}`,
      },
    });
  };

  getExportEnvironmentOfWeatherStationAll = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { stationid, date } = req.body;
    let weatherStation = await WeatherStationModel.findIN({
      uuid: stationid,
    });

    if (!weatherStation) {
      throw new HttpException(404, "Weather Station not found");
    }
    const chk_type = ["hourly", "daily", "minutely"];
    let sameDayMinutely: boolean = false;
    let filename = `envy_ws_`;
    var dateArr: Array<any> = [];
    var environmentArr: Array<any> = [];
    var environmentPrototypeArr: Array<any> = [];
    const today = moment(new Date()).format("YYYY-MM-DD HH:00:00");
    const strDate = moment(new Date()).format("YYYYMMDD");
    const _type: string = !req.query.type
      ? "hourly"
      : req.query.type.toString();
    const type = chk_type.includes(_type) ? _type : "hourly";
    const isavg = !req.query.AQI ? false : true;
    console.log(`type : ${type} , AQI : ${isavg}`);

    var environmentPrototypeArrList: Array<any> = [];
    var exportDetailList: Array<any> = [];
    var exportSensorList: Array<any> = [];

    const _month = req.query.month || null;
    const _year = req.query.year || null;
    const _queryType = req.query.queryType || null

    if (req.query.date) {
      const date = req.query.date.toString();
      const dateString: string = moment(new Date(date)).format("YYYYMMDD");
      filename += dateString;
    } else if (req.query.from && req.query.to) {
      const begindate = req.query.from.toString();
      const enddate = req.query.to.toString();
      req.query = {
        stationid,
        begindate,
        enddate,
      };
      filename += `${moment(begindate).format("YYYYMMDD")}to${moment(
        enddate
      ).format("YYYYMMDD")}`;
    } else if (req.query.last && req.query.lastType) {
      const last = req.query.last;
      const lasttype = req.query.lastType;
      req.query = {
        stationid,
        last,
        lasttype,
      };
      filename += `${last}${lasttype}`;
    } else if (req.query.month && req.query.year && req.query.queryType) {
      const month = req.query.month;
      const year = req.query.year;
      const queryType = req.query.queryType
      req.query = {
        stationid,
        month,
        year,
        queryType
      };
      filename += `${month}-${year}-${queryType}`;
    }

    for (let index = 0; index < weatherStation.length; index++) {
      const element = weatherStation[index];

      if (req.query.date) {
        const date = req.query.date.toString();
        const dateString: string = moment(new Date(date)).format("YYYYMMDD");
        req.query = {
          stationid,
          date,
        };
        if (type == "daily") {
          throw new HttpException(400, "Invalid Option");
        }

        if (type == "minutely") {
          if (isavg) {
            throw new HttpException(400, "Invalid Option");
          }
          let checkFile: string = "";
          if (strDate === dateString) {
            // ! request file in today
            sameDayMinutely = true;
            checkFile = `${filename}_${type}_req${strDate}_NC${moment(
              new Date()
            ).format("HH")}`;
          } else {
            // ! request old file
            checkFile = `${filename}_${type}_req${strDate}`;
          }
          // ! check if file exist
          if (this.isFileExist(checkFile)) {
            console.log("old file found", checkFile);
            res.status(201).send({
              type: "success",
              parameters: req.query,
              status: 201,
              massage: "Export All Environment Custom type",
              // results: weatherStationArrPrototype.length,
              data: {
                path: `/environment/export/get-file/${checkFile}`,
              },
            });
          } else {
            console.log("old file not found", checkFile);
          }

          // 10 minute
          environmentArr =
            await EnvironmentModel.findWeatherStationByDateMinutely(
              date,
              element.id
            );
          // console.log(environmentArr.length)
          for (let i = 0; i <= 23; i++) {
            let step = 0;
            while (step < 60) {
              var dateSetHour = moment(new Date(date).setHours(i, step)).format(
                "YYYY-MM-DD HH:mm:00"
              );
              let environment = environmentArr.find((row) => {
                if (row.datetime == dateSetHour) return true;
              });
              if (!environment) {
                environment = {};
                environment.datetime = dateSetHour;
              }
              if (moment(dateSetHour).isSameOrAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );
              step += 10;
            }
          }

          // console.log(environmentPrototypeArr.length)
        } else {
          if (isavg) {
            for (let i = 0; i <= 23; i++) {
              var dateSetHour = moment(new Date(date).setHours(i)).format(
                "YYYY-MM-DD HH:00:00"
              );
              let environment = await EnvironmentModel.findAqiDataInHourly(
                element.id,
                dateSetHour
              );

              if (!environment || environment == undefined) {
                environment = {};
                environment.datetime = dateSetHour;
              }
              if (moment(dateSetHour).isAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );
            }
          } else {
            environmentArr = await EnvironmentModel.findWeatherStationByOneDate(
              date,
              element.id
            );
            // console.log(environmentArr.length)

            for (let i = 0; i <= 23; i++) {
              var dateSetHour = moment(new Date(date).setHours(i)).format(
                "YYYY-MM-DD HH:00:00"
              );
              let environment = environmentArr.find((row) => {
                if (row.datetime == dateSetHour) return true;
              });
              if (!environment) {
                environment = {};
                environment.datetime = dateSetHour;
              }
              if (moment(dateSetHour).isSameOrAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );
            }
            // console.log(environmentPrototypeArr.length)
          }
        }
      } else if (req.query.from && req.query.to) {
        const begindate = req.query.from.toString();
        const enddate = req.query.to.toString();
        req.query = {
          stationid,
          begindate,
          enddate,
        };

        if (type == "minutely") {
          throw new HttpException(400, "Invalid Option");
          // ! ttttttttttttttttttttttttttttttttttttttttttttttttt
        } else if (type == "daily") {
          if (isavg) {
            const e_date = moment(enddate).format("YYYY-MM-DD");
            let running_date = moment(begindate).format("YYYY-MM-DD");
            while (moment(running_date).isSameOrBefore(e_date)) {
              let environment = await EnvironmentModel.findAqiDataInDaily(
                element.id,
                running_date
              );
              if (!environment || environment == undefined) {
                environment = {};
                environment.datetime = running_date;
              }
              if (moment(running_date).isAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );

              running_date = moment(new Date(running_date))
                .add(1, "days")
                .format("YYYY-MM-DD");
              // console.log(environmentPrototypeArr.length)
            }
          } else {
            environmentArr =
              await EnvironmentModel.findWeatherStationByBetweenDayDaily(
                begindate,
                enddate,
                element.id
              );
            const e_date = moment(enddate).format("YYYY-MM-DD");
            let running_date = moment(begindate).format("YYYY-MM-DD");
            while (moment(running_date).isSameOrBefore(e_date)) {
              var dateSetHour = moment(new Date(running_date)).format(
                "YYYY-MM-DD"
              );
              let environment = environmentArr.find((row) => {
                if (row.datetime == dateSetHour) return true;
              });
              if (!environment) {
                environment = {};
                environment.datetime = dateSetHour;
              }
              if (moment(dateSetHour).isSameOrAfter(today)) {
                break;
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );

              running_date = moment(new Date(running_date))
                .add(1, "days")
                .format("YYYY-MM-DD");
              // console.log(environmentPrototypeArr.length)
            }
          }
        } else {
          // * HOUR
          if (isavg) {
            const e_date = moment(enddate).format("YYYY-MM-DD HH:00:00");
            let running_date = moment(begindate).format("YYYY-MM-DD HH:00:00");
            while (moment(running_date).isSameOrBefore(e_date)) {
              for (let i = 0; i <= 23; i++) {
                var dateSetHour = moment(
                  new Date(running_date).setHours(i)
                ).format("YYYY-MM-DD HH:00:00");
                let environment = await EnvironmentModel.findAqiDataInHourly(
                  element.id,
                  dateSetHour
                );

                if (!environment || environment == undefined) {
                  environment = {};
                  environment.datetime = dateSetHour;
                }
                if (moment(dateSetHour).isAfter(today)) {
                  break;
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }
              running_date = moment(new Date(running_date))
                .add(1, "days")
                .format("YYYY-MM-DD HH:00:00");
              // console.log(environmentPrototypeArr.length)
            }
          } else {
            environmentArr =
              await EnvironmentModel.findWeatherStationByBetweenDayHourly(
                begindate,
                enddate,
                element.id
              );
            // console.log(environmentArr.length)
            const b_date = moment(begindate).format("YYYY-MM-DD HH:00:00");
            const e_date = moment(enddate).format("YYYY-MM-DD HH:00:00");
            let running_date = moment(begindate).format("YYYY-MM-DD HH:00:00");
            while (moment(running_date).isSameOrBefore(e_date)) {
              for (let i = 0; i <= 23; i++) {
                var dateSetHour = moment(
                  new Date(running_date).setHours(i)
                ).format("YYYY-MM-DD HH:00:00");
                let environment = environmentArr.find((row) => {
                  if (row.datetime == dateSetHour) return true;
                });
                if (!environment) {
                  environment = {};
                  environment.datetime = dateSetHour;
                }
                if (moment(dateSetHour).isSameOrAfter(today)) {
                  break;
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }
              running_date = moment(new Date(running_date))
                .add(1, "days")
                .format("YYYY-MM-DD HH:00:00");
              // console.log(environmentPrototypeArr.length)
            }
          }
        }
      } else if (req.query.last && req.query.lasttype) {
        const last = req.query.last;
        const lasttype = req.query.lasttype;
        req.query = {
          stationid,
          last,
          lasttype,
        };

        if (type == "minutely") {
          throw new HttpException(400, "Invalid Option");
        }
        if (type == "daily") {
          if (isavg) {
            // * last with avg
            switch (lasttype) {
              case "days":
                const xdays = +last;
                for (let i = xdays; i >= 1; i--) {
                  const date = new Date();
                  let dateBefore = moment(
                    date.setDate(date.getDate() - i)
                  ).format("YYYY-MM-DD");
                  dateArr.push(dateBefore);
                }
                for (let j in dateArr) {
                  var dateSetHour = moment(new Date(dateArr[j])).format(
                    "YYYY-MM-DD"
                  );
                  let environment = await EnvironmentModel.findAqiDataInDaily(
                    element.id,
                    dateSetHour
                  );

                  if (!environment || environment == undefined) {
                    environment = {};
                    environment.datetime = dateSetHour;
                  }
                  if (moment(dateSetHour).isAfter(today)) {
                    break;
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }

                break;
              case "months":
                const xmonths = +last;
                for (let i = xmonths; i >= 1; i--) {
                  const date = new Date();
                  //  default getMonth 0 - 11
                  const month = Number(_month) || date.getMonth() + 1 - i;
                  // console.log(month);
                  const dateSetMonth = date.setMonth(month);
                  const currentMonth = new Date(dateSetMonth).getMonth();
                  const year =
                    Number(_year) || new Date(dateSetMonth).getFullYear();
                  const daysInMonth = this.daysInMonth(month, year);
                  // console.log(currentMonth, year);
                  // console.log(daysInMonth);
                  for (let j = 1; j <= daysInMonth; j++) {
                    // console.log(j)
                    const monthIndex = currentMonth - 1;
                    let dateBefore = moment(
                      new Date(year, monthIndex, j)
                    ).format("YYYY-MM-DD");
                    dateArr.push(dateBefore);
                  }
                }
                // environmentArr = await EnvironmentModel.findWeatherStationByHourLastX(xmonths, weatherStation.id, "months");
                for (let j in dateArr) {
                  var dateSetHour = moment(new Date(dateArr[j])).format(
                    "YYYY-MM-DD"
                  );
                  let environment = await EnvironmentModel.findAqiDataInDaily(
                    element.id,
                    dateSetHour
                  );

                  if (!environment || environment == undefined) {
                    environment = {};
                    environment.datetime = dateSetHour;
                  }
                  if (moment(dateSetHour).isAfter(today)) {
                    break;
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
                break;
              default:
                console.log("Invalid Last Type");
            }
          } else {
            // * last without avg
            switch (lasttype) {
              case "days":
                const xdays = +last;
                for (let i = xdays; i >= 1; i--) {
                  const date = new Date();
                  let dateBefore = moment(
                    date.setDate(date.getDate() - i)
                  ).format("YYYY-MM-DD");
                  dateArr.push(dateBefore);
                }
                environmentArr =
                  await EnvironmentModel.findWeatherStationByLastX(
                    xdays,
                    element.id,
                    "days"
                  );
                // console.log(environmentArr)
                for (let j in dateArr) {
                  let environment = environmentArr.find((row) => {
                    if (row.datetime == dateArr[j]) return true;
                  });
                  if (!environment) {
                    environment = {};
                    environment.datetime = dateArr[j];
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
                break;
              case "months":
                const xmonths = +last;
                for (let i = xmonths; i >= 1; i--) {
                  const date = new Date();
                  //  default getMonth 0 - 11
                  const month = Number(_month) || date.getMonth() + 1 - i;
                  // console.log(month);
                  const dateSetMonth = date.setMonth(month);
                  const currentMonth = new Date(dateSetMonth).getMonth();
                  const year =
                    Number(_year) || new Date(dateSetMonth).getFullYear();
                  const daysInMonth = this.daysInMonth(month, year);
                  // console.log(currentMonth, year);
                  // console.log(daysInMonth);
                  for (let j = 1; j <= daysInMonth; j++) {
                    // console.log(j)
                    const monthIndex = currentMonth - 1;
                    let dateBefore = moment(
                      new Date(year, monthIndex, j)
                    ).format("YYYY-MM-DD");
                    dateArr.push(dateBefore);
                  }
                }
                environmentArr =
                  await EnvironmentModel.findWeatherStationByLastX(
                    xmonths,
                    element.id,
                    "months"
                  );
                for (let j in dateArr) {
                  let environment = environmentArr.find((row) => {
                    if (row.datetime == dateArr[j]) return true;
                  });
                  if (!environment) {
                    environment = {};
                    environment.datetime = dateArr[j];
                  }
                  environmentPrototypeArr.push(
                    new EnvironmentPrototype(environment)
                  );
                }
                break;
              default:
                console.log("Invalid Last Type");
            }
          }
        } else {
          // * HOUR
          if (isavg) {
            switch (lasttype) {
              case "days":
                const xdays = +last;
                for (let i = xdays; i >= 1; i--) {
                  const date = new Date();
                  let dateBefore = moment(
                    date.setDate(date.getDate() - i)
                  ).format("YYYY-MM-DD");
                  dateArr.push(dateBefore);
                }
                // environmentArr = await EnvironmentModel.findWeatherStationByHourLastX(xdays, weatherStation.id, "days");
                // console.log(environmentArr)
                for (let j in dateArr) {
                  for (let i = 0; i <= 23; i++) {
                    var dateSetHour = moment(
                      new Date(dateArr[j]).setHours(i)
                    ).format("YYYY-MM-DD HH:00:00");
                    let environment =
                      await EnvironmentModel.findAqiDataInHourly(
                        element.id,
                        dateSetHour
                      );

                    if (!environment || environment == undefined) {
                      environment = {};
                      environment.datetime = dateSetHour;
                    }
                    if (moment(dateSetHour).isAfter(today)) {
                      break;
                    }
                    environmentPrototypeArr.push(
                      new EnvironmentPrototype(environment)
                    );
                  }
                }

                break;
              case "months":
                const xmonths = +last;
                for (let i = xmonths; i >= 1; i--) {
                  const date = new Date();
                  //  default getMonth 0 - 11
                  const month = Number(_month) || date.getMonth() + 1 - i;
                  // console.log(month);
                  const dateSetMonth = date.setMonth(month);
                  const currentMonth = new Date(dateSetMonth).getMonth();
                  const year =
                    Number(_year) || new Date(dateSetMonth).getFullYear();
                  const daysInMonth = this.daysInMonth(month, year);
                  // console.log(currentMonth, year);
                  // console.log(daysInMonth);
                  for (let j = 1; j <= daysInMonth; j++) {
                    // console.log(j)
                    const monthIndex = currentMonth - 1;
                    let dateBefore = moment(
                      new Date(year, monthIndex, j)
                    ).format("YYYY-MM-DD");
                    dateArr.push(dateBefore);
                  }
                }
                // environmentArr = await EnvironmentModel.findWeatherStationByHourLastX(xmonths, weatherStation.id, "months");
                for (let j in dateArr) {
                  for (let i = 0; i <= 23; i++) {
                    var dateSetHour = moment(
                      new Date(dateArr[j]).setHours(i)
                    ).format("YYYY-MM-DD HH:00:00");
                    let environment =
                      await EnvironmentModel.findAqiDataInHourly(
                        element.id,
                        dateSetHour
                      );

                    if (!environment || environment == undefined) {
                      environment = {};
                      environment.datetime = dateSetHour;
                    }
                    if (moment(dateSetHour).isAfter(today)) {
                      break;
                    }
                    environmentPrototypeArr.push(
                      new EnvironmentPrototype(environment)
                    );
                  }
                }
                break;
              default:
                console.log("Invalid Last Type");
            }
          } else {
            switch (lasttype) {
              case "days":
                const xdays = +last;
                for (let i = xdays; i >= 1; i--) {
                  const date = new Date();
                  let dateBefore = moment(
                    date.setDate(date.getDate() - i)
                  ).format("YYYY-MM-DD");
                  dateArr.push(dateBefore);
                }
                environmentArr =
                  await EnvironmentModel.findWeatherStationByHourLastX(
                    xdays,
                    element.id,
                    "days"
                  );
                // console.log(environmentArr)
                for (let j in dateArr) {
                  for (let i = 0; i <= 23; i++) {
                    var dateSetHour = moment(
                      new Date(dateArr[j]).setHours(i)
                    ).format("YYYY-MM-DD HH:mm:SS");
                    let environment = environmentArr.find((row) => {
                      if (row.datetime == dateSetHour) return true;
                    });
                    if (!environment) {
                      environment = {};
                      environment.datetime = dateSetHour;
                    }
                    if (moment(dateSetHour).isSameOrAfter(today)) {
                      break;
                    }
                    environmentPrototypeArr.push(
                      new EnvironmentPrototype(environment)
                    );
                  }
                }

                break;
              case "months":
                const xmonths = +last;
                for (let i = xmonths; i >= 1; i--) {
                  const date = new Date();
                  //  default getMonth 0 - 11
                  const month = Number(_month) || date.getMonth() + 1 - i;
                  // console.log(month);
                  const dateSetMonth = date.setMonth(month);
                  const currentMonth = new Date(dateSetMonth).getMonth();
                  const year =
                    Number(_year) || new Date(dateSetMonth).getFullYear();
                  const daysInMonth = this.daysInMonth(month, year);
                  // console.log(currentMonth, year);
                  // console.log(daysInMonth);
                  for (let j = 1; j <= daysInMonth; j++) {
                    // console.log(j)
                    const monthIndex = currentMonth - 1;
                    let dateBefore = moment(
                      new Date(year, monthIndex, j)
                    ).format("YYYY-MM-DD");
                    dateArr.push(dateBefore);
                  }
                }
                environmentArr =
                  await EnvironmentModel.findWeatherStationByHourLastX(
                    xmonths,
                    element.id,
                    "months"
                  );
                for (let j in dateArr) {
                  for (let i = 0; i <= 23; i++) {
                    var dateSetHour = moment(
                      new Date(dateArr[j]).setHours(i)
                    ).format("YYYY-MM-DD HH:mm:SS");
                    let environment = environmentArr.find((row) => {
                      if (row.datetime == dateSetHour) return true;
                    });
                    if (!environment) {
                      environment = {};
                      environment.datetime = dateSetHour;
                    }
                    if (moment(dateSetHour).isSameOrAfter(today)) {
                      break;
                    }
                    environmentPrototypeArr.push(
                      new EnvironmentPrototype(environment)
                    );
                  }
                }
                break;
              default:
                console.log("Invalid Last Type");
            }
          }
        }
      } else if (req.query.month && req.query.year) {
        const month = req.query.month;
        const year = req.query.year;
        const queryType = req.query.queryType;
        req.query = {
          stationid,
          month,
          year,
          queryType
        };

        const daysInMonth = this.daysInMonth(Number(month), Number(year));
  
        for (let j = 1; j <= daysInMonth; j++) {
          // console.log(j)
          const monthIndex = Number(month) - 1;
          let dateBefore = moment(new Date(Number(year), monthIndex, j)).format(
            "YYYY-MM-DD"
          );
          dateArr.push(dateBefore);
        }

        if (!dateArr.length) {
          const date = new Date();
          // console.log(month);
          const dateSetMonth = date.setMonth(Number(month) - 1);
          const currentMonth = new Date(dateSetMonth).getMonth();
          const daysInMonth = this.daysInMonth(Number(month) - 1, Number(year));
          for (let j = 1; j <= daysInMonth; j++) {
            // console.log(j)
            if (j > date.getDate()) {
              break;
            }
            const monthIndex = currentMonth;
            let dateBefore = moment(
              new Date(Number(year), monthIndex, j)
            ).format("YYYY-MM-DD");
            dateArr.push(dateBefore);
          }
        }
        
        switch (queryType) {
          case "hour":
            environmentArr = await EnvironmentModel.findWeatherStationByMonthYear(
              year + '-' + month.toString(),
              element.id,
              "hour"
            );
            for (let j in dateArr) {
              for (let i = 0; i <= 23; i++) {
                var dateSetHour = moment(
                  new Date(dateArr[j]).setHours(i)
                ).format("YYYY-MM-DD HH:mm:SS");
                let environment = environmentArr.find((row) => {
                  if (row.datetime == dateSetHour) return true;
                });
                if (!environment) {
                  environment = {};
                  environment.datetime = dateSetHour;
                }
                if (moment(dateSetHour).isSameOrAfter(today)) {
                  break;
                }
                environmentPrototypeArr.push(
                  new EnvironmentPrototype(environment)
                );
              }
            }
            break;

          case "day" :
            environmentArr = await EnvironmentModel.findWeatherStationByMonthYear(
              year + '-' + month.toString(),
              element.id,
              "day"
            );

            for (let j in dateArr) {
              let environment = environmentArr.find((row) => {
                console.log(row.datetime == dateArr[j], row.date, dateArr[j])
                if (row.datetime == dateArr[j]) return true;
              });
              if (!environment) {
                environment = {};
                environment.datetime = dateArr[j];
              }
              environmentPrototypeArr.push(
                new EnvironmentPrototype(environment)
              );
            }
          break;

          default:
            break;
        }

        // environmentArr = await EnvironmentModel.find();
        // environmentArr = await EnvironmentModel.find();
      } else {
        throw new HttpException(400, "Invalid Option");
      }
      if (isavg) {
        for (let i in environmentPrototypeArr) {
          const aqiInformation = await this.calculateAQI(
            environmentPrototypeArr[i]
          );
          environmentPrototypeArr[i].aqi = aqiInformation;
        }
      }

      const exportDetail = {
        isaqi: isavg,
        wstation_id: element["id"],
        wstation_name: element["name"],
        datatype: type,
        req_date: moment(new Date()).format("YYYY-MM-DD HH:mm:SS"),
      };

      exportDetailList.push(exportDetail);

      const sensor = JSON.parse(element["sensor"]);
      exportSensorList.push(sensor);

      environmentPrototypeArrList.push(environmentPrototypeArr);

      environmentPrototypeArr = [];

      // if (!environmentPrototypeArr.length) {
      //     throw new HttpException(404, "Export Data Not Found");
      // }
    }

    filename += `_${type}`;
    if (isavg) {
      filename += `_AQI`;
    }
    filename += `_req${strDate}`;
    if (sameDayMinutely) {
      filename += `_NC${moment(new Date()).format("HH")}`;
    }

    const isExported = await ExportDataV2(
      environmentPrototypeArrList,
      exportDetailList,
      exportSensorList,
      filename,
      export_path
    );
    if (!isExported) {
      throw new HttpException(500, "Can not get Export Data");
    }

    res.status(201).send({
      type: "success",
      parameters: req.query,
      status: 201,
      massage: "Export All Environment Custom type",
      // results: weatherStationArrPrototype.length,
      data: {
        path: `/environment/export/get-file/${filename}`,
      },
    });
  };

  getCurrentEnvironmentOfWeatherStation = async (stationid: number) => {
    let weatherStationEnvironment =
      await EnvironmentModel.findWeatherStationInformation(stationid);
    if (!weatherStationEnvironment) {
      weatherStationEnvironment = {};
    }
    console.log('weatherStationEnvironment');
    // console.log(weatherStationEnvironment)
    let weatherStationPrototype = new EnvironmentPrototype(
      weatherStationEnvironment
    );
    const aqiInformation = await this.calculateAQI(weatherStationPrototype);
    var environment: environmentInformation = {};
    environment = weatherStationPrototype;
    environment.aqi = aqiInformation;
    console.log(environment)
    return environment;
  };

  getCurrentEnvironmentOfWeatherStationWithDate = async (
    stationid: number,
    date: string
  ) => {
    let weatherStationEnvironment =
      await EnvironmentModel.findWeatherStationInformationWithDate(
        stationid,
        date
      );
    if (!weatherStationEnvironment) {
      weatherStationEnvironment = {};
    }
    // console.log(weatherStationEnvironment)
    let weatherStationPrototype = new EnvironmentPrototype(
      weatherStationEnvironment
    );
    const aqiInformation = await this.calculateAQI(weatherStationPrototype);
    var environment: environmentInformation = {};
    environment = weatherStationPrototype;
    environment.aqi = aqiInformation;
    // console.log(environment)
    return environment;
  };

  calculateAQI = async ({
    PM25,
    PM10,
    O3,
    CO,
    NO2,
    SO2,
  }: {
    PM25: any;
    PM10: any;
    O3: any;
    CO: any;
    NO2: any;
    SO2: any;
  }) => {
    let AQITable: Array<valueRange> = [
      {
        level: 1,
        aqi: [0, 25],
        PM25: [0, 15],
        PM10: [0, 50],
        O3: [0, 35],
        CO: [0, 4.4],
        NO2: [0, 60],
        SO2: [0, 100],
      },
      {
        level: 2,
        aqi: [26, 50],
        PM25: [15.1, 25],
        PM10: [51, 80],
        O3: [36, 50],
        CO: [4.5, 6.4],
        NO2: [61, 106],
        SO2: [101, 200],
      },
      {
        level: 3,
        aqi: [51, 100],
        PM25: [25.1, 37.5],
        PM10: [81, 120],
        O3: [51, 70],
        CO: [6.5, 9.0],
        NO2: [107, 170],
        SO2: [201, 300],
      },
      {
        level: 4,
        aqi: [101, 200],
        PM25: [37.6, 75],
        PM10: [121, 180],
        O3: [71, 120],
        CO: [9.1, 30.0],
        NO2: [171, 340],
        SO2: [301, 400],
      },
      {
        level: 5,
        aqi: [200, null],
        PM25: [75.1, null],
        PM10: [181, null],
        O3: [121, null],
        CO: [30.1, null],
        NO2: [341, null],
        SO2: [401, null],
      },
    ];
    const PM25ValueRange: valueRange = this.calculateValueRange(
      AQITable,
      "PM25",
      PM25
    );
    const PM10ValueRange: valueRange = this.calculateValueRange(
      AQITable,
      "PM10",
      PM10
    );
    const O3ValueRange: valueRange = this.calculateValueRange(
      AQITable,
      "O3",
      O3
    );
    const COValueRange: valueRange = this.calculateValueRange(
      AQITable,
      "CO",
      CO
    );
    const NO2ValueRange: valueRange = this.calculateValueRange(
      AQITable,
      "NO2",
      NO2
    );
    const SO2ValueRange: valueRange = this.calculateValueRange(
      AQITable,
      "SO2",
      SO2
    );
    // console.log(PM25ValueRange)
    const PM25ValueIndex: any = this.findAQIIndex(
      PM25ValueRange.aqi[1],
      PM25ValueRange.aqi[0],
      PM25ValueRange.PM25[1],
      PM25ValueRange.PM25[0],
      PM25
    );
    const PM10ValueIndex: any = this.findAQIIndex(
      PM10ValueRange.aqi[1],
      PM10ValueRange.aqi[0],
      PM10ValueRange.PM10[1],
      PM10ValueRange.PM10[0],
      PM10
    );
    const O3ValueIndex: any = this.findAQIIndex(
      O3ValueRange.aqi[1],
      O3ValueRange.aqi[0],
      O3ValueRange.O3[1],
      O3ValueRange.O3[0],
      O3
    );
    const COValueIndex: any = this.findAQIIndex(
      COValueRange.aqi[1],
      COValueRange.aqi[0],
      COValueRange.CO[1],
      COValueRange.CO[0],
      CO
    );
    const NO2ValueIndex: any = this.findAQIIndex(
      NO2ValueRange.aqi[1],
      NO2ValueRange.aqi[0],
      NO2ValueRange.NO2[1],
      NO2ValueRange.NO2[0],
      NO2
    );
    const SO2ValueIndex: any = this.findAQIIndex(
      SO2ValueRange.aqi[1],
      SO2ValueRange.aqi[0],
      SO2ValueRange.SO2[1],
      SO2ValueRange.SO2[0],
      SO2
    );

    var maxOfAQI: any =
      PM25ValueIndex == null &&
        PM10ValueIndex == null &&
        O3ValueIndex == null &&
        COValueIndex == null &&
        NO2ValueIndex == null &&
        SO2ValueIndex == null
        ? null
        : Math.max(
          ...[
            PM25ValueIndex,
            PM10ValueIndex,
            O3ValueIndex,
            COValueIndex,
            NO2ValueIndex,
            SO2ValueIndex,
          ]
        );

    const getInfoAQI: any =
      maxOfAQI == null
        ? null
        : AQITable.find((row) => {
          if (row.aqi[0] <= maxOfAQI && maxOfAQI <= row.aqi[1]) return true;
          else if (row.aqi[0] <= maxOfAQI && row.aqi[1] == null) return true;
        });

    return {
      PM25: {
        index: PM25ValueIndex,
        value: PM25,
      },
      PM10: {
        index: PM10ValueIndex,
        value: PM10,
      },
      O3: {
        index: O3ValueIndex,
        value: O3,
      },
      CO: {
        index: COValueIndex,
        value: CO,
      },
      NO2: {
        index: NO2ValueIndex,
        value: NO2,
      },
      SO2: {
        index: SO2ValueIndex,
        value: SO2,
      },
      AQI: {
        Level: getInfoAQI == null ? null : getInfoAQI.level,
        aqi: maxOfAQI == null ? null : maxOfAQI,
      },
    };
  };

  calculateValueRange = (
    AQITable: Array<any>,
    condition: any,
    _interests: any
  ) => {
    const interests = _interests != null ? Math.round(_interests) : 0;
    const result = AQITable.find((row) => {
      if (row[condition][0] <= interests && interests <= row[condition][1]) {
        return true;
      }
      if (row[condition][0] <= interests && row[condition][1] == null) {
        return true;
      }
    });
    return result;
  };

  findAQIIndex = (
    Imax: number,
    Imin: number,
    Xmax: number,
    Xmin: number,
    x: number
  ) => {
    if (!x) {
      if (x === 0) {
        return 0;
      }
      return null;
    }
    return Math.round(((Imax - Imin) / (Xmax - Xmin)) * (x - Xmin) + Imin);
  };

  daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
    8;
  };

  getCurrentEnvironmentOfWeatherStationMQTT = async (stationid: number) => {
    let weatherStationEnvironment =
      await EnvironmentModel.findWeatherStationInformation(stationid);
    if (!weatherStationEnvironment) {
      weatherStationEnvironment = {};
    }
    // console.log(weatherStationEnvironment)
    let weatherStationPrototype = new EnvironmentPrototype(
      weatherStationEnvironment
    );
    const aqiInformation = await this.calculateAQI(weatherStationPrototype);
    var environment: environmentInformation = {};
    environment = weatherStationPrototype;
    environment.aqi = aqiInformation;
    // console.log(environment)

    return environment;
  };

  getImage = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let name = req.params.name;
    await downloadImage(name, res);
  };

  /// Broadcast to line
  sendBroadcast = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const weatherStation = await WeatherStationModel.find({
      status: "online",
    });

    let count = 0;
    let aqi = 0;
    let aqi_level = 0;

    for (let index = 0; index < weatherStation.length; index++) {
      const element = weatherStation[index];

      if (element.uuid === "2eaebab9-aa6b-11ec-8305-0242ac120002") continue;
      let weatherStationDetail: any = await WeatherStationModel.findOne({
        uuid: element.uuid,
      });

      const environment = await this.getCurrentEnvironmentOfWeatherStation(
        weatherStationDetail.id
      );

      aqi_level += environment.aqi.AQI.Level;
      aqi += environment.aqi.AQI.aqi;
      count += 1;
    }

    console.log(aqi, aqi_level, count, aqi / count, aqi_level / count);
    const data = await this.checkLengthAQI(aqi / count, aqi_level / count);

    const flexCard = card(
      data.aqi_img,
      data.aqi_level,
      data.color,
      data.station_status,
      data.suggest,
      "เทศบาลพิษณุโลก"
    );

    SendBroadcast(
      [flexCard],
      "MiF7Wj3dZsKVPK+9cfWkj3G6p5mGyv2rSMWdnBsglEgx/HG0Hl5DXoYnwxgiORr8qme4uBQsAFxXtPTTeGJNtByuZspp3Qwfe1mqZgobGvkTPDe+PnygjoCNpGyfcLAqnXOk207UKScIhcwGbpvUSQdB04t89/1O/w1cDnyilFU=",
      res
    );
  };

  checkLengthAQI = (aqi: Number, aqi_level: Number) => {
    let color = "#47b5ff";
    let suggest = "อากาศดีมากแบบนี้ น่าจะออกไปเดินเล่นนอกบ้านนะคะ";
    let station_status = "ดีมาก";
    let img = "https://api-envy.adcm.co.th/environment/image/Sky.jpg";

    if (aqi_level === 2) {
      suggest = "อากาศดี แจ่มใส สามารถทำกิจกรรมได้ค่ะ";
      color = "#82cd47";
      station_status = "ดี";
      img = "https://api-envy.adcm.co.th/environment/image/Green.jpg";
    } else if (aqi_level === 3) {
      suggest = "อากาศยังปกติ สามารถทำกิจกรรมได้ค่ะ";
      color = "#e7d300";
      station_status = "ปานกลาง";
      img = "https://api-envy.adcm.co.th/environment/image/Yellow.jpg";
    } else if (aqi_level === 4) {
      suggest = "ควรงดกิจกรรมกลางแจ้ง และสวมหน้ากากป้องกัน";
      color = "#fd841f";
      station_status = "เริ่มมีผลต่อสุขภาพ";
      img = "https://api-envy.adcm.co.th/environment/image/Orange.jpg";
    } else if (aqi_level === 5) {
      suggest = "หลีกเลี่ยงการทำกิจกรรมภายนอก และควรสวมใส่หน้ากาก N95";
      color = "#e64848";
      station_status = "มีผลต่อสุขภาพ";
      img = "https://api-envy.adcm.co.th/environment/image/Red1.jpg";
    }

    const data = {
      aqi_img: img,
      station_status: station_status,
      color: color,
      suggest: suggest,
      aqi_level: aqi.toString(),
    };

    return data;
  };
}

export default new EnvironmentController();
