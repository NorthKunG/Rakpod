const query = require('../db/db.connection');
import { multipleColumnSet } from '../utils/common.utils';
import { multipleColumnSetAnd } from "../utils/common.and.utils";
import { multipleColumnSetIN } from '../utils/common.in.utils';

class WeatherStationModel {
    tableName: string = 'weather_station';
    find = async (params: Object = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSetAnd(params);
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    };

    findIN = async (params: Object = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSetIN(params);
        sql += ` WHERE ${columnSet}`;
        console.log(sql, values);
        return await query(sql, values);
    };

    findOne = async (params: Object) => {
        const { columnSet, values } = multipleColumnSetAnd(params);

        const sql = `SELECT * FROM ${this.tableName}
                      WHERE ${columnSet} `;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    };

    mapWstationWithSensor = async () => {
        const sql = `
        SELECT uuid,name,sensor,address_province FROM ${this.tableName}`;

        return await query(sql);

    };

    create = async (
        {
            name, description, sensor,
            location_latitude, location_longitude,
            address_detail, address_subdistrict,
            address_district, address_province
        }:
            {
                name: string,
                description: string,
                sensor: string,
                location_latitude: number,
                location_longitude: number,
                address_detail: string,
                address_subdistrict: string,
                address_district: string,
                address_province: string
            }
    ) => {
        let sql = `INSERT INTO ${this.tableName}
        (   
            uuid,
            name, 
            description, 
            sensor,
            location_latitude, 
            location_longitude,
            address_detail, 
            address_subdistrict,
            address_district, 
            address_province
        )
        VALUE (uuid(),?,?,?,?,?,?,?,?,?)
        `;

        const result = await query(sql, [
            name, description, sensor,
            location_latitude, location_longitude,
            address_detail, address_subdistrict,
            address_district, address_province
        ]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params: any, stationid: any) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE uuid = ?`;

        const result = await query(sql, [...values, stationid]);

        return result;
    };

    delete = async (stationid: any) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE uuid = ?`;
        const result = await query(sql, [stationid]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    };
}

export default new WeatherStationModel();