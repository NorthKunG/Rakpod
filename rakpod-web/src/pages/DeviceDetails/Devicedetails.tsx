import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import StreamingPlugin from "chartjs-plugin-streaming";
import "chartjs-plugin-streaming";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";



import SensorDetails from "../../components/SensorDetails/SensorDetails";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

import { DeviceNew, NewGetDataFromAPI } from "../../models/new_devices.model";
import axios, { AxiosResponse } from "axios";

import blue from '../../blue.svg'
import green from '../../green.svg'
import red from '../../red.svg'
import yellow from '../../yellow.svg'
import orange from '../../orange.svg'
import hplogo from '../../huangpodlogo.png'
import dayjs from 'dayjs';
import Excelexport from "../../Excelexport";
import BarChart from "../../components/BarChart";
import handleExportChartToImage from "../../components/BarChart";
import API from "../../components/api";




ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  StreamingPlugin
  // RealTimeScale
);
const sampleDataSensor = [
  "PM2.5",
  "PM10",
  "CO",
  "O3",
  "NO2",
  "SO2",
  "TEMP",
  "HUM",
  "WINDDIRECTION",
  "WINDSPEED",
  "CO2",
  "RAIN",
  "UV",
  "LIGHT",
  "PM1",
];

const DeviceDetails = () => {
  const startDateRef = useRef<HTMLInputElement>(null);
  let { deviceId } = useParams();
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedSensorButton, setSelectedSensorButton] = useState(0)
  const [stationDetail, setStationDetail] = useState<any>(null);
  const [dataDevice, setDataDevice] = useState<DeviceNew | null>(null);
  const [devicesData, setDevicesData] = useState<NewGetDataFromAPI | null>(
    null
  );
  


  const [date_graph, setDate_graph] = useState<any>(null);
  console.log("date_graph", date_graph);

  const navigate = useNavigate();

  useEffect(() => {
    
    const FetchStationDetail = async () => {
      try {
        const response = await API.get(
          `weather-station/id/${deviceId}`
        );

        setStationDetail(response.data);
        setSelectedSensor(response.data.data.sensor[0]);
        console.log('FetchStationDetail--->', response.data)
      } catch (err) {
        console.error(err);
      }
    };

    const FetchStationDetailSelectDay = async () => {
      try {
        const response = await API.get(
          `weather-station/id/${deviceId}&date=${date_graph}`
        );

        setStationDetail(response.data);
        setSelectedSensor(response.data.data.sensor[0]);
        console.log('FetchStationDetailSelectDay--->', response.data)
      } catch (err) {
        console.error(err);
      }
      // console.log('FetchStationDetailSelectDay--->')
    };

   
    {
      date_graph == null ?  FetchStationDetail() : FetchStationDetailSelectDay() ;
    }

   
  }, [deviceId,]);

 
  const chartRef = useRef<any>(null);

  const handleExportChartToImage = async() => {


   
    const chart = chartRef.current;
    const canvas = chart?.toBase64Image();
    console.log(canvas)

    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas;
      link.download = "chart.png";
      link.click();
    }

};
  
  return (
    <>
      <Helmet>
        <title>RAKPOD | {deviceId}</title>
      </Helmet>

      {stationDetail && (
        <div className="min-w-screen py-4">
          <div className=" w-[95%] mx-auto ">
            <div className="flex items-center gap-2">
              <svg
                className="iphoneSE:h-8  ipad:h-10 iphoneSE:w-8  ipad:w-10 h-10 w-10 text-black cursor-pointer"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => navigate(-1)}
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <line x1={4} y1={12} x2={14} y2={12} />{" "}
                <line x1={4} y1={12} x2={8} y2={16} />{" "}
                <line x1={4} y1={12} x2={8} y2={8} />{" "}
              </svg>

              <h1 className=" iphoneSE:text-2xl  ipad:text-4xl font-bold">
                คุณภาพอากาศ ใกล้ <br className="ipad:hidden iphoneSE:block" />
                <span className="text-[#7C0DEB] ">
                  {stationDetail.data.name},{" "}
                  {stationDetail.data.addressProvince}
                </span>{" "}
              </h1>
            </div>
            <br />
            <h2 className="iphoneSE:text-lg  ipad:text-2xl text-gray-600">
              ค่าดัชนีคุณภาพอากาศ (AQI) และค่าการตรวจวัดมลพิษทางอากาศ ใกล้ {" "}
              {stationDetail.data.name} ,{stationDetail.data.addressProvince}{" "}
            </h2>
            <br />
            <div className="card w-auto bg-[#FFFFFF80] shadow-xl mb-4 ">
              <div className="flex ">
                <div className="basis-1/4  ">
                  {
                    stationDetail.data.name === 'มหาวิทยาลัยราชภัฏกำแพงเพชร' ? (
                      <div className="flex justify-center xl:mt-[20%] sm:mt-[20%] lg:mt-[20%] md:mt-[20%]  mt-[150%] " >
                    {
                      stationDetail?.data.environmentInformation.aqi.AQI.Level === 1 ? (
                        <img src={blue} alt="blue" className="xl:w-24 w-12 " />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 2 ? (
                        <img src={green} alt="green" className="xl:w-24 w-12" />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 3 ? (
                        <img src={yellow} alt="yellow" className="xl:w-24 w-12" />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 4 ? (
                        <img src={orange} alt="orange" className="xl:w-24 w-12" />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 5 ? (
                        <img src={red} alt="red" className="xl:w-24 w-12" />
                      ) :  <img src={hplogo} alt="red" className="xl:w-24 w-12" />
                    }

                  </div>
                    ) : (
                      <div className="flex justify-center xl:mt-[2%] sm:mt-[20%] lg:mt-[20%] md:mt-[20%]  mt-[60%] " >
                    {
                      stationDetail?.data.environmentInformation.aqi.AQI.Level === 1 ? (
                        <img src={blue} alt="blue" className="xl:w-20 w-12 " />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 2 ? (
                        <img src={green} alt="green" className="xl:w-20 w-12" />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 3 ? (
                        <img src={yellow} alt="yellow" className="xl:w-20 w-12" />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 4 ? (
                        <img src={orange} alt="orange" className="xl:w-20 w-12" />
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 5 ? (
                        <img src={red} alt="red" className="xl:w-20 w-12" />
                      ) :  <img src={hplogo} alt="red" className="xl:w-20 w-12" />
                    }

                  </div>
                    )
                  }



                  <div className="text-center mt-2 ">
                    {
                      stationDetail?.data.environmentInformation.aqi.AQI.Level === 1 ? (
                        <h2 className="text-[#47B5FF] text-lg font-bold ">อากาศดีมาก</h2>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 2 ? (
                        <h2 className='text-[#81CD47] text-lg font-bold '>อากาศดี</h2>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 3 ? (
                        <h2 className='text-[#EAD600] text-lg font-bold '>อากาศปานกลาง</h2>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 4 ? (
                        <h2 className='text-[#FE841F] text-lg font-bold '>อากาศเริ่มมีผลกระทบ</h2>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 5 ? (
                        <h2 className='text-[#E34545] text-lg font-bold '>อากาศมีผลกระทบ</h2>
                      ) : null
                    }
                  </div>

                  <div className="flex justify-center  mt-2 mb-4 ">

                    {
                      stationDetail?.data.environmentInformation.aqi.AQI.Level === 1 ? (
                        <div className="card xl:w-44 w-32 h-[40px]  bg-[#47B5FF] text-white    shadow-xl">
                          <div className="mt-2 text-center font-bold">{stationDetail?.data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div>
                        </div>

                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 2 ? (
                        <div className="card xl:w-44 w-32 h-[40px]  bg-[#81CD47] text-white  shadow-xl">
                          <div className="mt-2 text-center font-bold">{stationDetail?.data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div>
                        </div>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 3 ? (
                        <div className="card xl:w-44 w-32 h-[40px]  bg-[#EAD600] text-white  shadow-xl">
                          <div className="mt-2 text-center font-bold">{stationDetail?.data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div>
                        </div>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 4 ? (
                        <div className="card xl:w-44 w-32 h-[40px]  bg-[#FE841F] text-white  shadow-xl flex">
                          <div className="mt-2 text-center font-bold">{stationDetail?.data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div>

                        </div>
                      ) : stationDetail?.data.environmentInformation.aqi.AQI.Level === 5 ? (
                        <div className="card xl:w-44 w-32 h-[40px]  bg-[#E34545] text-white  shadow-xl">
                          <div className="mt-2 text-center font-bold">{stationDetail?.data.environmentInformation.aqi.AQI.aqi}{' '}AQI</div>
                        </div>
                      ) : null
                    }
                  </div>


                </div>
                <div className="grid mb-7 ">

                  <div className="col-span-1 mt-4 ml-5">
                    <h2 className="text-2xl text-black">
                      {stationDetail.data.name}
                    </h2>
                    <h3 className="uppercase text-[14px] font-semibold text-[#888888]">
                      {stationDetail?.data.addressSubDistrict} {stationDetail?.data.addressDistrict},{" "}
                      {stationDetail?.data.addressProvince}
                    </h3>
                    <h3 className="text-[#000000] text-[14px] mb-2">
                      {stationDetail?.data.environmentInformation.datetime}
                    </h3>
                  </div>


                  <div className="grid grid-cols-3 gap-2 ml-1 mr-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8  ">
                    {
                      stationDetail?.data.environmentInformation.PM25 === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>PM 25</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.PM25 === null ? '0' : stationDetail?.data.environmentInformation.PM25}{' '}µg/m³</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>)
                    }


                    {
                      stationDetail?.data.environmentInformation.PM10 === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>PM 10</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.PM10 === null ? '0' : stationDetail?.data.environmentInformation.PM10}{' '}µg/m³</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>)
                    }


                    {
                      stationDetail?.data.environmentInformation.temp === null ? null : (<div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                        <div className="m-4">
                          <h2 className='text-left font-bold text-sm'>อุณหภูมิ</h2>
                          <p className="text-center text-sm">{stationDetail?.data.environmentInformation.temp === null ? '0' : stationDetail?.data.environmentInformation.temp}{' '}°C</p>
                          <div className="card-actions justify-end">
                          </div>
                        </div>
                      </div>)
                    }

                    {
                      stationDetail?.data.environmentInformation.PM25 === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>ความชื้น</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.PM25 === null ? '0' : stationDetail?.data.environmentInformation.PM25}{' '}%</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      )
                    }


                    {
                      stationDetail?.data.environmentInformation.CO === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>คาร์บอนมอนนอกไซด์</h2>
                            <p className="text-center text-sm">{
                              stationDetail?.data.environmentInformation.CO === null ? '0' : stationDetail.data.environmentInformation.CO
                            }{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      )
                    }

                    {
                      stationDetail?.data.environmentInformation.CO2 === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>คาร์บอนไดออกไซด์</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.CO2 === null ? '0' : stationDetail?.data.environmentInformation.CO2}{' '}ppm</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>)
                    }

                    {
                      stationDetail?.data.environmentInformation.windDr === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>ทิศทางลม</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.windDr === null ? '0' : stationDetail?.data.environmentInformation.windDr}{' '}degree</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>)
                    }


                    {
                      stationDetail?.data.environmentInformation.windSp === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>ความเร็วลม</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.windSp === null ? '0' : stationDetail?.data.environmentInformation.windSp}{' '}km/h</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      )
                    }

                    {
                      stationDetail?.data.environmentInformation.light === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>แสง</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.light === null ? '0' : stationDetail?.data.environmentInformation.light}{' '}lux</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      )
                    }


                    {
                      stationDetail?.data.environmentInformation.UV === null ? null : (
                        <div className="card flex justify-center text-center bg-[#FFFFFF80] shadow-xl">
                          <div className="m-4">
                            <h2 className='text-left font-bold text-sm'>รังสียูวี</h2>
                            <p className="text-center text-sm">{stationDetail?.data.environmentInformation.UV === null ? '0' : stationDetail?.data.environmentInformation.UV}{' '}W/m²</p>
                            <div className="card-actions justify-end">
                            </div>
                          </div>
                        </div>
                      )
                    }



                  </div>
                </div>

              </div>


              <div>

              </div>

            </div>
            <div className="grid grid-flow-col">
            <div className="xl:flex xl:gap-2 grid grid-cols-1">
  {stationDetail.data.sensor.map((s: string, i: number) => {
    // Define button classes based on the selected sensor
    const buttonClass = selectedSensorButton === i
      ? "bg-[#7C0DEB26] text-[#7C0DEB]"
      : "bg-[#7C0DEB] text-white hover:bg-[#7C0DEB26] hover:text-[#7C0DEB]";

    // Map sensor types to their display names
    const sensorLabels: { [key: string]: string } = {
      "PM25": "PM2.5",
      "temp": "อุณหภูมิ",
      "hum": "ความชื้น",
      "windDr": "ทิศทางลม",
      "windSp": "ความเร็วลม",
      "light": "แสง",
      "UV": "รังสียูวี",
      "CO2": "คาร์บอนไดออกไซด์",
      "CO": "คาร์บอนมอนนอกไซด์"
    };

    // Determine the display label for the sensor
    const displayLabel = sensorLabels[s] || s;

    return (
      <button
        className={`${buttonClass} btn btn-md`}
        onClick={() => {
          setSelectedSensor(s);
          setSelectedSensorButton(i);
        }}
        key={i}
      >
        {displayLabel}
      </button>
    );
  })}
</div>

              {/* <div className="..."></div> */}
              <div className="flex"> 
              <h2 className="flex-auto text-[#7C0DEB] overflow-hidden text-right mt-2 mr-2">วันที่</h2> 
              <input
                ref={startDateRef}
                onFocus={() => {
                  if (startDateRef.current) startDateRef.current.type = "date";
                }}
                onBlur={() => {
                  if (startDateRef.current) startDateRef.current.type = "date";
                }}
                className="input input-bordered input-sm  w-1/2 mr-2 bg-white mt-1 icon-lg"
                type="text"
                // min={new Date().toISOString().split("T")[0]}
                placeholder="กรุณาเลือกวันที่"
                onChange={(e) => {
                  setDate_graph(e.target.value);

                }
                }
              />
                <button className=" basis-1/4 btn btn-sm bg-[#7C0DEB] text-white font-bold border-white mt-1" onClick={
                 handleExportChartToImage 
                }>ส่งออกข้อมูลกราฟ</button>
                
              </div>


            </div>


            <br />
            <SensorDetails
              selectedSensor={selectedSensor}
              deviceId={deviceId}
              stationDetail={stationDetail}
              data_graph={date_graph}
              chartRef={chartRef}
            />

          </div>
        </div>
      )}
    </>
  );
};

export default DeviceDetails;
