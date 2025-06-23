// models
import WeatherStationModel from "../models/weatherStation.model";
import EnvironmentModel from "../models/environment.model";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

// เพิ่มตัวแปรสำหรับเก็บ instance ของ Socket.IO server
let io: Server;


dotenv.config();

// prototypes
import {
  EnvironmentPrototypeDB,
  EnvironmentPrototype,
} from "../prototype/environment.prototype";
import moment from "moment";
import cron from "node-cron";
import notifyUtil from "../utils/notify.util";
import { postLineNotify } from "../utils/axios.util";
import notifyRegistryModel from "../models/notifyRegistry.model";
import axios from "axios";
import { card, template } from "../utils/template";
import { SendBroadcast } from "../utils/line.broadcast.util";
import { IMqttData } from "../prototype/mqtt-data.prototype";


let last_datetime: any = {};
// let prev_12rain: any = {}
// let curr_rain: any = {}
// let diff_rain = 0
const time_period: number = !process.env.DATA_TIME_PERIOD_SEC
  ? 10
  : parseInt(process.env.DATA_TIME_PERIOD_SEC); // * insert data every 10 second edit in env
class StoreDataController {
  constructor() {
    this.checkStatusOfWeatherStation();
    this.setCronJobRunFunction();
  }
  // เพิ่มฟังก์ชัน initSocketIO รับ io instance จากภายนอก
  initSocketIO = (socketIo: any) => {
    io = socketIo;
    console.log("Socket.IO initialized in StoreDataController");
  }

  setCronJobRunFunction = async () => {
    console.log("set cronjob running a task every 4 minute");
    cron.schedule("*/4 * * * *", async () => {
      this.checkStatusOfWeatherStation();
    });

    // cron.schedule("*/5 * * * *", async () => {
    //   // get and clear warning data
    //   this.sendNotify(false);
    // });

    cron.schedule("0 * * * *", async () => {
      // get and clear err data
      // this.sendNotify(true);
      this.sendNotifyAQI();
      this.sendBroadcastAQI();
    });

    // cron.schedule("* * * * *", async () => {
    //   // get and clear err data
    //   // this.sendNotify(true);
    //   this.sendBroadcastAQI();
    // });

    // cron.schedule("* * * * *", async () => {
    //   // get and clear err data
    //   this.sendNotifyAQI();
    // });
  };

  // * check incoming data for filter err data to db
  isValErr = async (data: any) => {
    try {
      let res = { isErr: false, type: "-" };
      const map = new EnvironmentPrototypeDB(data);
      const check_max_sensor_val: any = {
        temperature_celsius: 100,
        humidity_percent: 100,
        pm25_microgram_per_cubicmeter: 500,
        pm10_microgram_per_cubicmeter: 500,
        CO_ppm: 100,
        CO2_ppm: 1000,
        SO2_ppb: 500,
      };
      // console.log("IN CHECK",check_max_sensor_val[`temperature_celsius`])
      Object.keys(check_max_sensor_val).forEach((key, i) => {
        const chk: number = check_max_sensor_val[`${key}`];
        let val: number | string = map[key as keyof EnvironmentPrototypeDB];
        // console.log(chk<val)
        if (key == "CO2_ppm") {
          if (val != null) {
            if (typeof val === 'number' && val > 1000) {
              val = 0;
            }
          }
        }
        if (typeof val === 'number' && val != null) {
          if (val > chk && val > -1 && val != 226) {
            res = { isErr: true, type: "over" };
          } else if (val < 0) {
            res = { isErr: true, type: "minus" };
          } else if (val == 226) {
            res = { isErr: true, type: "226" };
          }
        }
      });

      return res;
    } catch (error) {
      console.log(error);
      return { isErr: true, type: "err" };
    }
  };
  store = async (data: string) => {
    try {
      let environmentDataPrototype = new EnvironmentPrototypeDB();
      // data payload
      // {"uuid":"jGmVGPqcZKlXt8ppagBT",
      // "temp":34.35,"hum":34,"pm2_5":100,"pm10":150,"uv":20,"light":1500,"win_dir":150,"win_sp":34,"co":100,"co2":70,"rain":34}"
      const isJson = this.isJsonString(data);
      var value: IMqttData = isJson
        ? JSON.parse(data)
        : JSON.parse(this.strArrToJson(data));
      const weatherStation_uuid = value.nickname;
      // check device valid
      const weatherStation = await WeatherStationModel.findOne({
        uuid: weatherStation_uuid,
      });
      if (!weatherStation) {
        console.log("invalid weather station uuid");
        return;
      }
      value.stationid = weatherStation.id;
      value.datetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      console.log("value", value);
      environmentDataPrototype = new EnvironmentPrototypeDB(value);
      console.log("environmentDataPrototype", environmentDataPrototype);
      const result = await EnvironmentModel.create(environmentDataPrototype);
      if (!result) {
        console.log(500, "Something went wrong");
        return;
      }

      // ส่งข้อมูลผ่าน Socket.IO ตรงนี้หลังจากบันทึกข้อมูลลง DB สำเร็จ
      if (io) {
        // สร้าง object สำหรับส่งข้อมูลผ่าน socket ตามโครงสร้างที่ถูกต้อง
        const socketData = {
          datetime: value.datetime,
          temp: value.d?.temperature || 0,
          hum: value.d?.humidity || 0,
          PM25: value.d?.pm2_5 || 0,
          PM10: value.d?.pm10 || 0,
          PM1: value.d?.pm1 || 0,
          O3: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          CO: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          NO2: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          SO2: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          CO2: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          windSp: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          windDr: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          rain: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          UV: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          light: 0, // ไม่มีข้อมูลนี้ในโครงสร้าง
          rssi: value.rssi || 0,
          nickname: value.nickname || ""
        };

        // ส่งข้อมูลผ่าน Socket.IO event ตาม device ID
        const eventName = `/weather-station/${weatherStation.uuid}/data`;
        io.emit(eventName, socketData);
        console.log(`Socket.IO: Emitted data to ${eventName}`);
      }

      //check for update weather station to online
      if (weatherStation.status == "offline") {
        const updateResult = await WeatherStationModel.update(
          { status: "online" },
          environmentDataPrototype.wstation_id
        );
        if (!updateResult) {
          console.log("Something went wrong");
          return;
        }
        const { affectedRows, changedRows, info } = updateResult;

        const message = !affectedRows
          ? "Weather Station not found"
          : affectedRows && changedRows
            ? "Weather Station updated successfully"
            : "Updated faild";
        if (message != "Weather Station updated successfully") {
          console.log(message);
        }
      }
      // console.log(
      //     `ADC Microsystems : Smart Environment ==> station uuid : ${weatherStation.uuid} name : ${weatherStation.name} a record inserted`
      // );
      return;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  checkStatusOfWeatherStation = async () => {
    try {
      console.log("check status of weather station");
      const weatherStationArr = await WeatherStationModel.find();
      const weatherRecordArr: Array<{ wstation_id: number; record: number }> =
        await WeatherStationModel.findAllWeatherStationRecord();
      for (let i in weatherStationArr) {
        const weatherStation = weatherRecordArr.find(function (post, index) {
          if (post.wstation_id == weatherStationArr[i].id) return true;
        });
        if (!weatherStation) {
          const updateResult =
            await WeatherStationModel.updateStationWhenOffline(
              weatherStationArr[i].id
            );
          if (!updateResult) {
            console.log("Something went wrong");
            return;
          }
          // console.log(updateResult)
          const { affectedRows, changedRows, info } = updateResult;
          const message = !affectedRows
            ? "Weather Station not found"
            : affectedRows && changedRows
              ? "Weather Station updated successfully"
              : "Updated faild because updated";
          if (message != "Weather Station updated successfully") {
            // console.log(message);
          }
          if (affectedRows && changedRows) {
            console.log("SENSOR OFFLINE : ", weatherStationArr[i].name);
            const link_to: string = `https://envy.adcm.co.th/device`;
            const gMap: string = `https://www.google.com/maps/place/`;
            const lat_ws = weatherStationArr[i].location_latitude;
            const long_ws = weatherStationArr[i].location_longitude;
            const msg = {
              header: `\nแจ้งเตือนอุปกรณ์หยุดทำงาน ณ เวลา ${moment(
                new Date()
              ).format("HH:mm:ss DD-MM-YYYY")}`,
              stationName: `\nสถานี : ${weatherStationArr[i].name} `,
              link_to_page: `\nเพิ่มเติม : ${link_to}/${weatherStationArr[i].uuid}`,
              link_to_map: `\nแผนที่ : ${gMap}${lat_ws}+${long_ws}/@${lat_ws},${long_ws},17.5z`,
            };
            const message =
              msg.header + msg.stationName + msg.link_to_page + msg.link_to_map;
            const TokenList: any[] = await notifyRegistryModel.find({
              notify_type: "offline",
            });
            console.log("offline token", TokenList.length);
            await postLineNotify(TokenList, message);
            console.log("NOTIFY OFFLINE");
          }
        }
      }
      return;
    } catch (e) {
      console.log(e);
      return;
    }
  };

  sendNotify = async (isErrData: boolean) => {
    try {
      console.log(
        `SEND ${isErrData ? "ERROR" : "WARNING"} NOTIFY -------------->`
      );
      const log = notifyUtil.getLogNotify(isErrData);
      console.log("LOG", log);
      const prefix_msg: string = !isErrData
        ? "แจ้งเตือนคุณภาพอากาศ"
        : "แจ้งเตือนอุปกรณ์วัดข้อมูลผิดพลาด";
      const link_to: string = `https://envy.adcm.co.th/device`;
      const gMap: string = `https://www.google.com/maps/place/`;
      const datetime: string = moment(new Date()).format("HH:mm:ss DD-MM-YYYY");
      for (let i in log) {
        const obj = log[i];
        const weatherStation = await WeatherStationModel.findOne({
          uuid: obj.uuid,
        });
        if (!weatherStation) {
          continue;
        }
        const lat_ws = weatherStation.location_latitude;
        const long_ws = weatherStation.location_longitude;
        if (isErrData) {
          const msg = {
            header: `\n${prefix_msg} ณ เวลา ${datetime} `,
            stationName: `\nสถานี : ${weatherStation.name} `,
            content: `\nส่งข้อมูลผิดพลาดสะสมตลอด 1 ชั่วโมง : ${obj.err} ข้อมูล `,
            // link_to_page: `\nเพิ่มเติม : ${link_to}/${obj.uuid}`
            link_to_map: `\nแผนที่ : ${gMap}${lat_ws}+${long_ws}/@${lat_ws},${long_ws},17.5z`,
          };
          const message =
            msg.header + msg.stationName + msg.content + msg.link_to_map; //+msg.link_to_page;
          const TokenList: any[] = await notifyRegistryModel.find({
            notify_type: "error",
          });
          console.log("error token", TokenList.length);
          await postLineNotify(TokenList, message);
          console.log("NOTIFY ERROR");
        } else {
          let sensor_detail: string = "";
          obj.sensor.forEach((s: any) => {
            sensor_detail += `\nค่า ${s.sensor} วัดได้ : ${s.value}`;
          });
          console.log("SENSOR", sensor_detail);
          const msg = {
            header: `\n${prefix_msg} ณ เวลา ${datetime} `,
            stationName: `\nสถานี : ${weatherStation.name} `,
            content: `\nค่าสภาพอากาศเกิน เกณฑ์${obj.type == "standard" ? "มาตรฐาน" : "อันตราย"
              } ช่วง 5 นาทีล่าสุด `,
            content2: sensor_detail,
            link_to_page: `\nเพิ่มเติม : ${link_to}/${obj.uuid}`,
            // link_to_map: `\nแผนที่ : ${gMap}${lat_ws}+${long_ws}/@${lat_ws},${long_ws},17.5z`
          };
          const message =
            msg.header +
            msg.stationName +
            msg.content +
            msg.content2 +
            msg.link_to_page; // + msg.link_to_map;
          const TokenList: any[] = await notifyRegistryModel.find({
            notify_type: "warning",
          });
          console.log("warning token", TokenList.length);
          await postLineNotify(TokenList, message);
          console.log("NOTIFY WARNING");
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  isJsonString = (JStr: string) => {
    try {
      JSON.parse(JStr);
    } catch (e) {
      return false;
    }
    return true;
  };

  strArrToJson = (strArr: string) => {
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
        _pm2_5:
          payload_arr[3] == "-" ? null : Math.abs(parseInt(payload_arr[3])),
        _pm10:
          payload_arr[4] == "-" ? null : Math.abs(parseInt(payload_arr[4])),
        _co: payload_arr[5] == "-" ? null : payload_arr[5],
        _co2: payload_arr[6] == "-" ? null : payload_arr[6],
        _so2: payload_arr[7] == "-" ? null : payload_arr[7],
      };
      return JSON.stringify(payload);
    } catch (e) {
      return JSON.stringify("");
    }
  };

  sendNotifyAQI = async () => {
    try {
      const prefix_msg: string = "แจ้งเตือนคุณภาพอากาศ";
      const link_to: string = `https://huangpod.adcm.co.th/device`;
      const gMap: string = `https://www.google.com/maps/place/`;
      const datetime: string = moment(new Date()).format("HH:mm:ss DD-MM-YYYY");

      const weatherStation = await WeatherStationModel.find({
        status: "online",
      });

      let msg: string = "";

      for (let index = 0; index < weatherStation.length; index++) {
        const element = weatherStation[index];

        if (element.uuid === "2eaebab9-aa6b-11ec-8305-0242ac120002") continue;

        const environment = await this.getEnvironmentOfWeatherStation(
          element.uuid
        );
        const data = await this.checkLengthAQI(environment);

        const _msg = {
          header: `\n${prefix_msg} เวลา ${datetime} `,
          stationName: `\nสถานี : ${element.name} `,
          content: `\nค่าสภาพอากาศ AQI : ${environment.environmentInformation.aqi.AQI.aqi} (Level : ${data.aqi_level} ${data.station_status}) `,
          suggest: `\nแนะนำ : ${data.suggest}`,
          link_to_page: `\nเพิ่มเติม : ${link_to}/${element.uuid}`,
        };

        msg +=
          _msg.header +
          _msg.stationName +
          _msg.content +
          _msg.suggest +
          _msg.link_to_page +
          "\n";
      }
      const TokenList: any[] = await notifyRegistryModel.find({
        notify_type: "warning",
      });

      await postLineNotify(TokenList, msg);
      await SendBroadcast(
        msg,
        "3vemXQp7hqfNHP6Y/dDR01dz/blfKlvz64E7rfA4JBjEuoifvq67OiuNEd1qavrmNJU51aaM0GUwWUnmY/PbggQScI1HumQMd/9IdigtaOlZU6Pjk9p4pDhq1Unh7Ft134+FC0CQ/2gEog4B8DPorgdB04t89/1O/w1cDnyilFU="
      );
    } catch (e) {
      console.log(e);
      return;
    }
  };

  sendBroadcastAQI = async () => {
    try {
      const prefix_msg: string = "แจ้งเตือนคุณภาพอากาศ";
      const link_to: string = `https://huangpod.adcm.co.th/device`;
      const datetime: string = moment(new Date()).format("HH:mm:ss DD-MM-YYYY");

      const weatherStation = await WeatherStationModel.find({
        status: "online",
      });

      let msg: Array<any> = [];

      for (let index = 0; index < weatherStation.length; index++) {
        const element = weatherStation[index];

        if (element.uuid === "2eaebab9-aa6b-11ec-8305-0242ac120002") continue;

        const environment = await this.getEnvironmentOfWeatherStation(
          element.uuid
        );

        console.log(environment.name);

        const data = await this.checkLengthAQI(environment);

        const flexCard = card(
          data.aqi_img,
          data.aqi_level,
          data.color,
          data.station_status,
          data.suggest,
          element.name
        );
        msg.push(flexCard);
      }

      await SendBroadcast(
        msg,
        "3vemXQp7hqfNHP6Y/dDR01dz/blfKlvz64E7rfA4JBjEuoifvq67OiuNEd1qavrmNJU51aaM0GUwWUnmY/PbggQScI1HumQMd/9IdigtaOlZU6Pjk9p4pDhq1Unh7Ft134+FC0CQ/2gEog4B8DPorgdB04t89/1O/w1cDnyilFU="
      );
    } catch (e) {
      console.log(e);
      return;
    }
  };

  sendBroadcastAQINow = async () => {
    try {
      const weatherStation = await WeatherStationModel.find({
        status: "online",
      });

      let msg: Array<any> = [];

      for (let index = 0; index < weatherStation.length; index++) {
        const element = weatherStation[index];

        if (element.uuid === "2eaebab9-aa6b-11ec-8305-0242ac120002") continue;

        const environment = await this.getEnvironmentOfWeatherStation(
          element.uuid
        );

        const data = await this.checkLengthAQI(environment);

        const flexCard = card(
          data.aqi_img,
          data.aqi_level,
          data.color,
          data.station_status,
          data.suggest,
          element.name
        );
        msg.push(flexCard);
      }

      await SendBroadcast(
        msg,
        "H5R4XyPeNV1kMNMzrHZfzwH3gZ00eYr8xb6ZHdcjMt2Nwp+20HNEmJ9VbCng55T98djtLmKTubTyTQsnxhnxK/uuvmCfhVkMlQquPkmuipAPUwyg8SVj2M8Kzpuc32Rhh4dvCdszWdBk3gQt1XM3yAdB04t89/1O/w1cDnyilFU="
      );
    } catch (e) {
      console.log(e);
      return;
    }
  };

  getEnvironmentOfWeatherStation = async (stationid: string) => {
    try {
      const weather = await axios({
        method: "get",
        url: `https://api-envy.adcm.co.th/weather-station/id/${stationid}`,
      });
      return weather.data.data;
    } catch (error) {
      console.log("Weather-station", error);
      return null;
    }
  };

  checkLengthAQI = (data: any) => {
    const aqi_level = data.environmentInformation.aqi.AQI.Level;
    const aqi = data.environmentInformation.aqi.AQI.aqi;
    let color = "#47b5ff";
    let suggest = "อากาศดีมากแบบนี้ น่าจะออกไปเดินเล่นนอกบ้านนะคะ";
    let station_status = "ดีมาก";
    let img =
      "https://api-envy.adcm.co.th/environment/image/Sky.jpg";

    if (aqi_level === 2) {
      suggest = "อากาศดี แจ่มใส สามารถทำกิจกรรมได้ค่ะ";
      color = "#82cd47";
      station_status = "ดี";
      img =
        "https://api-envy.adcm.co.th/environment/image/Green.jpg";
    } else if (aqi_level === 3) {
      suggest = "อากาศยังปกติ สามารถทำกิจกรรมได้ค่ะ";
      color = "#e7d300";
      station_status = "ปานกลาง";
      img =
        "https://api-envy.adcm.co.th/environment/image/Yellow.jpg";
    } else if (aqi_level === 4) {
      suggest = "ควรงดกิจกรรมกลางแจ้ง และสวมหน้ากากป้องกัน";
      color = "#fd841f";
      station_status = "เริ่มมีผลต่อสุขภาพ";
      img =
        "https://api-envy.adcm.co.th/environment/image/Orange.jpg";
    } else if (aqi_level === 5) {
      suggest = "หลีกเลี่ยงการทำกิจกรรมภายนอก และควรสวมใส่หน้ากาก N95";
      color = "#e64848";
      station_status = "มีผลต่อสุขภาพ";
      img =
        "https://api-envy.adcm.co.th/environment/image/Red1.jpg";
    }

    data.aqi_img = img;
    data.station_status = station_status;
    data.color = color;
    data.suggest = suggest;
    data.aqi_level = aqi.toString();

    return data;
  };
}

export default new StoreDataController();
