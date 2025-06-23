import React, { useEffect, useRef, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
//import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { styled } from "@mui/material/styles";
// import axios from "axios";
import moment from "moment";
import { da } from "date-fns/locale";
import Excelexport from "../Excelexport";
import API from "./api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const sampleSelectData = [
  "วันนี้",
  "เมื่อวาน",
  "ย้อนหลัง 7 วัน",
  "เดือนนี้",
  "เดือนที่แล้ว",
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TableComp({
  unit,
  sensorName,
  deviceId,
}: {
  unit: string;
  sensorName: string;
  deviceId?: string;
}) {

  const [value, setValue] = React.useState(0);
  const [dataFromAPI, setDataFromAPI] = React.useState<any[]>([]);
  const [type,setType] = React.useState<any[]>([]);
  let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  let today = moment().format("YYYY-MM-DD");
  let numberDays = moment().format("DD");
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
  };

  const fetchDataFromApiYesterday = async (
    deviceId: string,
    selectedData: number
  ) => {
    // console.log(selectedData);
    setType(selectedData as any);
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&date=${yesterday}`
      )
      .then((res) => {
        // console.log(res.data);
        //setLabelData(res.data.data);
        setDataFromAPI(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };

  const fetchDataFromApiToday = async (
    deviceId: string,
    selectedData: number
  ) => {
    // console.log(selectedData);
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&date=${today}`
      )
      .then((res) => {
        // console.log(res.data);
        //setLabelData(res.data.data);
        setDataFromAPI(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };

  const fetchDataFromApiselectday = async (
    deviceId: string,
    selectedData: number
  ) => {
    // console.log(selectedData);
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&date=${date_table}`
      )
      .then((res) => {
        // console.log(res.data);
        //setLabelData(res.data.data);
        setDataFromAPI(res.data.data);
        console.log('fetchDataFromApiselectday-->',res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };

  const fetchDataFromApiLast7Days = async (
    deviceId: string,
    selectedData: number
  ) => {
    // console.log(selectedData);
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&last=7&lastType=days`
      )
      .then((res) => {
        // console.log(res.data);
        setDataFromAPI(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };
  const fetchDataFromApiLastMonth = async (
    deviceId: string,
    selectedData: number
  ) => {
    // console.log(selectedData);
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&last=1&lastType=months`
      )
      .then((res) => {
        // console.log(res.data);
        setDataFromAPI(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };

  const fetchDataFromApiThisMonth = async (
    deviceId: string,
    selectedData: number
  ) => {
    // console.log(selectedData);
    await API
      // .get(
      //   `environment/weather-station/?stationid=${deviceId}&last=${numberDays}&lastType=days`
      // )
      .get(
        `environment/weather-station/?stationid=${deviceId}&last=0&lastType=months`
      )
      .then((res) => {
        // console.log(res.data);
        setDataFromAPI(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };

  React.useEffect(() => {
    //console.log("hello")
    if (deviceId) {
      if (value === 0) {
        fetchDataFromApiToday(deviceId, value);
      } else if (value === 1) {
        fetchDataFromApiYesterday(deviceId, value);
      } else if (value === 2) {
        fetchDataFromApiLast7Days(deviceId, value);
        //fetchDataFromApi(deviceId, value);
      } else if (value === 3) {
        fetchDataFromApiThisMonth(deviceId, value);
      } else if (value === 4) {
        fetchDataFromApiLastMonth(deviceId, value);
        //fetchDataFromApi(deviceId, selectedData);
      }
    
      
      //fetchDataFromApi(deviceId, value);
    }
  }, [value]);

 

  const startDateRef = useRef<HTMLInputElement>(null);
  const [date_table, setDate_table] = useState<any>(null);

  useEffect(() => {
    if (date_table === null) {
      return;
    }

    if (deviceId) {
      fetchDataFromApiselectday(deviceId, value);
    }
   
  }
  ,[date_table]);




  
  return (
    <Box sx={{ width: "100%" }}>
      <Box
      
      sx={{
        '& .MuiTab-root': {
          color: '#000000', // Default (inactive) text color
        },
        '& .MuiTab-root.Mui-selected': {
          color: '#7C0DEB', // Active text color
        },
        '& .MuiTabs-indicator': {
          backgroundColor: '#7C0DEB', // Indicator color
        },
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        // textColor="primary"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          
          {sampleSelectData.map((value, index) => {
            return (
              <Tab
                sx={{ fontSize: 14 }}
                key={index}
                label={value}
                {...a11yProps(0)}
              />
            );
          })}

<div className="grid grid-cols-2 gap-4 w-full">
  <div className="..."></div>
  <div className="..."><div className="flex justify-right w-full"> 
           <h2 className="text-[#7C0DEB] w-11 mr-2 mt-1">วันที่</h2> <input
            ref={startDateRef}
            onFocus={() => {
              if (startDateRef.current) startDateRef.current.type = "date";
            }}
            onBlur={() => {
              if (startDateRef.current) startDateRef.current.type = "date";
            }}
            className="input input-bordered input-sm  w-full mr-2  bg-white border-gray-300"
            type="text"
            // min={new Date().toISOString().split("T")[0]}
            placeholder="กรุณาเลือกวันที่"
            onChange={(e) => {
              setDate_table(e.target.value);
              
            }
            }
            />
            {/* <button className="btn btn-sm bg-[#00CC99] text-white font-bold">ส่งออกข้อมูลตาราง</button> */}
            {}
            <Excelexport excelData={dataFromAPI} fileName={date_table === null ? `ส่งออกข้อมูลตาราง${moment().format("YYYY-MM-DD")}` : `ส่งออกข้อมูลตาราง${date_table}` }
              
            />
            </div></div>

</div>
           

        </Tabs>
       
      </Box>
  
      { 
       date_table == null ? (
        <><TabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      วันที่ของข้อมูล
                    </StyledTableCell>

                    {sensorName === "PM25" || sensorName === "PM10" ? (
                      <><StyledTableCell align="center">
                        เวลา
                      </StyledTableCell><StyledTableCell align="center">
                          สีแสดงค่าสถานะ
                        </StyledTableCell></>) : null}

                    <StyledTableCell align="center">{unit}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFromAPI.map((d, i) => (
                    <StyledTableRow key={i}>


                      <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                        {d.datetime.slice(0, 10)}
                      </StyledTableCell>
                      {sensorName === "PM25" || sensorName === "PM10" ? (
                        <><StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>

                          {d.datetime.slice(11, 19)}

                        </StyledTableCell>
                          <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                            {d.aqi.AQI.Level === 1 ? (
                              <div className="flex justify-center badge border-white   bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                              : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white  bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                                : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white  bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white  bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white  bg-[#E34545] text-[#E34545] ">AQI</div>)
                                  : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)}
                          </StyledTableCell>
                        </>) : null}

                      <StyledTableCell align="center">
                        {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel><TabPanel value={value} index={1}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        วันที่ของข้อมูล
                      </StyledTableCell>
                      {sensorName === "PM25" || sensorName === "PM10" ? (
                        <><StyledTableCell align="center">
                          เวลา
                        </StyledTableCell><StyledTableCell align="center">
                            สีแสดงค่าสถานะ
                          </StyledTableCell></>) : null}
                      <StyledTableCell align="center">{unit}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataFromAPI.map((d, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                          {d.datetime.slice(0, 10)}
                        </StyledTableCell>
                        {sensorName === "PM25" || sensorName === "PM10" ? (
                          <><StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>

                            {d.datetime.slice(11, 19)}

                          </StyledTableCell>
                            <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                              {d.aqi.AQI.Level === 1 ? (
                                <div className="flex justify-center badge border-white bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                                : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                                  : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                  : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                  : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white bg-[#E34545] text-[#E34545] ">AQI</div>)
                                    : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)}
                            </StyledTableCell>
                          </>) : null}
                        <StyledTableCell align="center">
                          {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel><TabPanel value={value} index={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">วันที่ของข้อมูล</StyledTableCell>
                      {sensorName === "PM25" || sensorName === "PM10" ? (
                        <><StyledTableCell align="center">
                          สีแสดงค่าสถานะ
                        </StyledTableCell></>) : null}
                      <StyledTableCell align="center">{unit}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataFromAPI.map((d, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                          {d.datetime}
                        </StyledTableCell>
                        {sensorName === "PM25" || sensorName === "PM10" ? (
                          <>
                            <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                              {d.aqi.AQI.Level === 1 ? (
                                <div className="flex justify-center badge border-white bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                                : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                                  : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                  : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                  : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white bg-[#E34545] text-[#E34545] ">AQI</div>)
                                    : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)}
                            </StyledTableCell>
                          </>) : null}
                        <StyledTableCell align="center">
                          {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel><TabPanel value={value} index={3}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">วันที่ของข้อมูล</StyledTableCell>
                      {sensorName === "PM25" || sensorName === "PM10" ? (
                        <><StyledTableCell align="center">
                          สีแสดงค่าสถานะ
                        </StyledTableCell></>) : null}
                      <StyledTableCell align="center">{unit}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataFromAPI.map((d, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                          {d.datetime}
                        </StyledTableCell>
                        {sensorName === "PM25" || sensorName === "PM10" ? (
                          <>
                            <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                              {d.aqi.AQI.Level === 1 ? (
                                <div className="flex justify-center badge border-white bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                                : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                                  : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                  : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                  : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white bg-[#E34545] text-[#E34545] ">AQI</div>)
                                    : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)}
                            </StyledTableCell>
                          </>) : null}
                        <StyledTableCell align="center">
                          {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel><TabPanel value={value} index={4}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">วันที่ของข้อมูล</StyledTableCell>
                      {sensorName === "PM25" || sensorName === "PM10" ? (
                        <><StyledTableCell align="center">
                          สีแสดงค่าสถานะ
                        </StyledTableCell></>) : null}
                      <StyledTableCell align="center">{unit}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataFromAPI.map((d, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                          {d.datetime}
                        </StyledTableCell>
                        {sensorName === "PM25" || sensorName === "PM10" ? (
                          <>
                            <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                              {d.aqi.AQI.Level === 1 ? (
                                <div className="flex justify-center badge border-white bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                                : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                                  : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                  : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                  : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white bg-[#E34545] text-[#E34545] ">AQI</div>)
                                    : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)}
                            </StyledTableCell>
                          </>) : null}
                        <StyledTableCell align="center">
                          {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel><TabPanel value={value} index={5}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        วันที่ของข้อมูล
                      </StyledTableCell>
                      {sensorName === "PM25" || sensorName === "PM10" ? (
                        <><StyledTableCell align="center">
                          เวลา
                        </StyledTableCell><StyledTableCell align="center">
                            สีแสดงค่าสถานะ
                          </StyledTableCell></>) : null}
                      <StyledTableCell align="center">{unit}</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataFromAPI.map((d, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                          {d.datetime.slice(0, 10)}
                        </StyledTableCell>
                        {sensorName === "PM25" || sensorName === "PM10" ? (
                          <><StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>

                            {d.datetime.slice(11, 19)}

                          </StyledTableCell>
                            <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                              {d.aqi.AQI.Level === 1 ? (
                                <div className="flex justify-center badge border-white bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                                : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                                  : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                  : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                  : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white bg-[#E34545] text-[#E34545] ">AQI</div>)
                                    : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)}
                            </StyledTableCell>
                          </>) : null}
                        <StyledTableCell align="center">
                          {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel></>
       ) : (
        <>
        {
          
      dataFromAPI.length === 0
          
          ? (
            <h2 className="flex justify-center text-center m-4">ไม่มีข้อมูล</h2>
          ) : (
            <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    วันที่ของข้อมูล
                  </StyledTableCell>

                  {sensorName === "PM25" || sensorName === "PM10" ? (
                    <><StyledTableCell align="center">
                      เวลา
                    </StyledTableCell><StyledTableCell align="center">
                        สีแสดงค่าสถานะ
                      </StyledTableCell></>) : null}

                  <StyledTableCell align="center">{unit}</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFromAPI.map((d, i) => (
                  <StyledTableRow key={i}>


                    <StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                      {d.datetime.slice(0, 10)}
                    </StyledTableCell>
                    {sensorName === "PM25" || sensorName === "PM10" ? (
                      <><StyledTableCell component="th" scope="row" sx={{ textAlign: 'center' }}>

                        {d.datetime.slice(11, 19)}

                      </StyledTableCell>
                        <StyledTableCell component="th" scope="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                          {d.aqi.AQI.Level === 1 ? (
                            <div className="flex justify-center badge border-white bg-[#47B5FF] text-[#47B5FF] ">AQI</div>)
                            : d.aqi.AQI.Level === 2 ? (<div className="flex justify-center badge border-white bg-[#81CD47] text-[#81CD47] ">AQI</div>)
                              : d.aqi.AQI.Level === 3 ? (<div className="flex justify-center badge border-white bg-[#EAD600] text-[#EAD600] ">AQI</div>)
                                : d.aqi.AQI.Level === 4 ? (<div className="flex justify-center badge border-white bg-[#FE841F] text-[#FE841F] ">AQI</div>)
                                  : d.aqi.AQI.Level === 5 ? (<div className="flex justify-center badge border-white bg-[#E34545] text-[#E34545] ">AQI</div>)
                                    : (<div className="flex justify-center ">ไม่มีข้อมูล</div>)
                                }
                        </StyledTableCell>
                      </>) : null}

                    <StyledTableCell align="center">
                      {d[sensorName] !== null ? d[sensorName] : "ไม่มีข้อมูล"}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )
        }
            
            

        
              </>
       )
      }
    </Box>
  );
}


// d.CO && d.CO2 && d.NO2 && d.O3 && d.PM1 && d.PM10 && d.PM25 && d.SO2 && d.UV && d.hum && d.light && d.rain && d.temp && d.windDr && d.windSpd && d.aqi && d.datetime