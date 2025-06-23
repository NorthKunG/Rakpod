const query = require('../db/db.connection');
import { multipleColumnSet } from '../utils/common.utils';
import { multipleColumnSetAnd } from "../utils/common.and.utils";

class EnvironmentModel {
    tableName: string = 'environment';
    find = async (params: Object = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSetAnd(params);
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    };

    findOne = async (params: Object) => {
        const { columnSet, values } = multipleColumnSetAnd(params);

        const sql = `SELECT * FROM ${this.tableName}
                      WHERE ${columnSet} `;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    };

    create = async ({
        datetime,
        temperature_celsius,
        humidity_percent,
        pm1_microgram_per_cubicmeter,
        pm25_microgram_per_cubicmeter,
        pm10_microgram_per_cubicmeter,
        O3_ppb,
        CO_ppm,
        NO2_ppb,
        SO2_ppb,
        CO2_ppm,
        wind_speed_kmph,
        wind_direction_degree,
        rain_gauge_mm,
        light_lux,
        UV_watt_per_squaremeter,
        wstation_id,
    }:
        {
            datetime: string,
            temperature_celsius: any,
            humidity_percent: any,
            pm1_microgram_per_cubicmeter: any,
            pm25_microgram_per_cubicmeter: any,
            pm10_microgram_per_cubicmeter: any,
            O3_ppb: any,
            CO_ppm: any,
            NO2_ppb: any,
            SO2_ppb: any,
            CO2_ppm: any,
            wind_speed_kmph: any,
            wind_direction_degree: any,
            rain_gauge_mm: any,
            light_lux: any,
            UV_watt_per_squaremeter: any,
            wstation_id: any,
        }) => {
        const sql = `INSERT INTO ${this.tableName}
        (
            datetime,
            temperature_celsius,
            humidity_percent,
            pm1_microgram_per_cubicmeter,
            pm25_microgram_per_cubicmeter,
            pm10_microgram_per_cubicmeter,
            O3_ppb,
            CO_ppm,
            NO2_ppb,
            SO2_ppb,
            CO2_ppm,
            wind_speed_kmph,
            wind_direction_degree,
            rain_gauge_mm,
            light_lux,
            UV_watt_per_squaremeter,
            wstation_id
        )
        VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

        const result = await query(sql, [
            datetime,
            temperature_celsius,
            humidity_percent,
            pm1_microgram_per_cubicmeter,
            pm25_microgram_per_cubicmeter,
            pm10_microgram_per_cubicmeter,
            O3_ppb,
            CO_ppm,
            NO2_ppb,
            SO2_ppb,
            CO2_ppm,
            wind_speed_kmph,
            wind_direction_degree,
            rain_gauge_mm,
            light_lux,
            UV_watt_per_squaremeter,
            wstation_id,
        ]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

export default new EnvironmentModel();

