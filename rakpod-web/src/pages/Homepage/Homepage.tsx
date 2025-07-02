import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router";
import axios, { AxiosResponse } from "axios";
import "leaflet/dist/leaflet.css";

import {
  DataDeviceFromAPI,
  GetDataFromAPI,
  Location,
} from "../../models/devices.model";

import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import "./Homepage.css";
import L from "leaflet";
import CardDeviceDetails from "../../components/CardDeviceDetails/CardDeviceDetails";
import CardRanking from "../../components/CardRanking/CardRanking";
import { Helmet } from "react-helmet";


const HomePage: React.FC = () => {
  React.useEffect(() => {
    getDataFromAPI();
    getDataFromNewAPI();
  }, []);
  const navigate = useNavigate();

  const [devicesData, setDevicesData] = useState<any | null>(null);
  const [dataDevice, setDataDevice] = useState<DataDeviceFromAPI | null>(null);
  const [popup, setPopup] = useState(false);

  const getDataFromAPI = async () => {
    const Url =
      "https://api-nusmartcity.sgtech.nu.ac.th/smart-environment/place";
    await axios.get(Url).then((response: AxiosResponse<any>) => {
      setDevicesData(response.data);

    });
  };

  const getDataFromNewAPI = async () => {
    const Url = "https://api-envy.adcm.co.th/weather-station";
    await axios.get(Url).then((response: AxiosResponse<any>) => {
      console.log(response.data);
      //setDevicesData(response.data);
    });
  };

  const text = (label: any, level?: number) => {
    return L.divIcon({
      iconSize: L.point(38, 38),
      className: `${
        level === 1
          ? "circle-blue"
          : level === 2
          ? "circle-green"
          : level === 3
          ? "circle-yellow"
          : level === 4
          ? "circle-orange"
          : "circle-red"
      } `,
      html: `<p class="font-bold mt-1 text-[16px]">${label}</p> `,
    });
  };

  return (
    <>
      <Helmet>
        <title>RAKPOD | Home</title>
      </Helmet>
      <div className="h-[8vh] flex items-center justify-between px-4 bg-white shadow-[0px_2px_8px_0px_rgba(99, 99, 99, 0.2)]">
        <h1 className=" font-bold  sm:text-xl xl:text-4xl cursor-none  ">
          Smart <span style={{ color: "#FF5412" }}>Environment By bestborirak</span>{" "}
        </h1>

        <div className="flex items-center  px-2 rounded-2xl bg-white shadow-lg py-1 text-sm    ">
          <input
            type="text"
            name="name"
            placeholder="Search your device ..."
            className=" ipad:block ipad:rounded-none iphoneSE:hidden iphoneSE:rounded-full     outline-none   "
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-yellow-600  "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      {/* <div className="h-[4px]" /> */}

      <div className=" relative w-full ">
        <MapContainer
          center={[16.745956, 100.188622]}
          zoom={14}
          className=" w-full h-[500px]  "
          scrollWheelZoom={false}
          //whenCreated={ mapInstance => { mapRef.current = mapInstance } }
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {devicesData &&
            devicesData.data.map((d: any) => {
              return (
                <Marker
                  key={d.placeid}
                  position={[d.latitude, d.longitude]}
                  icon={text(d.airQuality.AQI.aqi, d.airQuality.AQI.Level)}
                  eventHandlers={{
                    click: () => {
                      setPopup(true);
                      setDataDevice(d);
                    },
                  }}
                ></Marker>
              );
            })}
        </MapContainer>
        

        <div
          className="absolute z-[1000] right-2 top-2 bg-white border-2 cursor-pointer hover:bg-gray-200  border-gray-400 rounded-md flex items-center p-1 "
          onClick={() => navigate("full-map")}
        >
          <ZoomOutMapIcon />
        </div>
        <CardDeviceDetails
          open={popup}
          data={dataDevice}
          closeFunction={() => setPopup(false)}
          page={"home"}
        />
      </div>
      {/* ) : (
        <div className="h-[500px] bg-gray-200 flex justify-center items-center">
          <svg
            role="status"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#FF5412]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>

          <h1 className="text-xl">Loading ...</h1>
        </div> */}
      <br />
      <div className="w-[100%] mx-auto flex justify-center  gap-4 flex-wrap pb-4   ">
        <CardRanking page="home" data={devicesData} />
        <CardInfo />
      </div>
    </>
  );
};

export default HomePage;

const CardInfo: React.FC = () => {
  const Label = [
    {
      color: "#3BCCFF",
      text: "ดีมาก",
    },
    {
      color: "#92D050",
      text: "ดี",
    },
    {
      color: "#FFFF00",
      text: "ปานกลาง",
    },
    {
      color: "#FFA200",
      text: "เริ่มมีผลกระทบต่อสุขภาพ",
    },
    {
      color: "#F04646",
      text: "มีผลกระทบต่อสุขภาพ",
    },
  ];

  return (
    <div className="bg-white iphoneSE:text-sm  ipad:text-2xl  border-2 border-blacks   iphoneSE:w-[315px]  ipad:w-[450px]  px-8 py-4 space-y-2 iphoneSE:h-[230px] ipad:h-[280px]">
      <h1 className="text-2xl font-bold ">คุณภาพอากาศ</h1>

      {Label.map((l, i) => {
        return (
          <div key={i} className="flex items-center gap-4 ">
            <div className={`bg-[${l.color}] w-16 h-5 rounded-2xl`} />
            <p>{l.text}</p>
          </div>
        );
      })}
    </div>
  );
};

// eslint-disable-next-line no-lone-blocks
{
  /* <Marker position={[16.745956, 100.188622]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker> */
}
