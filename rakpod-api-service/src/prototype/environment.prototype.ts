class EnvironmentPrototypeDB {
    datetime: string;
    temperature_celsius: number;
    humidity_percent: number;
    pm1_microgram_per_cubicmeter: number;
    pm25_microgram_per_cubicmeter: number;
    pm10_microgram_per_cubicmeter: number;
    O3_ppb: number;
    CO_ppm: number;
    NO2_ppb: number;
    SO2_ppb: number;
    CO2_ppm: number;
    wind_speed_kmph: number;
    wind_direction_degree: number;
    rain_gauge_mm: number;
    light_lux: number;
    UV_watt_per_squaremeter: number;
    wstation_id: number;
    currentEnvironment: any;

    constructor(data?: any) {
        this.datetime = data?.['datetime'] || null
        this.temperature_celsius = data?.['d']?.['temperature'] == null || data?.['d']?.['temperature'] == undefined ? null : data?.['d']?.['temperature']
        this.humidity_percent = data?.['d']?.['humidity'] == null || data?.['d']?.['humidity'] == undefined ? null : data?.['d']?.['humidity']
        this.pm1_microgram_per_cubicmeter = data?.['d']?.['pm1'] == null || data?.['d']?.['pm1'] == undefined ? null : data?.['d']?.['pm1']
        this.pm25_microgram_per_cubicmeter = data?.['d']?.['pm2_5'] == null || data?.['d']?.['pm2_5'] == undefined ? null : data?.['d']?.['pm2_5']
        this.pm10_microgram_per_cubicmeter = data?.['d']?.['pm10'] == null || data?.['d']?.['pm10'] == undefined ? null : data?.['d']?.['pm10']
        this.O3_ppb = data?.['_o3'] == null || data?.['_o3'] == undefined ? null : data?.['_o3']
        this.CO_ppm = data?.['_co'] == null || data?.['_co'] == undefined ? null : data?.['_co']
        this.NO2_ppb = data?.['_no2'] == null || data?.['_no2'] == undefined ? null : data?.['_no2']
        this.SO2_ppb = data?.['_so2'] == null || data?.['_so2'] == undefined ? null : data?.['_so2']
        this.CO2_ppm = data?.['_co2'] == null || data?.['_co2'] == undefined ? null : data?.['_co2']
        this.wind_direction_degree = data?.['_win_dir'] == null || data?.['_win_dir'] == undefined ? null : data?.['_win_dir']
        this.wind_speed_kmph = data?.['_win_sp'] == null || data?.['_win_sp'] == undefined ? null : data?.['_win_sp']
        this.rain_gauge_mm = data?.['_rain'] == null || data?.['_rain'] == undefined ? null : data?.['_rain']
        this.light_lux = data?.['_light'] == null || data?.['_light'] == undefined ? null : data?.['_light']
        this.UV_watt_per_squaremeter = data?.['_uv'] == null || data?.['_uv'] == undefined ? null : data?.['_uv']
        this.wstation_id = data?.['stationid'] || null
    }
}




interface EnvironmentPrototype {
    uuid: string
    sensor: SENSOR
    err: string
}
interface SENSOR {
    temp: any
    hum: any
    PM1: any
    PM25: any
    PM10: any
    O3: any
    CO: any
    NO2: any
    SO2: any
    CO2: any
    windDr: any
    windSp: any
    rain: any
    light: any
    UV: any
}
class EnvironmentPrototype {
    constructor(data: any) {
        this.uuid = data['_uuid'] == null || data['_uuid'] == undefined ? null : data['_uuid']
        this.sensor = {
            temp: data['_temp'] == null || data['_temp'] == undefined ? null : data['_temp'],
            hum: data['_hum'] == null || data['_hum'] == undefined ? null : data['_hum'],
            PM1: data['_pm1'] == null || data['_pm1'] == undefined ? null : data['_pm1'],
            PM25: data['_pm2_5'] == null || data['_pm2_5'] == undefined ? null : data['_pm2_5'],
            PM10: data['_pm10'] == null || data['_pm10'] == undefined ? null : data['_pm10'],
            O3: data['_o3'] == null || data['_o3'] == undefined ? null : data['_o3'],
            CO: data['_co'] == null || data['_co'] == undefined ? null : data['_co'],
            NO2: data['_no2'] == null || data['_no2'] == undefined ? null : data['_no2'],
            SO2: data['_so2'] == null || data['_so2'] == undefined ? null : data['_so2'],
            CO2: data['_co2'] == null || data['_co2'] == undefined ? null : data['_co2'],
            windDr: data['_win_dir'] == null || data['_win_dir'] == undefined ? null : data['_win_dir'],
            windSp: data['_win_sp'] == null || data['_win_sp'] == undefined ? null : data['_win_sp'],
            rain: data['_rain'] == null || data['_rain'] == undefined ? null : data['_rain'],
            light: data['_light'] == null || data['_light'] == undefined ? null : data['_light'],
            UV: data['_uv'] == null || data['_uv'] == undefined ? null : data['_uv'],
        }


    }
}


export { EnvironmentPrototypeDB, EnvironmentPrototype }