import * as express from "express";
import MessageModel from "../models/message.model";
import {
  MessagePrototype,
  MessagePrototypeDB,
} from "../prototypes/message.prototype";
import HttpException from "../utils/HttpException.utils";
import WeatherStationModel from "../models/weatherStation.model";
import { sendMessageMQTT } from "../utils/message.utils";
import {
  WeatherStationPrototype,
  WeatherStationPrototypeDB,
} from "../prototypes/weatherStation.prototype";
import weatherStationController from "./weatherStation.controller";

class MessageController {
  getAllMessage = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const messageArr = await MessageModel.find();

    let messageArrPrototype: Array<any> = [];
    for (let i in messageArr) {
      let message = new MessagePrototype(messageArr[i]);
      message.station = await WeatherStationModel.findOne({
        id: messageArr[i].wstation,
      });
      messageArrPrototype.push(message);
    }

    res.status(200).send({
      type: "success",
      status: 200,
      massage: "All Weather Station",
      results: messageArrPrototype.length,
      data: messageArrPrototype,
    });
  };

  createMessage = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const body = req.body;
    const messagePrototypeBody = new MessagePrototypeDB(body);

    console.log(messagePrototypeBody);

    let result: any = await MessageModel.create(messagePrototypeBody);
    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    let station = await WeatherStationModel.findOne({ id: body.wstation });
    if (!station) {
      throw new HttpException(404, "Weather Station not found");
    }

    const wstation = await weatherStationController.getWeatherStation(
      station.uuid
    );

    if (wstation) {
      const weatherStation: WeatherStationPrototype = JSON.parse(wstation);
      await this.sendMQTTMessage(weatherStation);
    }

    res.status(201).send({
      type: "success",
      status: 201,
      massage: "Weather Station was created",
    });
  };

  sendMQTTMessage = async (station: WeatherStationPrototype) => {
    const wstation = await WeatherStationModel.findOne({
      uuid: station.stationid,
    });

    const message = await MessageModel.findOneLastMessage({
      wstation: wstation.id,
    });

    if (!message) return;

    await sendMessageMQTT({
      message: {
        title: message["message"]["title"],
        text: JSON.parse(message["message"])["text"],
      },
      station: {
        stationuuid: station.stationid,
        name: station.name,
      },
    });

    if (message["status"] != "Preocessing") {
      await MessageModel.update(
        {
          status: "Processing",
        },
        message.uuid
      );
    }
  };

  checkExpireMQTTMessage = async (station: WeatherStationPrototype) => {
    const wstation = await WeatherStationModel.findOne({
      uuid: station.stationid,
    });

    const messages = await MessageModel.findCheckExpireMessage({
      wstation: wstation.id,
    });

    if (!messages) return;

    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
      console.log(message);
      await MessageModel.update(
        {
          status: "Expire",
        },
        message.uuid
      );
    }
  };

  getAllStation = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const wstation =
      await weatherStationController.getAllWeatherStationForMessage();

    res.status(200).send({
      type: "success",
      status: 200,
      massage: "All Weather Station",
      results: wstation.length,
      data: wstation,
    });
  };
}

export default new MessageController();
