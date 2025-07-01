import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { GetDataFromAPI } from "../../models/devices.model";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./CardRanking.css";
import { NewGetDataFromAPI } from "../../models/new_devices.model";

let MockRanking: Array<any> = Array(8).fill(0);

const order = (a: number, b: number) => {
  return a < b ? -1 : a > b ? 1 : 0;
};
const CardRanking: React.FC<{
  data?: NewGetDataFromAPI | null;
  page: string;
}> = ({ data, page }) => {
  return (
    <div
      className={`${
        page === "home" ? "card-ranking-home " : "card-ranking-map "
        
      }` 
    }
    >
      <h1 className=" text-xl ipad:text-2xl font-bold " >
        อันดับคุณภาพอากาศ (AQII)
      </h1>
      <h2 className="  text-base ipad:text-lg text-gray-500 font-normal leading-10    ">
        อุปกรณ์ที่มีมลพิษทางอากาศสูง (AQI)
      </h2>
      <TableContainer sx={{ height: 300  }} >
        <Table size="small" stickyHeader sx={{ height: "max-content"  }}>
          <TableHead   >
            <TableRow >
              <TableCell sx={{ fontWeight: 600 ,backgroundColor:'#FFFFFF80', color: 'black' }} align="center">
                อันดับ
              </TableCell>
              <TableCell sx={{ fontWeight: 600 ,backgroundColor:'#FFFFFF80', color: 'black' }} align="left">
                ชื่อสถานที่
              </TableCell>
              <TableCell sx={{ fontWeight: 600 ,backgroundColor:'#FFFFFF80', color: 'black' }} align="center">
                AQI
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              <>
                {data?.data
                  .sort((a, b) =>
                    b.environmentInformation.aqi.AQI.aqi >
                    a.environmentInformation.aqi.AQI.aqi
                      ? 1
                      : -1
                  ).filter((d) => d.environmentInformation.aqi.AQI.aqi !== null && d.addressProvince === "พิษณุโลก")
                  .map((d, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {i + 1}
                      </TableCell>
                      <TableCell align="left">{d.name}</TableCell>
                      <TableCell align="center">
                        <div
                          className={` ${
                            d.environmentInformation.aqi.AQI.Level === 1
                              ? "bg-[#47B5FF] border-[#47B5FF]"
                              : d.environmentInformation.aqi.AQI.Level === 2
                              ? "bg-[#82CD47] border-[#82CD47]"
                              : d.environmentInformation.aqi.AQI.Level === 3
                              ? "bg-[#FFEA11] border-[#FFEA11]"
                              : d.environmentInformation.aqi.AQI.Level === 4
                              ? "bg-[#FD841F] border-[#FD841F] "
                              : d.environmentInformation.aqi.AQI.Level === 5
                              ? "bg-[#E64848] border-[#E64848]"
                              : "bg-[#C5C5C5] border-[#C5C5C5]"
                          } w-12  text-center rounded-md font-medium p-1 border-2 text-gray-700`}
                        >
                          {" "}
                          {d.environmentInformation.aqi.AQI.aqi! ?? <span className="text-[10px] text-center">OFFLINE</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <>
                {MockRanking.map((m, i) => {
                  return (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {" "}
                        <Skeleton />
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        <Skeleton />{" "}
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CardRanking;
