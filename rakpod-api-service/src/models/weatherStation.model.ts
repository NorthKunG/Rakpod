const query = require('../db/db.connection');
import { multipleColumnSet } from '../utils/common.utils';
import { multipleColumnSetAnd } from "../utils/common.and.utils";

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

    findOne = async (params: Object) => {
        const { columnSet, values } = multipleColumnSetAnd(params);

        const sql = `SELECT * FROM ${this.tableName}
                      WHERE ${columnSet} `;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    };

    findAllWeatherStationRecord = async () => {
        const sql = `
        SELECT
            ws.id AS wstation_id,
            count(ws.id) AS record
        FROM ${this.tableName} ws
        LEFT JOIN environment e on e.wstation_id = ws.id
        WHERE datetime >= now() - INTERVAL 3 MINUTE
        GROUP BY ws.id;`

        return await query(sql);
    }

    update = async (params: any, id: number) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    };

    updateStationWhenOffline = async (idArr: any) => {
        const sql = `UPDATE ${this.tableName} SET status = 'offline' WHERE id in (?)`;
        const result = await query(sql, [idArr]);

        return result;
    }
}

export default new WeatherStationModel();