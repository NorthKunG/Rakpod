import moment from 'moment';

class EnvironmentPrototype {
    datetime: string
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
    constructor(data: any) {
        this.datetime = data['hour'] == undefined ? data['datetime']
            : data['type'] == "onedate" ? moment(data['datetime']).set({ hour: data['hour'] }).format('yyyy-MM-DD HH:00:00')
                : moment(data['datetime']).set({ hour: data['hour'] + 1 }).format('yyyy-MM-DD HH:00:00')
        this.temp = data['temperature_celsius'] == null || data['temperature_celsius'] == undefined
            ? null
            : Math.round(data['temperature_celsius'] * 100) / 100;
        this.hum = data['humidity_percent'] == null || data['humidity_percent'] == undefined
            ? null
            : Math.round(data['humidity_percent'] * 100) / 100;
        this.PM1 = data['pm1_microgram_per_cubicmeter'] == null || data['pm1_microgram_per_cubicmeter'] == undefined
            ? null
            : Math.abs(Math.round(data['pm1_microgram_per_cubicmeter'] * 100) / 100);
        this.PM25 = data['pm25_microgram_per_cubicmeter'] == null || data['pm25_microgram_per_cubicmeter'] == undefined
            ? null
            : Math.abs(Math.round(data['pm25_microgram_per_cubicmeter']* 100) / 100);
        this.PM10 = data['pm10_microgram_per_cubicmeter'] == null || data['pm10_microgram_per_cubicmeter'] == undefined
            ? null
            : Math.round(data['pm10_microgram_per_cubicmeter']* 100) / 100;
        this.O3 = data['O3_ppb'] == null || data['O3_ppb'] == undefined
            ? null
            : Math.round(data['O3_ppb']* 100) / 100;
        this.CO = data['CO_ppm'] == null || data['CO_ppm'] == undefined
            ? null
            : Math.round(data['CO_ppm'] * 100) / 100;
        this.SO2 = data['SO2_ppb'] == null || data['SO2_ppb'] == undefined
            ? null
            : Math.round(data['SO2_ppb']* 100) / 100;
        this.NO2 = data['NO2_ppb'] == null || data['NO2_ppb'] == undefined
            ? null
            : Math.round(data['NO2_ppb']* 100) / 100;
        this.CO2 = data['CO2_ppm'] == null || data['CO2_ppm'] == undefined
            ? null
            : Math.round(data['CO2_ppm'] * 100) / 100;
        this.windDr = data['wind_direction_degree'] == null || data['wind_direction_degree'] == undefined
            ? null
            : Math.round(data['wind_direction_degree']);
        this.windSp = data['wind_speed_kmph'] == null || data['wind_speed_kmph'] == undefined
            ? null
            : Math.round(data['wind_speed_kmph']);
        this.rain = data['rain_gauge_mm'] == null || data['rain_gauge_mm'] == undefined
            ? null
            : Math.round(data['rain_gauge_mm'] * 100) / 100;
        this.light = data['light_lux'] == null || data['light_lux'] == undefined
            ? null
            : Math.round(data['light_lux']);
        this.UV = data['UV_watt_per_squaremeter'] == null || data['UV_watt_per_squaremeter'] == undefined
            ? null
            : Math.round(data['UV_watt_per_squaremeter']);
    }
}

class EnvironmentPrototypeSocket extends EnvironmentPrototype {
    stationid: string;
    constructor(data: any) {
        super(data);
        this.stationid = data['_uuid'];
        this.datetime = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
        this.temp = data['_temp'] == null || data['_temp'] == undefined
            ? null
            : data['_temp'];
        this.hum = data['_hum'] == null || data['_hum'] == undefined
            ? null
            : data['_hum'];
        this.PM1 = data['_pm1'] == null || data['_pm1'] == undefined
            ? null
            : data['_pm1'];
        this.PM25 = data['_pm2_5'] == null || data['_pm2_5'] == undefined
            ? null
            : Math.abs(parseInt(data['_pm2_5']));
        this.PM10 = data['_pm10'] == null || data['_pm10'] == undefined
            ? null
            : Math.abs(parseInt(data['_pm10']));
        this.O3 = data['_o3'] == null || data['_o3'] == undefined
            ? null
            : data['_o3'];
        this.CO = data['_co'] == null || data['_co'] == undefined
            ? null
            : data['_co'];
        this.SO2 = data['_so2'] == null || data['_so2'] == undefined
            ? null
            : data['_so2'];
        this.NO2 = data['_no2'] == null || data['_no2'] == undefined
            ? null
            : data['_no2'];
        this.CO2 = data['_co2'] == null || data['_co2'] == undefined
            ? null
            : data['_co2'];
        this.windDr = data['_win_dir'] == null || data['_win_dir'] == undefined
            ? null
            : data['_win_dir'];
        this.windSp = data['_win_sp'] == null || data['_win_sp'] == undefined
            ? null
            : data['_win_sp'];
        this.rain = data['_rain'] == null || data['_rain'] == undefined
            ? null
            : data['_rain'];
        this.light = data['_light'] == null || data['_light'] == undefined
            ? null
            : data['_light'];
        this.UV = data['_uv'] == null || data['_uv'] == undefined
            ? null
            : data['_uv'];
    }
}

export { EnvironmentPrototype, EnvironmentPrototypeSocket }