import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios, { AxiosResponse } from "axios";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LineCompareChart from "../../components/LineCompareChart";
import { Helmet } from "react-helmet";
import { ColorGraph } from "../../components/SensorDetails/SensorDetails";
import API from "../../components/api";
const today = format(new Date(), "yyyy-MM-dd");

// const URL_API = API.defaults.baseURL;

const getSensorData = async () => {
  return await API.get("/weather-station/sensor");
};

const getCompareData = async (
  sensor: string,
  place_list: any[],
  date: string
) => {
  return await API.post(`/environment/compare?date=${date}`, {
    stationlist: place_list,
    sensor: sensor,
  });
};

function convertToDateThai(date: Date) {
  var month_th = [
    "",
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  return (
    date.getDate() +
    " " +
    month_th[date.getMonth() + 1] +
    " " +
    (date.getFullYear() + 543)
  );
}

const Place = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [sensorsData, setSensorsData] = useState<any[]>([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedSensorData, setSelectedSensorData] = useState<any[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
  const [compareData, setCompareData] = useState(null);
  const [selectDate, setSelectDate] = useState(today);
  useEffect(() => {
    getSensorData().then((res) => {
      setSensors(
        res.data.data.map((s: any) => ({
          sensor: s.sensor,
          sensor_key: s.sensor_key,
          wstation : s.wstation
        }))
      );
      setSensorsData(res.data.data
        
      );
      // console.log(res.data);
      console.log("sensors-->",sensors);
    });
  }, []);

  useEffect(() => {
    //setReload(true);
    if (selectedSensor.length > 0) {
      // console.log(sensorsData);
      // console.log(selectedSensor);
      const selected: any[] = sensorsData.filter(
        (s) => selectedSensor === s.sensor_key
      );
      setSelectedSensorData(selected[0].wstation);
      //console.log(selected);
    }
    // console.log(sensorsData)
  }, [selectedSensor, sensorsData]);

  const handleCompareData = () => {
    getCompareData(
      selectedSensor,
      selectedSensors?.map((s: any) => s.uuid),
      selectDate
    ).then((res) => {
      const { data } = res.data;
      console.log(res.data);
      const compare = data.map((place: any, i: number) => ({
        label: place.weather_station_name,
        data: place.data.map((d: any) =>
          typeof d.sensor === "undefined" ? 0 : d.sensor
        ),
        borderColor: ColorGraph[i],
        backgroundColor: ColorGraph[i],
        tension: 0.5,
        pointRadius: 1,
        pointHoverRadius: 5,
      }));
      setCompareData(compare);
    });
  };

  return (
    <>
      <Helmet>
        <title>RAKPOD | Compare Data</title>
      </Helmet>
      <Navbar />
      <br />
      <div className="flex flex-col min-h-[92vh] justify-between ">
        <div className="px-4  ">
          <h2 className="text-[16px] ipad:text-[20px]  font-semibold">
            ข้อมูลของแต่ละสถานที่
          </h2>
          <br />

          <div className="bg-white p-2 space-y-[10px] rounded-md shadow-md  ">
            <h2 className="text-[16px] mb-2 font-semibold ">
              เลือกอุปกรณ์ตรวจวัดสภาพอากาศ
            </h2>
            <div className="flex gap-[10px] flex-wrap">
              {sensors
              .map((sensor: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedSensor(sensor.sensor_key);
                    setSelectedSensorData([]);
                    setSelectedSensors([]);
                    setCompareData(null);
                  }}
                  className={` flex items-center ${
                    selectedSensor === sensor.sensor_key
                      ? "bg-[#7C0DEB26] text-[#7C0DEB]"
                      : "bg-[#7C0DEB] text-white"
                  } px-2 py-1  rounded  text-[12px]  ipad:text-base `}
                >
                  {
                  // sensor.sensor ==="PM25" 
                  //   ? "PM2.5"
                  //   : sensor.sensor === "hum"
                  //   ? "ความชื้น"
                  //   : sensor.sensor === "temp"
                  //   ? "อุณหภูมิ"
                  //   : sensor.sensor
                    
                     sensor.sensor==="PM25" ? "PM2.5": sensor.sensor==="hum" ? "ความชื้น": sensor.sensor==="temp" ? "อุณหภูมิ": sensor.sensor==="windDr" ? "ทิศทางลม": sensor.sensor==="windSp" ? "ความเร็วลม": sensor.sensor === "CO" ? "คาร์บอนมอนนอกไซด์":  sensor.sensor === "CO2" ? "คาร์บอนไดออกไซด์":  sensor.sensor === "UV" ? "รังสียูวี":  sensor.sensor === "light" ? "แสง":  sensor.sensor }
                </button>
              ))}
            </div>
            {selectedSensorData.length > 0 && (
              <>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={selectedSensorData.filter((s) => s.province === "พิษณุโลก")}
                  getOptionLabel={(option) => option.name}
                  defaultValue={[]}
                  onChange={(event, value) => {
                    setSelectedSensors(value);
                  }}
                  //defaultValue={selectedSensor.length>0 ?selectedSensorData[0]:""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="เลือกสถานที่"
                      placeholder="สถานที่"
                    />
                  )}
                />
                <h2 className="text-[14px] ipad:text-[16px] font-semibold mb-2">
                  ตัวเลือกระบุวันที่
                </h2>
                <input
                  type="date"
                  className="rounded-lg px-2 outline-none bg-gray-100"
                  value={selectDate}
                  onChange={(e) => {
                    setSelectDate(e.target.value);
                    setCompareData(null);
                  }}
                  max={today}
                />
              </>
            )}

            {selectedSensorData.length > 0 && selectedSensors.length > 0 && (
              <button
                onClick={handleCompareData}
                className={` flex items-center 
                 bg-[#7C0DEB]
                   px-2 py-1 text-white rounded-md text-[14px]  ipad:text-lg`}
              >
                เปรียบเทียบข้อมูล
              </button>
            )}
          </div>

          <br />
          {compareData && (
            <div className=" bg-white rounded-md shadow-md p-2 ">
              <h3 className="text-[16px] mb-2 font-semibold">
                กราฟแสดงค่าการเปรียบเทียบข้อมูล{" "}
                
              </h3>
              <h2>
            ประจำวันที่ {convertToDateThai(new Date(selectDate))}
              </h2>

              <div className="h-[400px]">
                <LineCompareChart testData={compareData} />
              </div>
            </div>
          )}
        </div>
        <br />
        <Footer />
      </div>
    </>
  );
};

export default Place;
