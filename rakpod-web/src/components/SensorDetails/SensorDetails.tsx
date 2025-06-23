import React, { useEffect, useState } from "react";
import RealtimeGraph, { Unit } from "../RealtimeGraph";
import BarGraph from "../BarGraph";
import TableComp from "../TableComp";
import BarChart from "../BarChart";

const SENSOR_LABEL: { [key: number]: string } = {
  0: "PM2.5",
  1: "PM10",
  2: "CO",
  3: "O3",
  4: "NO2",
  5: "SO2",
  6: "TEMP",
  7: "HUM",
  8: "WINDDIRECTION",
  9: "WINDSPEED",
  10: "CO2",
  11: "RAIN",
  12: "UV",
  13: "LIGHT",
  14: "PM1",
};

const ColorGraphSensor: { [key: string]: string } = {
  PM25: "#464d77",
  PM10: "#36827f",
  CO: "#F9DB6D",
  O3: "#F4EDED",
  NO2: "#877666",
  SO2: "#928274",
  temp: "#9C8D81",
  hum: "#A5978C",
  windDr: "#ADA096",
  windSp: "#B4A9A0",
  CO2: "#A9E5BB",
  rain: "#de0a26",
  UV: "#FCF6B1",
  light: "#F7B32B",
  PM1: "#2D1E2F",
};

export const ColorGraph: { [key: number]: string } = {
  0: "#464d77",
  1: "#36827f",
  2: "#F9DB6D",
  3: "#F4EDED",
  4: "#877666",
  5: "#928274",
  6: "#9C8D81",
  7: "#A5978C",
  8: "#ADA096",
  9: "#B4A9A0",
  10: "#A9E5BB",
  11: "#de0a26",
  12: "#FCF6B1",
  13: "#F7B32B",
  14: "#2D1E2F",
};


const SensorDetails: React.FC<{
  data_graph: any;
  selectedSensor: string;
  deviceId?: string;
  stationDetail:any
  chartRef : any
}> = ({ data_graph, selectedSensor, deviceId,stationDetail,chartRef }) => {
  return (
    <>
    {console.log("chartRefSensorDetails-->",chartRef)}
      <div className="flex justify-center flex-wrap gap-6 ">
        <div className=" iphoneSE:w-[300px] ipad:w-[500px]    bg-white rounded-lg shadow-xl flex-grow py-2 px-4">
          <h3 className="text-[#323232] iphoneSE:text-lg  ipad:text-2xl font-normal  ">
            ค่าจากอุปกรณ์ตรวจวัด&nbsp;
           <span className="text-[#7C0DEB] ">{selectedSensor==="PM25" ? "PM2.5":selectedSensor==="hum" ? "ความชื้น":selectedSensor==="temp" ? "อุณหภูมิ":selectedSensor==="windDr" ? "ทิศทางลม":selectedSensor==="windSp" ? "ความเร็วลม":selectedSensor === "CO" ? "คาร์บอนมอนนอกไซด์": selectedSensor === "CO2" ? "คาร์บอนไดออกไซด์": selectedSensor === "UV" ? "รังสียูวี": selectedSensor === "light" ? "แสง": selectedSensor }{' '}ณ ปัจจุบัน</span> 
          </h3>
          <br />
          <div className="h-[350px]">
            <RealtimeGraph label={selectedSensor} deviceId={deviceId} />
          </div>
        </div>
        <div className="iphoneSE:w-[300px] ipad:w-[500px]   bg-white rounded-lg shadow-xl flex-grow py-2 px-4">
          <h3 className="text-[#323232]  iphoneSE:text-lg  ipad:text-2xl font-normal ">
            กราฟแสดงค่า&nbsp;
            <span className="text-[#7C0DEB] ">{selectedSensor==="PM25" ? "PM2.5":selectedSensor==="hum" ? "ความชื้น":selectedSensor==="temp" ? "อุณหภูมิ":selectedSensor==="windDr" ? "ทิศทางลม":selectedSensor==="windSp" ? "ความเร็วลม":selectedSensor === "CO" ? "คาร์บอนมอนนอกไซด์": selectedSensor === "CO2" ? "คาร์บอนไดออกไซด์": selectedSensor === "UV" ? "รังสียูวี": selectedSensor === "light" ? "แสง": selectedSensor }</span> ย้อนหลัง : {stationDetail.data.name}, {stationDetail.data.addressProvince}
          </h3>
          <br />

         {deviceId&& <BarChart selectedSensor={selectedSensor} deviceId={deviceId} data_graph={data_graph} chartRef={chartRef} />}
        </div>
      </div>
      <br />
      <div className=" bg-white py-2 px-4 shadow-xl rounded-lg ">
        <h3 className="text-[#323232] iphoneSE:text-lg  ipad:text-2xl  font-normal ">
          ตารางแสดงค่าการตรวจวัดโดยเฉลี่ย&nbsp;
        <span className="text-[#7C0DEB]">{selectedSensor==="PM25" ? "PM2.5":selectedSensor==="hum" ? "ความชื้น":selectedSensor==="temp" ? "อุณหภูมิ":selectedSensor==="windDr" ? "ทิศทางลม":selectedSensor==="windSp" ? "ความเร็วลม":selectedSensor === "CO" ? "คาร์บอนมอนนอกไซด์": selectedSensor === "CO2" ? "คาร์บอนไดออกไซด์": selectedSensor === "UV" ? "รังสียูวี": selectedSensor === "light" ? "แสง": selectedSensor }{' '}  ย้อนหลัง</span>  
        </h3>
        <br />

        <TableComp
          sensorName={selectedSensor}
          unit={`${selectedSensor==="PM25" ? "PM2.5":selectedSensor==="hum" ? "ความชื้น":selectedSensor==="temp" ? "อุณหภูมิ":selectedSensor==="windDr" ? "ทิศทางลม":selectedSensor==="windSp" ? "ความเร็วลม":selectedSensor === "CO" ? "คาร์บอนมอนนอกไซด์": selectedSensor === "CO2" ? "คาร์บอนไดออกไซด์": selectedSensor === "UV" ? "รังสียูวี": selectedSensor === "light" ? "แสง": selectedSensor } ( ${Unit[selectedSensor]} ) `}
          deviceId={deviceId}
        />
      </div>
    </>
  );
};

export default SensorDetails;
