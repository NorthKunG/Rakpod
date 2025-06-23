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


    create = async (
        {
            line_code_id,
            acc_token,
            notify_type,
            target,
            targetType,
            is_active
        }:
            {
                line_code_id: string,
                acc_token: string,
                notify_type: string,
                target: string,
                targetType: string,
                is_active: number
            }
    ) => {
        let sql = `INSERT INTO ${this.tableName}
        (   
            uuid,
            line_code_id, 
            acc_token, 
            notify_type,
            target,
            targetType,
            is_active
        )
        VALUE (uuid(),?,?,?,?,?,?)
        `;

        const result = await query(sql, [
            line_code_id,
            acc_token,
            notify_type,
            target,
            targetType,
            is_active
        ]);
        const affectedRows: number = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params: any, acc_token: any) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE acc_token = ?`;

        const result = await query(sql, [...values, acc_token]);

        return result;
    };

    delete = async (acc_token: any) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE acc_token = ?`;
        const result = await query(sql, [acc_token]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    };
}

export default new NotifyRegistryModel();