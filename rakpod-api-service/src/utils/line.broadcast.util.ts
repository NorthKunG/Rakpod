import axios, { AxiosRequestConfig } from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export const SendBroadcast = async (msg: any, ChannelAccessToken: string) => {
    const urlToBroadcast: string = 'https://api.line.me/v2/bot/message/broadcast'
    const BroadcastData: any = msg

    const requestOption: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${ChannelAccessToken}`,
        },
        data: {
            messages: BroadcastData
        },
        url: urlToBroadcast,
    }
    axios(requestOption)
        .then((axiosRes) => {
            if (axiosRes.status === 200) {
                console.log('Send Broadcast Success')
            }
        })
        .catch((error) => {
            console.log('Send Broadcast Failed', error.message)
            // console.log(error.response.data)


        })
}