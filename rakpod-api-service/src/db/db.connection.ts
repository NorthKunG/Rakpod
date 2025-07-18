import mysql from "mysql";
import * as dotenv from "dotenv";
dotenv.config();

class DBConnection {
  db: any
  constructor() {
    this.db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      port: 3306,
      dateStrings: true,
    });
    this.checkConnection();
  }

  checkConnection = () => {
    this.db.getConnection((err: any, connection: any) => {
      if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
          console.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
          console.error("Database connection was refused.");
        }
        this.checkConnection();
      }

      if (connection) {
        console.error("Database connection success");
        // this.createTable();
        connection.release();
      }
      return;
    });
  }

  query = async (sql: any, values: any) => {
    return new Promise((resolve, reject) => {
      const callback = (error: any, result: any) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      };
      // execute will internally call prepare and query
      this.db.query(sql, values, callback);
    }).catch((err) => {
      // console.log('xxx')
      // const mysqlErrorList = Object.keys(HttpStatusCodes);
      // convert mysql errors which in the mysqlErrorList list to http status code
      // err.status = mysqlErrorList.includes(err.code)
      //   ? HttpStatusCodes[err.code]
      //   : err.status;

      throw err;
    });
  };
};
// const HttpStatusCodes = Object.freeze({
//   ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
//   ER_DUP_ENTRY: 409,
// });

module.exports = new DBConnection().query;
// module.exports = new DBConnection()