const query = require('../db/db.connection');
import { multipleColumnSet } from '../utils/common.utils';
import { multipleColumnSetAnd } from "../utils/common.and.utils";

class NotifyRegistryModel {
    tableName: string = 'notify_registry';
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

}

export default new NotifyRegistryModel();