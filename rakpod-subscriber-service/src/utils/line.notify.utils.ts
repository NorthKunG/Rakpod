import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import * as express from 'express';
import * as dotenv from "dotenv";
import notify_registryModel from "../models/notify_registry.model";
import { NotifyRegistryPrototype } from "../prototypes/notify_registry.prototype";
dotenv.config();

//https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=9aFOPLn2Zktf3pwW14H69Q&redirect_uri=https://api-envy.adcm.co.th/api/notify&scope=notify&state=warning
export const AuthToNotify = async (req: express.Request, code: string) => {
    const state_type: string[] = ["warning", "error", "offline"]
    const qState = !req.query.state ? null : req.query.state.toString()
    const noti_type: string = !qState ? "warning" : (state_type.includes(qState) ? qState : "warning")
    const urlToAuth: string = 'https://notify-bot.line.me/oauth/token'
    const AuthData: any = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://api-envy.adcm.co.th/api/notify',
        client_id: process.env.NOTICLIENTID,
        client_secret: process.env.NOTISECRETID,
    }

    const requestOption: AxiosRequestConfig = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(AuthData),
        url: urlToAuth,
    }
    try {
        const lineRes: any = await axios(requestOption);
        if (lineRes.status === 200) {
            // Save to Database
            console.log('Authentication Success')
            // console.log(lineRes.data)
            const accessToken: string = lineRes.data.access_token


            //////
            const status: any = await GetNotifyStatus(accessToken)
            if (status == undefined) {
                console.log("Invalid Access Token")
                return "Invalid Access Token"
            }
            else if (status == null) {
                console.log("Null Notify Target")
                return "Null Notify Target"
            }
            const chkToken: number = await checkAllInvalidToken(status.target, status.targetType)
            console.log("DEL INVALID TOKEN ", chkToken)

            const checkNotifyUser: any = await notify_registryModel.findOne({ target: status.target, targetType: status.targetType, notify_type: noti_type })
            console.log("CHECK NOTI USER : ", checkNotifyUser)
            const type_str: string = noti_type == "offline" ? "อุปกรณ์หยุดทำงาน" : noti_type == "error" ? "ข้อมูลผิดพลาด" : "มลพิษเกินเกณฑ์";
            if (checkNotifyUser) {
                const revoke = await RevokeNotify(accessToken);
                console.log("already register line token FORCE TO REVOKE")
                if (!revoke) {
                    console.log("REVOKE TOKEN FAILED")
                } else {
                    await notify_registryModel.delete(accessToken)
                    console.log("REVOKE TOKEN SUCCESS")
                    const msg: string = `ระบบได้มีการลงทะเบียนรับการแจ้งเตือน  : ${type_str} อยู่แล้ว\nสามารถจัดการระบบรับการแจ้งเตือนทั้งหมดได้ที่ https://notify-api.line.me/`
                    console.log("already register line token")
                    setTimeout(function () { NotifyToUser(msg, checkNotifyUser.acc_token) }, 3000);
                }
            } else {
                const tempInfoAdd = {
                    line_code_id: code,
                    acc_token: accessToken,
                    notify_type: noti_type,
                    target: status.target,
                    targetType: status.targetType,
                    is_active: 1
                }
                const register = await notify_registryModel.create(new NotifyRegistryPrototype(tempInfoAdd))
                const msg: string = `ยินดีต้อนรับสู่การแจ้งเตือนระบบตรวจวัดสภาพอากาศ : ${type_str}\nสามารถจัดการระบบรับการแจ้งเตือนทั้งหมดได้ที่ https://notify-api.line.me/`
                console.log("register line token success",register)
                NotifyToUser(msg, accessToken)

            }
        } else {
            console.log('Fail Server Authorized')
            // console.log(lineRes.data)
            return null
        }
    } catch (error) {
        console.log('Error On Request to Line OAuth')
        // console.error(error)
        return null
    }
}

export const NotifyToUser = async (msg: string, AccessCode: string) => {
    const urlToNotify: string = 'https://notify-api.line.me/api/notify'
    const Notifydata: any = {
        message: msg,
    }

    const requestOption: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ` + AccessCode,
        },
        data: qs.stringify(Notifydata),
        url: urlToNotify,
    }
    axios(requestOption)
        .then((axiosRes) => {
            if (axiosRes.status === 200) {
                console.log('Notification Success')
            }
        })
        .catch((error) => {
            console.log('Notification Failed')
            // console.log(error.response.data)


        })
}

export const GetNotifyStatus = async (AccessCode: string) => {
    try {
        const urlToNotify: string = 'https://notify-api.line.me/api/status'
        const requestOption: AxiosRequestConfig = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ` + AccessCode,
            },
            url: urlToNotify,
        }
        const axiosRes: any = await axios(requestOption)
        if (axiosRes.status === 200) {
            if (axiosRes.data["target"] == null) {
                return null
            }
            console.log(`Check Status of ${axiosRes.data["targetType"]}: ${axiosRes.data["target"]} Success`)
            return {
                target: axiosRes.data["target"],
                targetType: axiosRes.data["targetType"]
            }
        }
        else if (axiosRes.status === 401) {
            return
        }
    }
    catch (error) {
        console.log("Get status token failed")
        // console.log(error)
        return
    }

}

export const checkAllInvalidToken = async (target: string, targetType: string) => {
    try {
        let deleted: number = 0
        const checkToken: any[] = await notify_registryModel.find({ target: target, targetType: targetType })
        if (!checkToken.length) {
            console.log("registed token not found")
        }
        for (let i in checkToken) {
            const status = await GetNotifyStatus(checkToken[i].acc_token)
            if (status == null || status == undefined) {
                const del: number = await notify_registryModel.delete(checkToken[i].acc_token)
                console.log(`del token for : ${target} , ${del}`)
                deleted += del
            }
        }
        return deleted
    } catch (error) {
        console.log("Check Invalid token failed")
        // console.log(error)
        return 0
    }
}

export const RevokeNotify = async (AccessCode: string) => {
    try {
        const urlToNotify: string = 'https://notify-api.line.me/api/revoke'
        const requestOption: AxiosRequestConfig = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ` + AccessCode,
            },
            url: urlToNotify,
        }
        const axiosRes: any = await axios(requestOption)
        if (axiosRes.status === 200) {
            console.log('Notification Access Code Revoke Success')
            return true
        }
        return false
    } catch (error) {
        console.log("Revoke token failed")
        // console.log(error)
        return false
    }
}