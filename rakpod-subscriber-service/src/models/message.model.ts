import { multipleColumnSetAnd } from "../utils/common.and.utils";
import { multipleColumnSetIN } from "../utils/common.in.utils";
import { multipleColumnSet } from "../utils/common.utils";

const query = require("../db/db.connection");

class MessageModel {
  tableName: string = "messages";

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
                  WHERE ${columnSet} LIMIT 1`;

    const result = await query(sql, [...values]);

    // return back the first row (user)
    return result[0];
  };

  findOneLast = async (params: Object) => {
    const { columnSet, values } = multipleColumnSetAnd(params);

    const sql = `SELECT * FROM ${this.tableName}
                  WHERE ${columnSet} LIMIT 1 DESC`;

    const result = await query(sql, [...values]);

    // return back the first row (user)
    return result[0];
  };

  findOneLastMessage = async (params: Object) => {
    const { columnSet, values } = multipleColumnSetAnd(params);

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

    // Update the SQL to include date and time conditions
    const sql = `SELECT *
               FROM ${this.tableName}
               WHERE ${columnSet} 
               AND (
                 (start_date <= ? OR start_date IS NULL) 
                 AND 
                 (start_time <= ? OR start_time IS NULL)
                 AND
                 (end_date >= ? OR end_date IS NULL) 
                 AND 
                 (end_time >= ? OR end_time IS NULL)
               )
               ORDER BY id DESC
               LIMIT 1`;

    // Execute the query with current date and time values
    const result = await query(sql, [
      ...values,
      currentDate,
      currentTime,
      currentDate,
      currentTime,
    ]);

    // return the first row (most recent message)
    return result[0];
  };

  findCheckExpireMessage = async (params: Object) => {
    const { columnSet, values } = multipleColumnSetAnd(params);

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

    // Update the SQL to include date and time conditions
    const sql = `SELECT *
              FROM ${this.tableName}
              WHERE ${columnSet} 
              AND status != 'Expire'
              AND (end_date < ?)
              ORDER BY id;
               `;

    // Execute the query with current date and time values
    const result = await query(sql, [...values, currentDate]);

    // Return all rows that match the conditions
    return result;
};

  create = async ({
    title,
    message,
    start_date,
    end_date,
    start_time,
    end_time,
    wstation,
  }: {
    title: string;
    message: object; // Use the correct type
    start_date: string | null;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    wstation: number | null;
  }) => {
    // Convert message object to a JSON string
    const messageJson = JSON.stringify(message);

    // SQL query with placeholders
    let sql = `INSERT INTO ${this.tableName}
      (
        uuid,
        title,
        message,
        start_date,
        end_date,
        start_time,
        end_time,
        wstation,
        status
      )
      VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, 'Created')`;

    // Execute the query with the provided values
    const result = await query(sql, [
      title,
      messageJson, // Use JSON string for the message
      start_date,
      end_date,
      start_time,
      end_time,
      wstation,
    ]);

    // Get the number of affected rows
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params: any, messageId: any) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE uuid = ?`;

    const result = await query(sql, [...values, messageId]);

    return result;
  };

  delete = async (messageId: any) => {
    const sql = `DELETE FROM ${this.tableName}
    WHERE uuid = ?`;
    const result = await query(sql, [messageId]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

export default new MessageModel();
