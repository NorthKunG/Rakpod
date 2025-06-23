// import fs from 'fs'
// var aqi_file = JSON.parse(fs.readFileSync('../config/aqi_envy.json', 'utf-8'))
import { EnvironmentPrototype } from "../prototype/environment.prototype";
import * as dotenv from "dotenv";
dotenv.config();

const aqi_file:any = {
    "aqi": {
        "standard": {
            "PM25": 37.6,
            "PM10": 121,
            "O3": 71,
            "CO": 9.1,
            "NO2": 171,
            "SO2": 301
        },
        "danger" : {
            "PM25": 75.1,
            "PM10": 181,
            "O3": 121,
            "CO": 30.1,
            "NO2": 341,
            "SO2": 401
        }
    }
}
let err_data_log:any = {}
let warning_data_log:any = {}
/*
 ! warning prototype
uuid : {
        "PM25": 0,
        "PM10": 0,
        "O3": 0,
        "CO": 0,
        "NO2": 0,
        "SO2": 0,
        "count": 0
    }

 ! err prototype
uuid : {
    sum_err: 0
    over: 0
    minus: 0

    }
*/
class NotifyUtil {
    /*
        data : {
            uuid : uuid number,
            sensor : {
                "PM25": 0,
                "PM10": 0,
                "O3": 0,
                "CO": 0,
                "NO2": 0,
                "SO2": 0,
            },
            err : over,minus
        }
    */


    setLogNotify = (data: any, err: any) => {
        // console.log("SET DATA",data,warning_data_log)
        let isErr: boolean = false
        if (data != null && data._uuid != null) {
            let notify_data = new EnvironmentPrototype(data);
            if (err == "over" || err == "minus") {
                notify_data.err = err
                isErr = true;
            }
            // console.log(notify_data)
            this.setData(notify_data, isErr);
            // console.log(notify_data)
        }

    }

    getLogNotify = (isErrData: boolean) => {
        const log = this.getData(isErrData);
        const uuidList: string[] = Object.keys(log)

        const summary_log: Array<any> = []
        if (isErrData) {
            uuidList.forEach((uuid: string) => {
                if (log[`${uuid}`].sum_err > 0) {
                    summary_log.push({
                        uuid: uuid,
                        err: log[uuid].sum_err
                    })
                }
            })
        } else {
            uuidList.forEach((uuid: string) => {
                if (log[uuid].count > 0) {
                    const compare:any = this.compareWarning(log[uuid])
                    if(!compare){
                        return
                    }
                    compare["uuid"] = uuid
                    summary_log.push(compare)
                }
            })
        }
        this.clearData(isErrData)
        return summary_log;
    }

    clearData = (isErrData: boolean) => {
        if(isErrData){
            err_data_log = {}
        } else{
            warning_data_log = {}
        }
    }

    getData = (isErrData: boolean) => {
        return isErrData ? err_data_log : warning_data_log
    }

    setData = (data: any, isErr: boolean) => {
        if (isErr) {
            if (!this.isExist(data.uuid, err_data_log)) {
                let storePrototype: any = {
                    sum_err: 0,
                    over: 0,
                    minus: 0
                }
                err_data_log[`${data.uuid}`] = storePrototype
            }
            if (data.err != null || data.err != undefined) {
                err_data_log[`${data.uuid}`][`${data.err}`] += 1;
                err_data_log[`${data.uuid}`].sum_err += 1;
            }

        } else {
            if (!this.isExist(data.uuid, warning_data_log)) {
                let storePrototype: any = data.sensor
                storePrototype.count = 1
                warning_data_log[`${data.uuid}`] = storePrototype
            }
            if (data.sensor != null || data.sensor != undefined) {
                let sum_sensor: any = this.sumObjectSameKey(warning_data_log[`${data.uuid}`], data.sensor)

                warning_data_log[`${data.uuid}`] = sum_sensor
                warning_data_log[`${data.uuid}`].count += 1
            }

        }
    }

    isExist = (uuid: string, target: any) => {
        if(Object.keys(target).length == 0){
            return false
        }
        return Object.keys(target).includes(uuid)
    }
    sumObjectSameKey = (src: any, data: any) => {
        let sum = src;

        Object.keys(data).forEach(key => {
            if (src.hasOwnProperty(key)) {
                sum[key] = parseFloat(src[key]) + parseFloat(data[key])
            } else {
                sum[key] = parseFloat(data[key])
            }
        })
        return sum;
    }

    compareWarning = (warningData: any) => {
        const ref = aqi_file.aqi
        const isDanger = process.env.IS_DANGER == "1" ? true : false;
        const refAqi = isDanger ? ref["danger"] : ref["standard"]

        let warning:Array<any> = []
        Object.keys(warningData).forEach((key:string) => {
            if (refAqi.hasOwnProperty(key)) {
                // console.log("TEST",warningData[key],warningData.count)
                const avg_warning:number = parseFloat(warningData[key]) / parseFloat(warningData.count)
                if(avg_warning > refAqi[key]){
                    warning.push({
                        sensor: key,
                        value: avg_warning.toFixed(2)
                    })
                }
            }
        })
        if(!warning.length){
            return
        }
        return {
            type: isDanger ? "danger" : "standard",
            sensor: warning
        }
    }




}

export default new NotifyUtil();