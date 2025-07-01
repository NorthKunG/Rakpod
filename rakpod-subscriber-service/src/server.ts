import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MqttClient } from "./config/mqtt";
import moment from "moment";

// utils
import HttpException from "./utils/HttpException.utils";
import { errorMiddleware } from "./middlewares/error.middleware";

//router
import WeatherStationRouter from "./routes/weatherStation.route";
import EnvironmentRouter from "./routes/environment.route";
import MessageRouter from "./routes/message.route";
import AuthRouter from "./routes/auth.route";

// prototype
import { EnvironmentPrototypeSocket } from "./prototypes/environment.prototype";
import { AuthToNotify } from "./utils/line.notify.utils";
import weatherStationController from "./controllers/weatherStation.controller";
import messageController from "./controllers/message.controller";
import { WeatherStationPrototype } from "./prototypes/weatherStation.prototype";

// redirect page
// var html:string = require('./redirect/notifyredirect.html').default

// setup
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/socketio/",
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT;

// USER REQUEST
interface UserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

///// TEMPORARY VARIABLE FOR RAINDATA STATION 7
let prev_12rain: any = {};
let curr_rain: any = {};
let diff_rain = 0;

let last_datetime: any = {};
// let prev_12rain: any = {}
// let curr_rain: any = {}
// let diff_rain = 0
const time_period: number = !process.env.DATA_TIME_PERIOD_SEC
  ? 3
  : parseInt(process.env.DATA_TIME_PERIOD_SEC); // * insert data every 10 second edit in env

app.use(morgan("combined"));
app.use(cors());
app.use(cors({
  origin: 'https://www.rakpod.adcm.co.th'
}));
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/weather-station", WeatherStationRouter);
app.use("/environment", EnvironmentRouter);

app.use("/message", MessageRouter);
app.use("/auth", AuthRouter);

///// TEMPORARY FUNCTION FOR RAINDATA STATION 7
const checkPrevRain = (data: any) => {
  try {
    let prototypeData = data;

    if (!Object.keys(prev_12rain).length) {
      prev_12rain.datetime = prototypeData.datetime;
      prev_12rain.rain_gauge_mm = 0;
      console.log("prev");
      return prototypeData;
    }
    if (!Object.keys(curr_rain).length) {
      curr_rain.datetime = prototypeData.datetime;
      curr_rain.rain_gauge_mm = 0;
      console.log("curr");
      return prototypeData;
    }
    prototypeData.rain_gauge_mm = parseFloat(prototypeData.rain_gauge_mm);

    let prev_date = moment(prev_12rain.datetime).format("YYYY-MM-DD");
    let curr_date = moment(curr_rain.datetime).format("YYYY-MM-DD");
    let data_date = moment(prototypeData.datetime).format("YYYY-MM-DD");
    let pastNoon = false;
    let checkTimeout = moment(prev_12rain.datetime).isBefore(
      moment(prototypeData.datetime).subtract(1, "hours")
    );
    if (checkTimeout) {
      console.log("RESET TIMEOUT");
      if (prototypeData.rain_gauge_mm == 0) {
        curr_rain.rain_gauge_mm = 0;
      }
    }

    if (curr_date == data_date) {
      console.log("SAMEDAY");
      if (prototypeData.rain_gauge_mm < prev_12rain.rain_gauge_mm) {
        console.log("PASS NOON");
        diff_rain = Math.abs(prev_12rain.rain_gauge_mm);
        curr_rain.rain_gauge_mm = diff_rain;
        pastNoon = true;
      }
      prototypeData.rain_gauge_mm += curr_rain.rain_gauge_mm;
    } else {
      console.log("ANOTHER DAY");
      curr_rain.datetime = prototypeData.datetime;
      curr_rain.rain_gauge_mm = 0 - prototypeData.rain_gauge_mm;
      prototypeData.rain_gauge_mm += curr_rain.rain_gauge_mm;
      pastNoon = false;
    }
    if (!pastNoon) {
      prev_12rain.datetime = data.datetime;
      prev_12rain.rain_gauge_mm = parseFloat(data.rain_gauge_mm);
    }

    if (!checkTimeout && prototypeData.rain_gauge_mm < 0) {
      console.log("MINUS", prototypeData.rain_gauge_mm);
      prototypeData.rain_gauge_mm = 0;
      curr_rain.rain_gauge_mm = 0;
    }
    prototypeData.rain_gauge_mm = prototypeData.rain_gauge_mm.toFixed(2);
    console.log(prev_12rain, curr_rain, diff_rain);
    return prototypeData;
  } catch (e) {
    console.log(e);
    return data;
  }
};

const isJsonString = (JStr: string) => {
  try {
    JSON.parse(JStr);
  } catch (e) {
    return false;
  }
  return true;
};
const strArrToJson = (strArr: string) => {
  // * uuid,temp,hum,pm2_5,pm10,co,co2
  // ! {"_uuid":"c505faed-ff5d-469d-bef9-6d0dab5cfa2a","_temp":33,"_hum":42,"_pm1":0.9}
  try {
    const payload_arr = strArr.split(",");
    if (payload_arr.length < 5) {
      console.log("PAYLOAD length is not enough");
      return JSON.stringify("");
    }
    let payload = {
      _uuid: payload_arr[0] == "-" ? null : payload_arr[0],
      _temp: payload_arr[1] == "-" ? null : payload_arr[1],
      _hum: payload_arr[2] == "-" ? null : payload_arr[2],
      _pm2_5: payload_arr[3] == "-" ? null : Math.abs(parseInt(payload_arr[3])),
      _pm10: payload_arr[4] == "-" ? null : Math.abs(parseInt(payload_arr[4])),
      _co: payload_arr[5] == "-" ? null : payload_arr[5],
      _co2: payload_arr[6] == "-" ? null : payload_arr[6],
      _so2: payload_arr[7] == "-" ? null : payload_arr[7],
    };
    return JSON.stringify(payload);
  } catch (e) {
    return JSON.stringify("");
  }
};
// * check incoming data for filter err data to db
const isValErr = (data: EnvironmentPrototypeSocket) => {
  try {
    let res = false;
    const check_max_sensor_val: any = {
      temp: 100,
      hum: 100,
      PM25: 500,
      PM10: 500,
      CO: 100,
      CO2: 1000,
      SO2: 500,
    };
    // console.log("IN CHECK",check_max_sensor_val[`temperature_celsius`])
    Object.keys(check_max_sensor_val).forEach((key, i) => {
      const chk: number = check_max_sensor_val[`${key}`];
      const val: number = data[key as keyof EnvironmentPrototypeSocket];
      if (val != null) {
        if (val > chk && val > -1) {
          res = true;
        }
      }
    });

    return res;
  } catch (error) {
    console.log(error);
    return true;
  }
};

let subscribeAllTopicAndSendWithSocketIO = async () => {
  const stations = await weatherStationController.getAllWeatherStationMQTT();
  const weather_stations = stations.map((data: any) => data.uuid);

  console.log(weather_stations);

  let client = MqttClient();
  client.on("connect", function () {
    console.log("Mqtt connection success");
  });
  client.subscribe("/adcm/smart-environment/#");
  client.on("message", async function (topic, message) {
    const arydata: Array<any> = [topic, message.toString()];
    // console.log(arydata);
    switch (
      arydata[0] // for check topic
    ) {
      case "/adcm/smart-environment/data":
        // console.log(arydata[1]);
        const _data = arydata[1];
        const value = isJsonString(_data)
          ? JSON.parse(_data)
          : JSON.parse(strArrToJson(_data));
        if (typeof value != "object" || value == null) {
          console.log(`INVALID VALUE : ${_data}`);
          break;
        }
        let data = new EnvironmentPrototypeSocket(value);
        // if(data['stationid'] == '2eaebab9-aa6b-11ec-8305-0242ac120002'){
        //     data = checkPrevRain(data);
        // }
        value.datetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if (last_datetime[`${data.stationid}`] != undefined) {
          const last_dt = moment(last_datetime[`${data.stationid}`]);
          const diff = moment(value.datetime).diff(last_dt);
          if (diff < time_period * 1000) {
            // console.log("DEBUG: Data too fast")
            return;
          } else {
            if (isValErr(data)) {
              console.log(`SENSOR ERROR ${value.datetime} : ${_data}`);
              return;
            } else {
              last_datetime[`${data.stationid}`] = value.datetime;
              // console.log(`/weather-station/${data['stationid']}/data`);
              io.emit(`/weather-station/${data["stationid"]}/data`, data);
              // console.log("SEND",last_datetime)
              return;
            }
          }
          // console.log("DEBUG: OK",last_datetime)
        } else {
          last_datetime[`${data.stationid}`] = value.datetime;
        }
    }
  });

  setInterval(async () => {
    weather_stations.map(async (uuid: string) => {
      const data = await weatherStationController.getWeatherStationAllPlace(
        uuid
      );

      client.publish("/adcm/smart-environment/station", JSON.stringify(data));
    });
  }, 5000);

  setInterval(function () {
    weather_stations.map(async (uuid: string) => {
      const wstation = await weatherStationController.getWeatherStation(uuid);

      if (wstation) {
        const weatherStation: WeatherStationPrototype = JSON.parse(wstation);
        await messageController.sendMQTTMessage(weatherStation);
      }
    });
  }, timeUntilNextHour());

  setInterval(function () {
    weather_stations.map(async (uuid: string) => {
      const wstation = await weatherStationController.getWeatherStation(uuid);

      if (wstation) {
        const weatherStation: WeatherStationPrototype = JSON.parse(wstation);
        await messageController.checkExpireMQTTMessage(weatherStation);
      }
    });
  }, timeUntilNextHour());
};

subscribeAllTopicAndSendWithSocketIO();

// Calculate the time until the next hour
const timeUntilNextHour = (): number => {
  const now = new Date();
  const nextHour = new Date(now);

  // Set nextHour to the start of the next hour
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);

  // Calculate the difference in milliseconds
  return nextHour.getTime() - now.getTime();
};

io.on("connection", (socket) => {
  console.log("user connect");
});

app.get("/", (req, res) => {
  res.send("Smart Environment Adc Microsystems");
});

app.get("/api/notify/", (req, res) => {
  const userId = req.query.state?.toString();
  const code = req.query.code?.toString();
  const error = req.query.error?.toString();
  const error_description = req.query.error_description?.toString();
  if (error != null || error != undefined) {
    res.send({
      state: userId,
      error: error,
      error_description: error_description,
      additional: {
        REQ: req,
        RES: res,
      },
    });
  }
  if (code != null || code != undefined) {
    AuthToNotify(req, code);
  }
  console.log("NOTI GET", userId, code);
  res.sendFile(__dirname + "/redirect/notify.html");
});

app.all("*", (req: Request, res: Response, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});
app.use(errorMiddleware);
httpServer.listen(port, () =>
  console.log(`🚀 Server running on port ${port}!`)
);

module.exports = app;
