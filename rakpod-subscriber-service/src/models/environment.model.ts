const query = require("../db/db.connection");
import { multipleColumnSet } from "../utils/common.utils";
import { multipleColumnSetAnd } from "../utils/common.and.utils";

enum groupBy {
  days = "days",
  months = "months",
}
class EnvironmentModel {
  tableName: string = "environment";
  tableNameAvg: string = "environment_avg";
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

  findWeatherStationByOneDate = async (date: string, stationid: number) => {
    const sql = `
      SELECT 
        "onedate" AS type,
        datetime AS datetime,
        e.temperature_celsius AS temperature_celsius,
        e.humidity_percent AS humidity_percent,
        e.pm1_microgram_per_cubicmeter AS pm1_microgram_per_cubicmeter,
        e.pm25_microgram_per_cubicmeter AS pm25_microgram_per_cubicmeter,
        e.pm10_microgram_per_cubicmeter AS pm10_microgram_per_cubicmeter,
        e.O3_ppb AS O3_ppb ,
        e.CO_ppm AS CO_ppm,
        e.NO2_ppb AS NO2_ppb,
        e.SO2_ppb AS SO2_ppb,
        e.CO2_ppm AS CO2_ppm,
        e.wind_speed_kmph AS wind_speed_kmph,
        e.wind_direction_degree AS wind_direction_degree,
        e.rain_gauge_mm AS rain_gauge_mm,
        e.light_lux AS light_lux,
        e.UV_watt_per_squaremeter AS UV_watt_per_squaremeter
      FROM environment_avg e 
      WHERE DATE(datetime) = ?
      AND wstation_id = ?
      ORDER BY datetime ASC;
    `;
    const result = await query(sql, [date, stationid]);

    return result;
  };

  findCompareWeatherStationByDate = async (
    sensor: string,
    date: string,
    stationid: string
  ) => {
    const sql = `
      SELECT 
        datetime AS datetime,
        wstation_id AS station_id,
        ${sensor} AS sensor
      FROM environment_avg e 
      WHERE DATE(datetime) = ?
      AND wstation_id IN (${stationid})
      ORDER BY datetime ASC;
    `;
    console.log(sql);
    const result = await query(sql, [date]);

    return result;
  };

  findCompareEnvironmentByDate = async (
    sensor: string,
    date: string,
    stationid: string
  ) => {
    const sql = `
      SELECT 
        datetime AS datetime,
        wstation_id AS station_id,
        ${sensor} AS sensor
      FROM environment_avg e 
      WHERE DATE(datetime) = ?
      AND wstation_id = ${stationid}
      ORDER BY datetime ASC;
    `;
    console.log(sql);
    const result = await query(sql, [date]);

    return result;
  };

  findWeatherStationByLastX = async (
    day: number,
    stationid: number,
    group: string
  ) => {
    var sql: string = "";
    switch (group) {
      case "days":
        sql = `
          SELECT 
            DATE(datetime) AS datetime,
            SUM(e.temperature_celsius * e.count)/SUM(count) AS temperature_celsius,
            SUM(e.humidity_percent * e.count)/SUM(count) AS humidity_percent,
            SUM(e.pm1_microgram_per_cubicmeter * e.count)/SUM(count) AS pm1_microgram_per_cubicmeter,
            SUM(e.pm25_microgram_per_cubicmeter * e.count)/SUM(count) AS pm25_microgram_per_cubicmeter,
            SUM(e.pm10_microgram_per_cubicmeter * e.count)/SUM(count) AS pm10_microgram_per_cubicmeter,
            SUM(e.O3_ppb * e.count)/SUM(count) AS O3_ppb,
            SUM(e.CO_ppm * e.count)/SUM(count) AS CO_ppm,
            SUM(e.NO2_ppb * e.count)/SUM(count) AS NO2_ppb,
            SUM(e.SO2_ppb * e.count)/SUM(count) AS SO2_ppb,
            SUM(e.CO2_ppm * e.count)/SUM(count) AS CO2_ppm,
            SUM(e.wind_speed_kmph * e.count)/SUM(count) AS wind_speed_kmph,
            SUM(e.wind_direction_degree * e.count)/SUM(count) AS wind_direction_degree,
            MAX(e.rain_gauge_mm) AS rain_gauge_mm,
            SUM(e.light_lux * e.count)/SUM(count) AS light_lux,
            SUM(e.UV_watt_per_squaremeter * e.count)/SUM(count) AS UV_watt_per_squaremeter
          FROM environment_avg e 
          WHERE DATE(datetime) >= DATE(now() - INTERVAL ? DAY)
          AND DATE(datetime) < DATE(now() + INTERVAL 0 DAY)
          AND wstation_id = ?
          GROUP BY DATE(datetime)
          ORDER BY datetime ASC;`;
        break;
      case "months":
        sql = `
          SELECT 
            DATE(datetime) AS datetime,
            SUM(e.temperature_celsius * e.count)/SUM(count) AS temperature_celsius,
            SUM(e.humidity_percent * e.count)/SUM(count) AS humidity_percent,
            SUM(e.pm1_microgram_per_cubicmeter * e.count)/SUM(count) AS pm1_microgram_per_cubicmeter,
            SUM(e.pm25_microgram_per_cubicmeter * e.count)/SUM(count) AS pm25_microgram_per_cubicmeter,
            SUM(e.pm10_microgram_per_cubicmeter * e.count)/SUM(count) AS pm10_microgram_per_cubicmeter,
            SUM(e.O3_ppb * e.count)/SUM(count) AS O3_ppb,
            SUM(e.CO_ppm * e.count)/SUM(count) AS CO_ppm,
            SUM(e.NO2_ppb * e.count)/SUM(count) AS NO2_ppb,
            SUM(e.SO2_ppb * e.count)/SUM(count) AS SO2_ppb,
            SUM(e.CO2_ppm * e.count)/SUM(count) AS CO2_ppm,
            SUM(e.wind_speed_kmph * e.count)/SUM(count) AS wind_speed_kmph,
            SUM(e.wind_direction_degree * e.count)/SUM(count) AS wind_direction_degree,
            MAX(e.rain_gauge_mm) AS rain_gauge_mm,
            SUM(e.light_lux * e.count)/SUM(count) AS light_lux,
            SUM(e.UV_watt_per_squaremeter * e.count)/SUM(count) AS UV_watt_per_squaremeter
          FROM environment_avg e 
          WHERE DATE_FORMAT(e.datetime,"%y-%m") >= date_format(now()- INTERVAL ? MONTH,'%y-%m')
          AND MONTH(e.datetime) != MONTH(now())
          AND wstation_id = ?
          GROUP BY DATE(datetime)
          ORDER BY datetime ASC;`;
        break;
    }

    const result = await query(sql, [day, stationid]);
    return result;
  };

  findWeatherStationByMonthYear = async (
    month: string,
    stationid: number,
    queryType: string
  ) => {
    var sql: string = "";
    switch (queryType) {
      case "hour":
        sql = `
        SELECT 
        datetime AS datetime,
        e.temperature_celsius AS temperature_celsius,
        e.humidity_percent AS humidity_percent,
        e.pm1_microgram_per_cubicmeter AS pm1_microgram_per_cubicmeter,
        e.pm25_microgram_per_cubicmeter AS pm25_microgram_per_cubicmeter,
        e.pm10_microgram_per_cubicmeter AS pm10_microgram_per_cubicmeter,
        e.O3_ppb AS O3_ppb ,
        e.CO_ppm AS CO_ppm,
        e.NO2_ppb AS NO2_ppb,
        e.SO2_ppb AS SO2_ppb,
        e.CO2_ppm AS CO2_ppm,
        e.wind_speed_kmph AS wind_speed_kmph,
        e.wind_direction_degree AS wind_direction_degree,
        e.rain_gauge_mm AS rain_gauge_mm,
        e.light_lux AS light_lux,
        e.UV_watt_per_squaremeter AS UV_watt_per_squaremeter
    FROM environment_avg e  
          WHERE DATE_FORMAT(e.datetime, '%Y-%m') = ?
          AND wstation_id = ?
          ORDER BY datetime ASC;`;
        break;
      case "day":
        sql = `
        SELECT
        DATE(e.datetime) AS datetime,
        AVG(e.temperature_celsius) AS temperature_celsius,
        AVG(e.humidity_percent) AS humidity_percent,
        AVG(e.pm1_microgram_per_cubicmeter) AS pm1_microgram_per_cubicmeter,
        AVG(e.pm25_microgram_per_cubicmeter) AS pm25_microgram_per_cubicmeter,
        AVG(e.pm10_microgram_per_cubicmeter) AS pm10_microgram_per_cubicmeter,
        AVG(e.O3_ppb) AS O3_ppb,
        AVG(e.CO_ppm) AS CO_ppm,
        AVG(e.NO2_ppb) AS NO2_ppb,
        AVG(e.SO2_ppb) AS SO2_ppb,
        AVG(e.CO2_ppm) AS CO2_ppm,
        AVG(e.wind_speed_kmph) AS wind_speed_kmph,
        AVG(e.wind_direction_degree) AS wind_direction_degree,
        AVG(e.rain_gauge_mm) AS rain_gauge_mm,
        AVG(e.light_lux) AS light_lux,
        AVG(e.UV_watt_per_squaremeter) AS UV_watt_per_squaremeter
      FROM
        environment_avg e
      WHERE
        DATE_FORMAT(e.datetime, '%Y-%m') = ?
        AND e.wstation_id = ?
      GROUP BY
        DATE(e.datetime)
      ORDER BY
        datetime ASC;`;
        break;
      default:
        break;
    }

    const result = await query(sql, [month, stationid]);
    return result;
  };

  findWeatherStationByLastNow = async (
    day: number,
    stationid: number,
    group: string
  ) => {
    var sql: string = "";
    switch (group) {
      case "days":
        sql = `
          SELECT 
            DATE(datetime) AS datetime,
            SUM(e.temperature_celsius * e.count)/SUM(count) AS temperature_celsius,
            SUM(e.humidity_percent * e.count)/SUM(count) AS humidity_percent,
            SUM(e.pm1_microgram_per_cubicmeter * e.count)/SUM(count) AS pm1_microgram_per_cubicmeter,
            SUM(e.pm25_microgram_per_cubicmeter * e.count)/SUM(count) AS pm25_microgram_per_cubicmeter,
            SUM(e.pm10_microgram_per_cubicmeter * e.count)/SUM(count) AS pm10_microgram_per_cubicmeter,
            SUM(e.O3_ppb * e.count)/SUM(count) AS O3_ppb,
            SUM(e.CO_ppm * e.count)/SUM(count) AS CO_ppm,
            SUM(e.NO2_ppb * e.count)/SUM(count) AS NO2_ppb,
            SUM(e.SO2_ppb * e.count)/SUM(count) AS SO2_ppb,
            SUM(e.CO2_ppm * e.count)/SUM(count) AS CO2_ppm,
            SUM(e.wind_speed_kmph * e.count)/SUM(count) AS wind_speed_kmph,
            SUM(e.wind_direction_degree * e.count)/SUM(count) AS wind_direction_degree,
            MAX(e.rain_gauge_mm) AS rain_gauge_mm,
            SUM(e.light_lux * e.count)/SUM(count) AS light_lux,
            SUM(e.UV_watt_per_squaremeter * e.count)/SUM(count) AS UV_watt_per_squaremeter
          FROM environment_avg e 
          WHERE DATE(datetime) >= DATE(now() - INTERVAL ? DAY)
          AND wstation_id = ?
          GROUP BY DATE(datetime)
          ORDER BY datetime ASC;`;
        break;
      case "months":
        sql = `
          SELECT 
            DATE(datetime) AS datetime,
            SUM(e.temperature_celsius * e.count)/SUM(count) AS temperature_celsius,
            SUM(e.humidity_percent * e.count)/SUM(count) AS humidity_percent,
            SUM(e.pm1_microgram_per_cubicmeter * e.count)/SUM(count) AS pm1_microgram_per_cubicmeter,
            SUM(e.pm25_microgram_per_cubicmeter * e.count)/SUM(count) AS pm25_microgram_per_cubicmeter,
            SUM(e.pm10_microgram_per_cubicmeter * e.count)/SUM(count) AS pm10_microgram_per_cubicmeter,
            SUM(e.O3_ppb * e.count)/SUM(count) AS O3_ppb,
            SUM(e.CO_ppm * e.count)/SUM(count) AS CO_ppm,
            SUM(e.NO2_ppb * e.count)/SUM(count) AS NO2_ppb,
            SUM(e.SO2_ppb * e.count)/SUM(count) AS SO2_ppb,
            SUM(e.CO2_ppm * e.count)/SUM(count) AS CO2_ppm,
            SUM(e.wind_speed_kmph * e.count)/SUM(count) AS wind_speed_kmph,
            SUM(e.wind_direction_degree * e.count)/SUM(count) AS wind_direction_degree,
            MAX(e.rain_gauge_mm) AS rain_gauge_mm,
            SUM(e.light_lux * e.count)/SUM(count) AS light_lux,
            SUM(e.UV_watt_per_squaremeter * e.count)/SUM(count) AS UV_watt_per_squaremeter
          FROM environment_avg e 
          WHERE DATE_FORMAT(e.datetime,"%y-%m") >= date_format(now()- INTERVAL ? MONTH,'%y-%m')
          AND wstation_id = ?
          GROUP BY DATE(datetime)
          ORDER BY datetime ASC;`;
        break;
    }

    const result = await query(sql, [day, stationid]);
    return result;
  };

  findWeatherStationByHourLastX = async (
    day: number,
    stationid: number,
    group: string
  ) => {
    var sql: string = "";
    switch (group) {
      case "days":
        sql = `
          SELECT 
              datetime AS datetime,
              e.temperature_celsius AS temperature_celsius,
              e.humidity_percent AS humidity_percent,
              e.pm1_microgram_per_cubicmeter AS pm1_microgram_per_cubicmeter,
              e.pm25_microgram_per_cubicmeter AS pm25_microgram_per_cubicmeter,
              e.pm10_microgram_per_cubicmeter AS pm10_microgram_per_cubicmeter,
              e.O3_ppb AS O3_ppb ,
              e.CO_ppm AS CO_ppm,
              e.NO2_ppb AS NO2_ppb,
              e.SO2_ppb AS SO2_ppb,
              e.CO2_ppm AS CO2_ppm,
              e.wind_speed_kmph AS wind_speed_kmph,
              e.wind_direction_degree AS wind_direction_degree,
              e.rain_gauge_mm AS rain_gauge_mm,
              e.light_lux AS light_lux,
              e.UV_watt_per_squaremeter AS UV_watt_per_squaremeter
          FROM environment_avg e 
          WHERE DATE(datetime) >= DATE(now() - INTERVAL ? DAY)
          AND DATE(datetime) < DATE(now() + INTERVAL 0 DAY)
          AND wstation_id = ?
          ORDER BY datetime ASC;`;
        break;
      case "months":
        sql = `
          SELECT 
              datetime AS datetime,
              e.temperature_celsius AS temperature_celsius,
              e.humidity_percent AS humidity_percent,
              e.pm1_microgram_per_cubicmeter AS pm1_microgram_per_cubicmeter,
              e.pm25_microgram_per_cubicmeter AS pm25_microgram_per_cubicmeter,
              e.pm10_microgram_per_cubicmeter AS pm10_microgram_per_cubicmeter,
              e.O3_ppb AS O3_ppb ,
              e.CO_ppm AS CO_ppm,
              e.NO2_ppb AS NO2_ppb,
              e.SO2_ppb AS SO2_ppb,
              e.CO2_ppm AS CO2_ppm,
              e.wind_speed_kmph AS wind_speed_kmph,
              e.wind_direction_degree AS wind_direction_degree,
              e.rain_gauge_mm AS rain_gauge_mm,
              e.light_lux AS light_lux,
              e.UV_watt_per_squaremeter AS UV_watt_per_squaremeter
          FROM environment_avg e 
          WHERE DATE_FORMAT(e.datetime,"%y-%m") >= date_format(now()- INTERVAL ? MONTH,'%y-%m')
          AND MONTH(e.datetime) != MONTH(now())
          AND wstation_id = ?
          ORDER BY datetime ASC;`;
        break;
    }

    const result = await query(sql, [day, stationid]);
    return result;
  };

  findWeatherStationByDateMinutely = async (
    date: string,
    stationid: number
  ) => {
    const step = 10;
    const sql = `
        SELECT 
        DATE_FORMAT(
          (CONCAT_WS(
            " ", DATE(e.datetime),
            (CONCAT_WS(
              ":", HOUR(e.datetime),(minute(e.datetime) div ${step})* ${step}
                ))
              )
            )
          , "%Y-%m-%d %H:%i:%s"
          ) AS datetime,
        AVG(e.temperature_celsius) AS temperature_celsius,
        AVG(e.humidity_percent) AS humidity_percent,
        AVG(e.pm1_microgram_per_cubicmeter) AS pm1_microgram_per_cubicmeter,
        AVG(e.pm25_microgram_per_cubicmeter) AS pm25_microgram_per_cubicmeter,
        AVG(e.pm10_microgram_per_cubicmeter) AS pm10_microgram_per_cubicmeter,
        AVG(e.O3_ppb) AS O3_ppb,
        AVG(e.CO_ppm) AS CO_ppm,
        AVG(e.NO2_ppb) AS NO2_ppb,
        AVG(e.SO2_ppb) AS SO2_ppb,
        AVG(e.CO2_ppm) AS CO2_ppm,
        AVG(e.wind_speed_kmph) AS wind_speed_kmph,
        AVG(e.wind_direction_degree) AS wind_direction_degree,
        AVG(e.rain_gauge_mm) AS rain_gauge_mm,
        AVG(e.light_lux) AS light_lux,
        AVG(e.UV_watt_per_squaremeter) AS UV_watt_per_squaremeter
      FROM environment e 
      WHERE DATE(e.datetime) = DATE(?)
      AND wstation_id = ?
      group by
      DATE_FORMAT(
        (CONCAT_WS(
          " ", DATE(e.datetime),
          (CONCAT_WS(
            ":", HOUR(e.datetime),(minute(e.datetime) div ${step})* ${step}
              ))
            )
          )
        , "%Y-%m-%d %H:%i:%s")
      ORDER BY datetime ASC;`;
    const result = await query(sql, [date, stationid]);

    return result;
  };

  findWeatherStationByBetweenDayDaily = async (
    b_date: string,
    e_date: string,
    stationid: number
  ) => {
    const sql = `
        SELECT 
        DATE(datetime) AS datetime,
        AVG(e.temperature_celsius) AS temperature_celsius,
        AVG(e.humidity_percent) AS humidity_percent,
        AVG(e.pm1_microgram_per_cubicmeter) AS pm1_microgram_per_cubicmeter,
        AVG(e.pm25_microgram_per_cubicmeter) AS pm25_microgram_per_cubicmeter,
        AVG(e.pm10_microgram_per_cubicmeter) AS pm10_microgram_per_cubicmeter,
        AVG(e.O3_ppb) AS O3_ppb,
        AVG(e.CO_ppm) AS CO_ppm,
        AVG(e.NO2_ppb) AS NO2_ppb,
        AVG(e.SO2_ppb) AS SO2_ppb,
        AVG(e.CO2_ppm) AS CO2_ppm,
        AVG(e.wind_speed_kmph) AS wind_speed_kmph,
        AVG(e.wind_direction_degree) AS wind_direction_degree,
        AVG(e.rain_gauge_mm) AS rain_gauge_mm,
        AVG(e.light_lux) AS light_lux,
        AVG(e.UV_watt_per_squaremeter) AS UV_watt_per_squaremeter
      FROM environment_avg e 
      WHERE DATE(e.datetime) BETWEEN DATE(?) AND DATE(?)
      AND wstation_id = ?
      GROUP BY DATE(datetime)
      ORDER BY datetime ASC;`;
    const result = await query(sql, [b_date, e_date, stationid]);

    return result;
  };

  findWeatherStationByBetweenDayHourly = async (
    b_date: string,
    e_date: string,
    stationid: number
  ) => {
    const sql = `
      SELECT 
        datetime AS datetime,
        e.temperature_celsius AS temperature_celsius,
        e.humidity_percent AS humidity_percent,
        e.pm1_microgram_per_cubicmeter AS pm1_microgram_per_cubicmeter,
        e.pm25_microgram_per_cubicmeter AS pm25_microgram_per_cubicmeter,
        e.pm10_microgram_per_cubicmeter AS pm10_microgram_per_cubicmeter,
        e.O3_ppb AS O3_ppb ,
        e.CO_ppm AS CO_ppm,
        e.NO2_ppb AS NO2_ppb,
        e.SO2_ppb AS SO2_ppb,
        e.CO2_ppm AS CO2_ppm,
        e.wind_speed_kmph AS wind_speed_kmph,
        e.wind_direction_degree AS wind_direction_degree,
        e.rain_gauge_mm AS rain_gauge_mm,
        e.light_lux AS light_lux,
        e.UV_watt_per_squaremeter AS UV_watt_per_squaremeter
      FROM environment_avg e 
      WHERE DATE(e.datetime) BETWEEN DATE(?) AND DATE(?)
      AND wstation_id = ?
      ORDER BY datetime ASC;
    `;
    const result = await query(sql, [b_date, e_date, stationid]);

    return result;
  };

  findWeatherStationInformation = async (stationid: number) => {
    const sql = `
    SELECT 
    now() AS datetime,
    HOUR(now() - INTERVAL 1 HOUR) AS hour,
    count(*) as count,
    AVG(e.pm25_microgram_per_cubicmeter) as pm25_microgram_per_cubicmeter,
    AVG(e.pm10_microgram_per_cubicmeter) as pm10_microgram_per_cubicmeter,
    (
      SELECT AVG(e.O3_ppb)
      FROM ${this.tableNameAvg} e
      WHERE e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 8 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 8 HOUR)
    ) AS O3_ppb,
    (
      SELECT AVG(e.CO_ppm)
      FROM ${this.tableNameAvg} e
      WHERE e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 8 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 8 HOUR)
    ) AS CO_ppm,
    (
      SELECT AVG(e.SO2_ppb)
      FROM ${this.tableNameAvg} e
      WHERE e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
    ) AS SO2_ppb,
    (
      SELECT AVG(e.NO2_ppb)
      FROM ${this.tableNameAvg} e
      WHERE e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
    ) AS NO2_ppb,
    (
      SELECT AVG(e.CO2_ppm)
      FROM ${this.tableNameAvg} e
      WHERE e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
    ) AS CO2_ppm,
    AVG(e.pm1_microgram_per_cubicmeter) as pm1_microgram_per_cubicmeter,
    (
      SELECT
      AVG(e.temperature_celsius)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
          ) AS temperature_celsius,
          (
      SELECT
      AVG(e.humidity_percent)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
            ) AS humidity_percent,
          (
      SELECT
      MAX(e.rain_gauge_mm)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND e.datetime > DATE(now())
          ) AS rain_gauge_mm,
          (
      SELECT
      AVG(e.wind_direction_degree)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
          ) AS wind_direction_degree,
          (
      SELECT
      AVG(e.wind_speed_kmph)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
          ) AS wind_speed_kmph,
          (
      SELECT
      AVG(e.light_lux)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
          ) AS light_lux,
          (
      SELECT
      AVG(e.UV_watt_per_squaremeter)
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.wstation_id = ?
      AND DATE(e.datetime) >= DATE(now() - INTERVAL 1 HOUR)
      AND HOUR(e.datetime) >= HOUR(now() - INTERVAL 1 HOUR)
          ) AS UV_watt_per_squaremeter
      FROM
      ${this.tableNameAvg} e
      WHERE
      e.datetime >= now() - INTERVAL 24 HOUR
      AND e.wstation_id = ? ;`;

    const result = await query(sql, [
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
    ]);

    // return back the first row (user)
    return result[0];
  };

  findWeatherStationInformationWithDate = async (
    stationId: number,
    datetime: string
  ) => {
    const sql = `
    SELECT
    '${datetime}' AS datetime,
    HOUR('${datetime}' - INTERVAL 1 HOUR) AS hour,
    count(*) as count,
    AVG(e.pm25_microgram_per_cubicmeter) as pm25_microgram_per_cubicmeter,
    AVG(e.pm10_microgram_per_cubicmeter) as pm10_microgram_per_cubicmeter,
    (
    SELECT
      AVG(e.O3_ppb)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND e.datetime >= '${datetime}' - INTERVAL 8 HOUR ) AS O3_ppb,
    (
    SELECT
      AVG(e.CO_ppm)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND e.datetime >= '${datetime}' - INTERVAL 8 HOUR ) AS CO_ppm,
    (
    SELECT
      AVG(e.SO2_ppb)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND e.datetime >= '${datetime}' - INTERVAL 1 HOUR ) AS SO2_ppb,
    (
    SELECT
      AVG(e.NO2_ppb)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND e.datetime >= '${datetime}' - INTERVAL 1 HOUR ) AS NO2_ppb,
    (
    SELECT
      AVG(e.CO2_ppm)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND e.datetime >= '${datetime}' - INTERVAL 1 HOUR ) AS CO2_ppm,
    AVG(e.pm1_microgram_per_cubicmeter) as pm1_microgram_per_cubicmeter,
    (
    SELECT
      AVG(e.temperature_celsius)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND DATE(e.datetime) = DATE('${datetime}' - INTERVAL 1 HOUR)
        AND HOUR(e.datetime) = HOUR('${datetime}' - INTERVAL 1 HOUR) ) AS temperature_celsius,
    (
    SELECT
      AVG(e.humidity_percent)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND DATE(e.datetime) = DATE('${datetime}' - INTERVAL 1 HOUR)
        AND HOUR(e.datetime) = HOUR('${datetime}' - INTERVAL 1 HOUR) ) AS humidity_percent,
    (
    SELECT
      MAX(e.rain_gauge_mm)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND e.datetime > DATE('${datetime}') ) AS rain_gauge_mm,
    (
    SELECT
      AVG(e.wind_direction_degree)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND DATE(e.datetime) = DATE('${datetime}' - INTERVAL 1 HOUR)
        AND HOUR(e.datetime) = HOUR('${datetime}' - INTERVAL 1 HOUR) ) AS wind_direction_degree,
    (
    SELECT
      AVG(e.wind_speed_kmph)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND DATE(e.datetime) = DATE('${datetime}' - INTERVAL 1 HOUR)
        AND HOUR(e.datetime) = HOUR('${datetime}' - INTERVAL 1 HOUR) ) AS wind_speed_kmph,
    (
    SELECT
      AVG(e.light_lux)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND DATE(e.datetime) = DATE('${datetime}' - INTERVAL 1 HOUR)
        AND HOUR(e.datetime) = HOUR('${datetime}' - INTERVAL 1 HOUR) ) AS light_lux,
    (
    SELECT
      AVG(e.UV_watt_per_squaremeter)
    FROM
      environment_avg e
    WHERE
      e.wstation_id = '${stationId}'
      AND DATE(e.datetime) = DATE('${datetime}' - INTERVAL 1 HOUR)
        AND HOUR(e.datetime) = HOUR('${datetime}' - INTERVAL 1 HOUR) ) AS UV_watt_per_squaremeter
  FROM
    environment_avg e
  WHERE
    e.datetime = '${datetime}'
    AND e.wstation_id = '${stationId}';`;

    const result = await query(sql);

    // return back the first row (user)
    return result[0];
  };

  findAqiDataInHourly = async (stationid: number, datetime: string) => {
    const sql = `
        SELECT 
          "${datetime}" - INTERVAL 1 HOUR AS datetime,
          HOUR("${datetime}" - INTERVAL 1 HOUR) AS hour,
          count(*) as count,
          AVG(e.pm25_microgram_per_cubicmeter) as pm25_microgram_per_cubicmeter,
          AVG(e.pm10_microgram_per_cubicmeter) as pm10_microgram_per_cubicmeter,
          (
            SELECT AVG(e.O3_ppb)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime > "${datetime}" - INTERVAL 8 HOUR AND e.datetime <= "${datetime}" - INTERVAL 1 HOUR
          ) AS O3_ppb,
          (
            SELECT AVG(e.CO_ppm)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime > "${datetime}" - INTERVAL 8 HOUR AND e.datetime <= "${datetime}" - INTERVAL 1 HOUR
          ) AS CO_ppm,
          (
            SELECT AVG(e.CO2_ppm)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
          ) AS CO2_ppm,
          (
            SELECT AVG(e.SO2_ppb)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
          ) AS SO2_ppb,
          (
            SELECT AVG(e.NO2_ppb)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
          ) AS NO2_ppb,
          AVG(e.pm1_microgram_per_cubicmeter) as pm1_microgram_per_cubicmeter,
          (
            SELECT AVG(e.temperature_celsius)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
          ) AS temperature_celsius,
          (
            SELECT AVG(e.humidity_percent)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
            ) AS humidity_percent,
          (
            SELECT MAX(e.rain_gauge_mm)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime > DATE("${datetime}") 
          ) AS rain_gauge_mm,
          (
            SELECT AVG(e.wind_direction_degree)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = "${datetime}" - INTERVAL 1 HOUR
          ) AS wind_direction_degree,
          (
            SELECT AVG(e.wind_speed_kmph)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = "${datetime}" - INTERVAL 1 HOUR
          ) AS wind_speed_kmph,
          (
            SELECT AVG(e.light_lux)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = "${datetime}" - INTERVAL 1 HOUR
          ) AS light_lux,
          (
            SELECT AVG(e.UV_watt_per_squaremeter)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = "${datetime}" - INTERVAL 1 HOUR
          ) AS UV_watt_per_squaremeter
          FROM ${this.tableNameAvg} e
          WHERE e.datetime > "${datetime}" - INTERVAL 24 HOUR
          AND e.datetime <= "${datetime}" - INTERVAL 1 HOUR
          AND e.wstation_id = ? ;`;

    const result = await query(sql, [
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
    ]);

    return result[0];
  };

  findAqiDataInDaily = async (stationid: number, datetime: string) => {
    const sql = `
        SELECT 
          "${datetime}" AS datetime,
          count(*) as count,
          AVG(e.pm25_microgram_per_cubicmeter) as pm25_microgram_per_cubicmeter,
          AVG(e.pm10_microgram_per_cubicmeter) as pm10_microgram_per_cubicmeter,
          (
            SELECT AVG(e.O3_ppb)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime > "${datetime}" - INTERVAL 8 HOUR  AND e.datetime <= "${datetime}"
          ) AS O3_ppb,
          (
            SELECT AVG(e.CO_ppm)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime > "${datetime}" - INTERVAL 8 HOUR  AND e.datetime <= "${datetime}"
          ) AS CO_ppm,
          (
            SELECT AVG(e.SO2_ppb)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
          ) AS SO2_ppb,
          (
            SELECT AVG(e.NO2_ppb)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime = "${datetime}" - INTERVAL 1 HOUR
          ) AS NO2_ppb,
          AVG(e.pm1_microgram_per_cubicmeter) as pm1_microgram_per_cubicmeter,
          AVG(e.temperature_celsius) as temperature_celsius,
          AVG(e.humidity_percent) as humidity_percent,
          AVG(e.CO2_ppm) AS CO2_ppm,
          (
            SELECT MAX(e.rain_gauge_mm)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND e.datetime > DATE("${datetime}") AND e.datetime <= "${datetime}" - INTERVAL 1 HOUR
          ) AS rain_gauge_mm,
          (
            SELECT AVG(e.wind_direction_degree)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = DATE("${datetime}" - INTERVAL 1 HOUR)
          ) AS wind_direction_degree,
          (
            SELECT AVG(e.wind_speed_kmph)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = DATE("${datetime}" - INTERVAL 1 HOUR)
          ) AS wind_speed_kmph,
          (
            SELECT AVG(e.light_lux)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = DATE("${datetime}" - INTERVAL 1 HOUR)
          ) AS light_lux,
          (
            SELECT AVG(e.UV_watt_per_squaremeter)
            FROM ${this.tableNameAvg} e
            WHERE e.wstation_id = ?
            AND DATE(e.datetime) = DATE("${datetime}" - INTERVAL 1 HOUR)
          ) AS UV_watt_per_squaremeter
          FROM ${this.tableNameAvg} e
          WHERE e.datetime > "${datetime}" - INTERVAL 24 HOUR AND e.datetime <= "${datetime}"
          AND e.wstation_id = ? ;`;

    const result = await query(sql, [
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
      stationid,
    ]);

    // return back the first row (user)
    return result[0];
  };
}

export default new EnvironmentModel();
