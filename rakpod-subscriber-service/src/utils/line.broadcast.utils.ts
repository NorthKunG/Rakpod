import * as express from "express";
import axios, { AxiosRequestConfig } from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export const SendBroadcast = async (
  msg: any,
  ChannelAccessToken: string,
  res: express.Response
) => {
  const urlToBroadcast: string = "https://api.line.me/v2/bot/message/broadcast";
  const BroadcastData: any = msg;

  const requestOption: AxiosRequestConfig = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ChannelAccessToken}`,
    },
    data: {
      messages: BroadcastData,
    },
    url: urlToBroadcast,
  };
  axios(requestOption)
    .then((axiosRes) => {
      if (axiosRes.status === 200) {
        console.log("Send Broadcast Success");

        res.status(200).send({
          type: "success",
          status: 200,
          massage: "Sent Broadcast Successfully",
        });
      }
    })
    .catch((error) => {
      console.log("Send Broadcast Failed", error.message);
      res.status(404).send({
        type: "error",
        status: 200,
        massage: error.message,
      });
    });
};
