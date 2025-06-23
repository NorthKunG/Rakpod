import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { DataDeviceFromAPI } from "../../models/devices.model";
import "./CardDeviceDetails.css";
const CardDeviceDetails: React.FC<{
  open: boolean;
  data: any | null;
  closeFunction: any;
  page: string;
}> = ({ open, data, closeFunction, page }) => {
  const navigate = useNavigate();

  return (
    <div
      className={` ${page === "home" ? "card-home" : "card-map"}  ${
        open ? "" : "hidden"
      }`}
    >
      <div className="text-right">
        <CloseIcon
          sx={{ cursor: "pointer", color: "white" }}
          onClick={closeFunction}
        />
      </div>

      {/* <div>{devicesData.data[0].airQuality.AQI.aqi}</div> */}
      <h2 className="text-2xl text-white">{data?.name}</h2>
      <h3 className="uppercase text-[14px] font-semibold text-[#AFAFAF]">
        {data?.addressDistrict} {data?.addressCity}, {data?.addressCountry}
      </h3>
      <h3 className="text-[#AFAFAF] text-[14px]">
        {data?.airQuality.datetime}
      </h3>
      <br />
      {data?.airQuality && (
        <div
          className={`${
            data?.airQuality.AQI.Level === 1
              ? "bg-[#3BCCFF]"
              : data?.airQuality.AQI.Level === 2
              ? "bg-[#92D050] "
              : data?.airQuality.AQI.Level === 3
              ? "bg-[#FFFF00] "
              : data?.airQuality.AQI.Level === 4
              ? "bg-[#FFA200] "
              : "bg-red-500 "
          }  rounded-md w-[90%] mx-auto pb-4`}
        >
          {" "}
          <p className="text-2xl">
            {data?.airQuality.AQI.aqi} <span className="text-lg">AQI</span>{" "}
          </p>
          <div className="bg-white">
            <p>
              PM2.5 {data?.airQuality.pm25.value}{" "}
              <b className="font-bold">{data?.airQuality.pm25.unit}</b>
            </p>
          </div>
          {/* <div>{data.placeid}</div> */}
        </div>
      )}

      <hr className="my-4" />
      <div className="text-white">
        {data?.airQuality.pm10.value && (
          <p>
            PM10 {data?.airQuality.pm10.value}{" "}
            <b className="font-bold">{data?.airQuality.pm10.unit}</b>
          </p>
        )}
        {data?.airQuality.o3.value && (
          <p>
            O3 {data?.airQuality.o3.value}{" "}
            <b className="font-bold">{data?.airQuality.o3.unit}</b>
          </p>
        )}
        {data?.airQuality.co.value && (
          <p>
            CO {data?.airQuality.co.value}{" "}
            <b className="font-bold">{data?.airQuality.co.unit}</b>
          </p>
        )}
        {data?.airQuality.no2.value && (
          <p>
            NO2 {data?.airQuality.no2.value}{" "}
            <b className="font-bold">{data?.airQuality.no2.unit}</b>
          </p>
        )}
        {data?.airQuality.so2.value && (
          <p>
            SO2 {data?.airQuality.so2.value}{" "}
            <b className="font-bold">{data?.airQuality.so2.unit}</b>
          </p>
        )}
      </div>
      <br />
      <button
        onClick={() => navigate(`/device/${data?.placeid}`)}
        className="bg-[#FFBB0D] py-1 px-4 text-xl rounded-md shadow-lg text-white hover:bg-orange-400"
      >
        See Details
      </button>
    </div>
  );
};

export default CardDeviceDetails;
