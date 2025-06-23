import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { AxiosResponse } from "axios";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import APIEP from "../../components/apiexport";

export const today = format(new Date(), "yyyy-MM-dd");
export const yesterday = format(( d => new Date(d.setDate(d.getDate()-1)) )(new Date()), "yyyy-MM-dd");
export const month = format(new Date(), "yyyy-MM");
const URL_API = APIEP.defaults.baseURL;


const getExportDataByDate = async (id: string[], aqi: boolean, date: string,type:string) => {
  let queryExportsParam =
    URL_API +
    `/environment/export/${id}${`?date=${date}`}${aqi ? "&AQI=a" : ""}&type=${type}`;
  //console.log(queryExportsParam);
  return await APIEP.post(queryExportsParam);
};

const getExportDataByPeriod = async (
  id: string[],
  aqi: boolean,
  beginDate: string,
  endDate: string,
  type:string
) => {
  let queryExportsParam =
    URL_API +
    `/environment/export/${id}${`?from=${beginDate}&to=${endDate}&lastType=days`}${aqi ? "&AQI=a" : ""
    }&type=${type}`;
  console.log(queryExportsParam);
  return await APIEP.post(queryExportsParam);
};

const ExportData = () => {
  const [devicesData, setDevicesData] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string[]>([]);
  const [selectedDeviceData, setSelectedDeviceData] = useState<any[]>([]);
  const [selectButton, setSelectButton] = useState(0);
  const [selectButtonType, setSelectButtonType] = useState("hourly");
  const [setqueryType, setQueryType] = useState("day");
  const [selectTypeRange, setSelectTypeRange] = useState("daily");
  
  const [checkbox, setCheckbox] = useState(false);
  const [exportURL, setExportURL] = useState("");
  const [enableDownload, setEnableDownload] = useState(false);

  const [selectOneDate, setSelectOneDate] = useState(today);
  const [selectBeginDate, setSelectBeginDate] = useState(today);
  const [selectedEndDate, setSelectEndDate] = useState(today);
  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const getDataFromNewAPI = async () => {
    const Url = "weather-station";
    await APIEP.get(Url).then((response: AxiosResponse<any>) => {
      setDevicesData(response.data.data);
    });
  };
  useEffect(() => {
    getDataFromNewAPI();
  }, []);

  // useEffect(() => {
  //   if (selectedDeviceId.length > 0) {
  //     const filter: any[] = devicesData.filter(
  //       (data) => data.stationid === selectedDeviceId
  //     );
  //     setSelectedDeviceData(filter[0]["sensor"]);

  //     if (selectButton === 4) {
  //       // console.log("HelloButton 3", selectOneDate);
  //       getExportDataByDate(selectedDeviceId[0], checkbox, selectOneDate,selectButtonType).then(
  //         (res) => {
  //           //console.log(URL_API + res.data.data.path);
  //           setExportURL(URL_API + res.data.data.path);
  //           setEnableDownload(true);
  //         }
  //       );
  //     } else if (selectButton === 5) {
  //       getExportDataByPeriod(selectedDeviceId[0], checkbox, selectBeginDate, selectedEndDate,selectButtonType).then(
  //         (res) => {
  //           //console.log(URL_API + res.data.data.path);
  //           setExportURL(URL_API + res.data.data.path);
  //           setEnableDownload(true);
  //         }
  //       );
  //     } else {
  //       //console.log("HelloButton 1");
  //       getExportDataBy(selectedDeviceId[0], selectButton, checkbox,selectButtonType).then(
  //         (res) => {
  //           //console.log(URL_API + res.data.data.path);
  //           setExportURL(URL_API + res.data.data.path);
  //           setEnableDownload(true);
  //         }
  //       );
  //     }
  //     //console.log(selectedDeviceId)
  //   }
  //   return () => {
  //     setEnableDownload(false);
  //   };
  // }, [devicesData, selectedDeviceId, selectButton, selectButtonType, checkbox, selectOneDate, selectBeginDate, selectedEndDate]);

  console.log("devicesData-->",devicesData);

  useEffect(() => {
    if (selectedDeviceId.length > 0 && selectedDeviceId.length < 2) {
      const filter: any[] = devicesData.filter(
        (data) => selectedDeviceId.includes(data.stationid)
      );
      setSelectedDeviceData(filter[0]["sensor"]);

      if (selectButton === 4) {
        // console.log("HelloButton 3", selectOneDate);
        getExportDataByDate(selectedDeviceId, checkbox, selectOneDate,selectButtonType).then(
          (res) => {
            //console.log(URL_API + res.data.data.path);
            setExportURL(URL_API + res.data.data.path);
            setEnableDownload(true);
          }
        );
      } else if (selectButton === 5) {
        getExportDataByPeriod(selectedDeviceId, checkbox, selectBeginDate, selectedEndDate,selectTypeRange).then(
          (res) => {
            //console.log(URL_API + res.data.data.path);
            setExportURL(URL_API + res.data.data.path);
            setEnableDownload(true);
          }
        );
      } else if (selectButton === 1) {
        APIEP.post(`/environment/export/${`?month=${month.split("-")[1]}&year=${month.split("-")[0]}`}&queryType=${setqueryType}&${checkbox ? "AQI=a" : ""}`,
          {
            stationid: selectedDeviceId,
          }
        ).then(
          (res) => {
            console.log(URL_API + res.data.data.path);
            setExportURL(URL_API + res.data.data.path);
            setEnableDownload(true);
          }
        );

      }
      
      else {
        //console.log("HelloButton 1");
        getExportDataBy(selectedDeviceId, selectButton, checkbox,selectButtonType).then(
          (res) => {
            //console.log(URL_API + res.data.data.path);
            setExportURL(URL_API + res.data.data.path);
            setEnableDownload(true);
          }
        );
      }
      //console.log(selectedDeviceId)
    }
    else if(selectedDeviceId.length > 1){
      if (selectButton === 1) {
        console.log('month + year');

        APIEP.post(`/environment/export/${`?month=${month.split("-")[1]}&year=${month.split("-")[0]}`}&queryType=${setqueryType}&${checkbox ? "AQI=a" : ""}`,
        {
          stationid : selectedDeviceId,
        }
      ).then(
        (res) => {
          console.log(URL_API + res.data.data.path);

          setExportURL(URL_API + res.data.data.path);
          setEnableDownload(true);
        }
      );
      }
      else if (selectButton === 4)
        
        {
          console.log('selectOneDate');

          APIEP.post(`/environment/export/${`?date=${selectOneDate}`}&type=${selectButtonType}&${checkbox ? "AQI=a" : ""}`,
          {
            stationid : selectedDeviceId,
          }
        ).then(
          (res) => {
            // console.log(URL_API + res.data.data.path);
            setExportURL(URL_API + res.data.data.path);
            setEnableDownload(true);
          }
        );
        } else if (selectButton === 5) {
          console.log('selectBeginDate + selectedEndDate');

          APIEP.post(`/environment/export/${`?from=${selectBeginDate}&to=${selectedEndDate}&type=${selectTypeRange}&${checkbox ? "AQI=a" : ""}`}`,
          {
            stationid : selectedDeviceId,
          }
          
        ).then(
          (res) => {
            // console.log(URL_API + res.data.data.path);
            setExportURL(URL_API + res.data.data.path);
            setEnableDownload(true);
          }
        );
      }
      
      else {
        console.log('today');

        APIEP.post(`/environment/export/${`?date=${today}&type=${selectButtonType}`}&${checkbox ? "AQI=a" : ""}`,
        {
          stationid : selectedDeviceId,
        }
      ).then(
        (res) => {
          // console.log(URL_API + res.data.data.path);
          setExportURL(URL_API + res.data.data.path);
          setEnableDownload(true);
        }
      );
      }
      
      
    }
    return () => {
      setEnableDownload(false);
    };
  }, [devicesData, selectedDeviceId, selectButton, selectButtonType, checkbox, selectOneDate, selectBeginDate, selectedEndDate]);

  console.log(selectedDeviceId);

  const month = format(new Date(selectOneDate), "yyyy-MM");
  
  const getExportDataBy = async (id: string[], condition: number, aqi: boolean,type:string) => {
    let queryExportsParam =
      URL_API +
      `/environment/export/${id}${condition === 0
        ? `?date=${today}`
        // : condition === 1
        //   ? `?month=${ month.split("-")[1]}&year=${month.split("-")[0]}`
        //   : condition === 2
        //     ? `?last=7&lastType=days`
        //     : condition === 3
        //       ? `?last=1&lastType=months`
              : ""
      }${aqi ? "&AQI=a" : ""}&type=${type}`;
    //console.log(queryExportsParam);
    return await APIEP.post(queryExportsParam);
  };

  return (
    <>
      <Helmet>
        <title>RAKPOD | Export Data</title>
      </Helmet>
      <Navbar />
      <br />
      <div className="flex flex-col min-h-[92vh] justify-between ">
        <div className="px-4">
          <h2 className="text-[16px] ipad:text-[20px] font-semibold">
            การบริการข้อมูลของแต่ละสถานที่
          </h2>
          <br />

          <div className="bg-[#ffffff] p-2 space-y-[10px] rounded-md shadow-md  ">
            <h2 className="text-[14px] ipad:text-[16px] mb-2 font-semibold ">
              เลือกสถานที่ที่ต้องการ
            </h2>

            {

              
              <Autocomplete 
              multiple
              id="tags-outlined"
              options={devicesData
                .filter(
                  (d: any) => d.addressProvince === "พิษณุโลก"
                )
                .map((d: any) => ( {stationid: d.stationid, name: d.name} ) )}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => {
                setSelectedDeviceId(value.map((v: any) => v.stationid));
              }}
              renderInput={(params) => (
                <TextField
                {...params}
                variant="standard"
                label="เลือกสถานที่"
                placeholder="สถานที่"
              />
              )}
              />

              
              
              
              // <MultiSelect options={
              //   devicesData.map((d: any) => ( {value: d.stationid, label: d.name} ) 
              
              // )
              // }
              // />
           
            }
            {selectedDeviceId.length !== 0 && (
              <>
                <h2 className="text-[14px] ipad:text-[16px] font-semibold">
                  รายการอุปกรณ์ตรวจวัดสภาพอากาศ
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {selectedDeviceData.map((d: any, i: number) => (
                    <div
                      className="bg-[#DBDBDB] px-2 text-[14px] ipad:text-[16px] text-[#888888] rounded-full"
                      key={i}
                    >
                      {d==="PM25" ? "PM2.5":d==="temp" ? "อุณหภูมิ":d==="hum" ? "ความชื้น":d === "windDr" ? "ทิศทางลม":d === "windSp" ? "ความเร็วลม":d === "CO" ? "คาร์บอนมอนนอกไซด์": d === "CO2" ? "คาร์บอนไดออกไซด์": d === "UV" ? "รังสียูวี": d === "light" ? "แสง": d} 
                      {/* {d === "hum" ? "ความชื้น" : d === "temp" ? "อุณหภูมิ" : d} */}
                    </div>
                  ))}
                </div>
                <h2 className="text-[14px]  ipad:text-[16px] font-semibold">
                  ช่วงเวลาที่ต้องการข้อมูล
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectButton(0)
                      setSelectButtonType("hourly");
                    }}
                    className={` flex items-center ${selectButton === 0 ?  
                       "bg-[#7C0DEB26] text-[#7C0DEB]"
                      : " bg-[#7C0DEB] text-[#FFFFFF]"
                      } px-2 py-1  rounded text-[12px] ipad:text-[16px]`}
                  >
                    วันนี้
                  </button>
                  <button
                    onClick={() => {
                      setSelectButton(1)
                      setSelectButtonType("hourly");
                    }}
                    className={` flex items-center ${selectButton === 1 ? "bg-[#7C0DEB26] text-[#7C0DEB]" : " bg-[#7C0DEB] text-[#FFFFFF]"
                      } px-2 py-1  rounded text-[12px] ipad:text-[16px]`}
                  >
                    ระบุเดือน
                  </button>
                  

                  {/* <button
                    onClick={() => {
                      setSelectButton(2)
                      setSelectButtonType("hourly")
                    }}
                    className={` flex items-center ${selectButton === 2 ? " bg-[#00CC991A] text-[#00CC99]" : "bg-[#00CC99]"
                      } px-2 py-1 text-white rounded text-[12px] ipad:text-[16px]`}
                  >
                    ย้อนหลัง 7 วัน
                  </button>
                  <button
                    onClick={() => {
                      setSelectButton(3)
                      setSelectButtonType("hourly");
                    }}
                    className={` flex items-center ${selectButton === 3 ? " bg-[#00CC991A] text-[#00CC99]" : "bg-[#00CC99]"
                      } px-2 py-1 text-white rounded text-[12px] ipad:text-[16px]`}
                  >
                    เดือนที่ผ่านมา
                  </button> */}


                  
                  <select
                    value={selectButton}
                    onChange={(e) => {
                      setSelectButton(parseInt(e.target.value))
                      setSelectButtonType("hourly");
                      setSelectTypeRange("daily");
                    }}
                    className={` outline-none flex items-center ${selectButton === 4 || selectButton === 5
                      ? "bg-[#7C0DEB26] text-[#7C0DEB]" : " bg-[#7C0DEB] text-[#FFFFFF]"
                      } px-2 py-1 rounded text-[12px] ipad:text-[16px] `}
                  >
                    {selectButton < 4 && (
                      <option hidden className="" value={selectButton}>
                        ระบุวันที่หรือช่วงเวลา
                      </option>
                    )}
                    <option className="" value="4">
                      ระบุวันที่
                    </option>
                    <option value="5">ระบุช่วงเวลา</option>
                  </select>
                </div>

            
                {
                  selectButton === 1 ?(
                    <div className="">
                        <h2 className="text-[14px] ipad:text-[16px] font-semibold mb-2">
                      ตัวเลือกระบุเดือน
                    </h2>
                        <input
                          type="month"
                          className="rounded-lg px-2 outline-none"
                          value={selectOneDate}
                          onChange={(e) => setSelectOneDate(e.target.value)}
                        />
                      </div>
                  ) :
                  selectButton > 3 && (
                  <div>
                    <h2 className="text-[14px] ipad:text-[16px] font-semibold mb-2">
                      ตัวเลือกระบุ{selectButton === 4 ? "วันที่" : "ช่วงเวลา"}
                    </h2>
                    {selectButton === 4 ? (
                      <div className="">
                        <input
                          type="date"
                          className="rounded-lg px-2 outline-none"
                          value={selectOneDate}
                          onChange={(e) => setSelectOneDate(e.target.value)}
                        />
                      </div>
                    ) : selectButton === 5 ? (
                      <div className="flex gap-2 flex-wrap">
                        <input
                          min={"2022-09-15"}
                          type="date"
                          className="rounded-lg px-2 outline-none"
                          value={selectBeginDate}
                          onChange={(e) => setSelectBeginDate(e.target.value)}
                        />
                        <h2>ถึง</h2>
                        <input
                          type="date"
                          className="rounded-lg px-2 outline-none"
                          value={selectedEndDate}
                          min={selectBeginDate}
                          max={today}
                          onChange={(e) => setSelectEndDate(e.target.value)}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
                <h2 className="text-[14px] ipad:text-[16px] font-semibold">
                  ตัวเลือกเพิ่มเติม
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={[selectButtonType, setqueryType]}
                    onChange={(e) => {
                      setSelectButtonType(e.target.value);
                      setQueryType(e.target.value);
                      console.log(e.target.value);
                      setCheckbox(e.target.value === "minutely" ? false : checkbox);
                    }}
                    className={` outline-none flex items-center ${selectButtonType === "hourly" || selectButtonType === "daily" || selectButtonType === "minutely" ||  setqueryType === "hour" || setqueryType === "day" || setqueryType === "minutely" 
                      ? "bg-[#7C0DEB26] text-[#7C0DEB]" : " bg-[#7C0DEB] text-[#FFFFFF]"
                     
                      } px-2 py-1  rounded-md text-[12px] ipad:text-[16px]`}
                  >
           
                    {[0, 4].includes(selectButton) ? <option value="hourly">รายชั่วโมง</option> :
 [1].includes(selectButton) ? <option value="day">รายวัน</option> :
 [5].includes(selectButton) ? <option value="daily">รายวัน</option> :
 null}

                  </select>
                </div>

                {selectButtonType !== "minutely" && (
                  <label className="inline-flex items-center mt-3">
                    <div 
                    className="rounded-md border-2  bg-white h-5 w-5 flex items-center justify-center"
                    >
                    <input
                      type="checkbox"
                      className="h-5 w-5 checkbox checked:bg-[#7C0DEB] checkbox-primary border-2 rounded-md"
                      defaultChecked={checkbox}
                      onChange={() => setCheckbox(!checkbox)}
                    />

                    </div>
                   
                    <span className=" ml-2 text-gray-600 text-[14px] ipad:text-[16px]">
                      คำนวณค่าดัชนีคุณภาพอากาศ (AQI) โดยใช้ค่าเฉลี่ยย้อนหลัง
                    </span>
                  </label>
                )}

                <button
                  onClick={() => window.open(exportURL)}
                  disabled={!enableDownload}
                  className={`flex items-center ${enableDownload ? "bg-[#7C0DEB]" : "bg-[#7C0DEB26] text-[#7C0DEB]"
                    } px-2 py-1 text-white rounded-md text-[14px] ipad:text-[16px]`}
                >
                  <i className="bx bx-download mr-2"></i>
                  ดาวน์โหลด
                </button>
              </>
            )}
          </div>
        </div>
        <br />
        <Footer />
      </div>
    </>
  );
};

export default ExportData;
