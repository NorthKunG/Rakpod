import { multipleColumnSetAnd } from "../utils/common.and.utils";
import { multipleColumnSetIN } from "../utils/common.in.utils";
import { multipleColumnSet } from "../utils/common.utils";

const query = require("../db/db.connection");

class UserModel {
  tableName: string = "users";

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

  create = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    // SQL query with placeholders
    let sql = `INSERT INTO ${this.tableName}
      (
        uuid,
        name,
        email,
        password
      )
      VALUES (uuid(), ?, ?, ?)`;

    // Execute the query with the provided values
    const result = await query(sql, [name, email, password]);

    // Get the number of affected rows
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

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

export default new UserModel();
