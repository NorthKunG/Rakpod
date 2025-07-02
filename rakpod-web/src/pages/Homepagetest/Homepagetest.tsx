import React, { useState, useEffect, FC } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router";
// import axios, { AxiosResponse } from "axios";
//import "leaflet/dist/leaflet.css";

import podlogo from "../../podlogo.svg"
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import L from "leaflet";
import CardRanking from "../../components/CardRanking/CardRanking";
import { Helmet } from "react-helmet";
import { DeviceNew, NewGetDataFromAPI } from "../../models/new_devices.model";
import NewCardDeviceDetails from "../../components/NewCardDeviceDetails/NewCardDeviceDetails";
import CardInfo from "../../components/CardInfo";
import "./Homepagetest.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import './custom-leaflet.css';
import API from "../../components/api";


const HomePageTest: FC<{ province?: string }> = ({ province }) => {
  // const map = useMap();
  const navigate = useNavigate();
  const [devicesData, setDevicesData] = useState<NewGetDataFromAPI | null>(
    null
  );
  const [popup, setPopup] = useState(false);
  const [dataDevice, setDataDevice] = useState<DeviceNew | null>(null);
  const [center, setCenter] = useState<any>([ 
    16.8,100.27,
  ]);
  const [zoom, setZoom] = useState(13);

  const getDataFromNewAPI = async () => {
    const url = "weather-station"; // You can append specific endpoints here if needed
  
    try {
      const response = await API.get(url);
      setDevicesData(response.data); // Assuming setDevicesData is defined elsewhere
      setZoom(zoom); // Assuming zoom is defined and set somewhere else
  
      console.log('สำเร็จ'); // Logging success message
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state or throw further if needed
    }
  };
  const getDataFromNewAPIByProvince = async (province: string) => {
    try {
      const url = `province/${province}`; // Construct the endpoint URL
      const response = await API.get(url); // Make the GET request using API instance
  
      // Assuming response.data.data[0] contains latitude and longitude
      const latitude = response.data.data[0].latitude;
      const longitude = response.data.data[0].longitude;
  
      // Update state with latitude and longitude for centering map or similar
      setCenter([latitude, longitude]);
  
      // Update devices data state with the response data
      setDevicesData(response.data);
  
      console.log('Response Data:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state or throw further if needed
    }
  };
  // geolocation
  useEffect(() => {

    if (province) {
      setCenter([
        16.48307228,
        99.55804443])
      getDataFromNewAPIByProvince("kpt");


    } else {
      getDataFromNewAPI();
    }
  }, [province]);

  const text = (label: number | null, level?: number) => {
    return L.divIcon({
      iconSize: L.point(38, 38),
      className: `${
        level === 1 ? "circle-blue-home z-auto" :
        level === 2 ? "circle-green-home z-auto" :
        level === 3 ? "circle-yellow-home z-auto" :
        level === 4 ? "circle-orange-home z-auto" :
        level === 5 ? "circle-red-home z-auto" :
        "circle-white-home z-[0]" // Assigning a negative z-index here
    }`,
      // html : 
      //        typeof label !== "number"
      //       ?
      //       `<p class="font-medium mt-[5px] text-[16px] flex justify-center  "><img src=${podlogo} class="w-[25px] h-[25px] "></img></p> `
      //       : 
      //       `<p class=" font-bold mt-[5px] text-[16px] ">${label}</p> `,

      html : 
              typeof label == "number"
              ?
              `<p class=" font-medium mt-[5px] text-[16px] ">${label}</p> `:
              `<p class="font-medium mt-[5px] text-[16px] flex justify-center"><img src=${podlogo} class="w-[25px] h-[25px]"></img></p> `
             ,
      
          
    });
  };
  function ChangeView({ center, zoom }: any) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, zoom);
    }, [center, map, zoom]);

    return null;
  }
  console.log("zoom", zoom)
  return (
    <>
      <Helmet>
        <title>RAKPOD | Home</title>
      </Helmet>
      <Navbar />
      <br />

      <div className=" z-0 relative border-2 border-gray-100 mx-2 rounded-lg shadow-md  h-[750px] ">

        <MapContainer
          center={center}
          zoom={zoom}
          className=" w-full h-[800px] rounded-lg text "
          scrollWheelZoom={false}
          
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${"pk.eyJ1IjoiZXNraW1vYnVyZ2VyIiwiYSI6ImNrem5vZnoxbzAweG4zMHBpNnJ4bmx3a2oifQ.M5VIVg9xPG8Ky03e6qeYJg"}`}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          />
          {devicesData &&
            devicesData.data.filter((d) =>  d.environmentInformation.aqi.AQI.aqi !== null && d.addressProvince === "พิษณุโลก").map((d) => {
              return (
                <Marker
                  key={d.stationid}
                  position={[d.latitude, d.longitude]}
                  icon={text(
                    d.environmentInformation.aqi.AQI.aqi,
                    d.environmentInformation.aqi.AQI.Level
                  )}
                  eventHandlers={{
                    click: () => {
                      console.log(d);
                      setPopup(true);
                      setDataDevice(d);
                      setCenter([d.latitude, d.longitude]);
                      setZoom(16);
                    },
                  }}
                ></Marker>
              );
            })}
          <ChangeView center={center} zoom={zoom} />
         
            <div 
      className="absolute z-[1000] top-[10%] left-0  ipad:left-[5%] ipad:ml-[-42px]  iphoneSE:left-[50%] iphoneSE:ml-[-160px]  leaflet-control">
        
        <CardInfo />
      </div>
      <div className={` ${popup ?  "hidden":"absolute z-[1000] bottom-[-10%]  ipad:left-[40%] ipad:ml-[-42px]  iphoneSE:right-[40%] iphoneSE:ml-[-160px]  leaflet-control"  }`}>

      <CardRanking page="home" data={devicesData} />
      </div>

          
          
        </MapContainer>

        <div
          className="absolute z-[1000] right-2 top-2 bg-white border-2 cursor-pointer hover:bg-gray-200  border-gray-400 rounded-md flex items-center p-1 "
          onClick={() => navigate("/full-map")}
        >
          <ZoomOutMapIcon />
        </div>
        <NewCardDeviceDetails
          open={popup}
          data={dataDevice}
          closeFunction={() => setPopup(false)}
          page={"home"}
        />
      </div>
      <br />
    

      <br />
      <Footer />
    </>
  );
};

export default HomePageTest;
