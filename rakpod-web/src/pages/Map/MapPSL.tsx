import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import axios, { AxiosResponse } from "axios";
import "leaflet/dist/leaflet.css";
import { Location } from "../../models/devices.model";
import L, { LatLngExpression } from "leaflet";
import "react-loading-skeleton/dist/skeleton.css";
import { Helmet } from "react-helmet";
import { DeviceNew, NewGetDataFromAPI } from "../../models/new_devices.model";
import NewCardDeviceDetails from "../../components/NewCardDeviceDetails/NewCardDeviceDetails";
import Navbar from "../../components/Navbar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Autocomplete, TextField } from "@mui/material";
import podlogo from "../../podlogo.svg"
import CardRankingPSL from "../../components/CardRanking/CardRankingPSL";
import API from "../../components/api";


const MapPSL = () => {
  const [dataDevice, setDataDevice] = useState<DeviceNew | null>(null);
  const [popup, setPopup] = useState(false);
  const [zoom, setZoom] = useState(13);

  React.useEffect(() => {
    getDataFromNewAPI();
  }, []);

  function ChangeView({ center, zoom }: { center: any; zoom: any }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }


  const getDataFromNewAPI = async () => {
    const Url = "weather-station/?date=2023-02-22";
    await API.get(Url).then((response: AxiosResponse<any>) => {
      console.log('map-->',response.data);
      setDevicesData(
        response.data
      );
      
    });
  };

  const [devicesData, setDevicesData] = useState<NewGetDataFromAPI | null>(
    null
  );
  const [CurrentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [openCardRank, setOpenCardRank] = useState(true);
  const [selectedDevice, setselectedDevice] = useState<DeviceNew>();
  const [selectedDeviceString, setSelectedDeviceString] = useState("");

  const navigate = useNavigate();
  let tempGirls = Array(19).fill("button", 0);

  const [inputText, setInputText] = useState("");
  let inputHandler = (e : any) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };


  const location: LatLngExpression = [
    // selectedDevice?.latitude! ?? 16.826361703575742,
    selectedDevice?.latitude! ?? 16.8040198 ,
    selectedDevice?.longitude! ?? 100.2596579,
  ];



  const text = (label: any, level?: number) => {
    return L.divIcon({
      iconSize: L.point(38, 38),
      className: `${level === 1
          ? "circle-blue"
          : level === 2
            ? "circle-green"
            : level === 3
              ? "circle-yellow"
              : level === 4
                ? "circle-orange"
                : level === 5
                  ? "circle-red"
                  : "circle-white"
        } `,
     html : typeof label === 'number' ? `<p class="font-medium mt-[5px] text-[16px]">${label}</p> ` : `<p class="font-medium mt-[5px] text-[16px] flex justify-center"><img src=${podlogo} class="w-[25px] h-[25px] "></img></p> `,
    });
  };

  return (
    <>
      <Helmet>
        <title>RAKPOD | Map</title>
      </Helmet>
      <Navbar />
      <div className="relative h-[92vh] ">
        <MapContainer
          center={location}
          zoom={zoom}
          style={{ width: "100%", height: "100%" }}
          //scrollWheelZoom={false}
          zoomControl={false}
        //whenCreated={ mapInstance => { mapRef.current = mapInstance } }
        >
          <ChangeView center={location} zoom={zoom} />
          <ZoomControl position="bottomright" />
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${"pk.eyJ1IjoiZXNraW1vYnVyZ2VyIiwiYSI6ImNrem5vZnoxbzAweG4zMHBpNnJ4bmx3a2oifQ.M5VIVg9xPG8Ky03e6qeYJg"}`}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          />
          {devicesData &&
            devicesData.data.filter((d) => d.name !== "มหาวิทยาลัยราชภัฏกำแพงเพชร"  && d.environmentInformation.aqi.AQI.aqi !== null ).map((d) => {
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
                      //console.log(d.name)
                      setSelectedDeviceString(d.name);
                      setPopup(true);
                      setDataDevice(d);
                      setOpenCardRank(false);
                      setselectedDevice(d);
                      setZoom(16);
                      setCurrentLocation({
                        lat: d.latitude,
                        lng: d.longitude,
                      
                      })
                     
                    },
                  }}
                ></Marker>
              );
            })}
        </MapContainer>

        <div className="absolute z-[400] right-0 top-0 iphoneSE:w-full    ipad:h-[75%]  ipad:mr-4  ipad:mt-10 iphoneSE:mt-4">
          {!openCardRank && (
            <div className="mb-2 ipad:mx-0 mx-2">
              <button
                className="bg-white px-4 py-2  rounded-lg text-[20px] text-[#FF5412] font-bold  shadow-xl hover:bg-orange-200 flex items-center absolute right-0 top-0 mx-2"
                onClick={() => {
                  setOpenCardRank(true);
                  setPopup(false);
                  // setPopup(true);
                  // setDataDevice(d);
                  // setOpenCardRank(false);
                }}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="star"
                  className=" w-4 text-yellow-500 mr-1"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                  />
                </svg>
                <div
                  className="text-[#00CC99]"
                >
                  อันดับคุณภาพอากาศ (AQI)
                </div>

              </button>
            </div>
          )}

          {/* Old version   */}
          {/* <div className="flex ipad:flex-col ipad:items-end ipad:justify-center  w-full ipad:h-full flex-wrap gap-2 iphoneSE:flex-row iphoneSE:justify-center ">
            
            {devicesData &&
              devicesData.data.map((d) => {
                return (
                  <div key={d.stationid}>
                    <button
                      className="bg-white px-6  rounded-lg text-[16px] text-[#FF5412]  shadow-xl hover:bg-orange-200"
                      onClick={() => {
                       // setPopup(true);
                        setDataDevice(d);
                        setOpenCardRank(false);
                        setselectedDevice(d);
                      }}
                    >
                      {d.name}
                    </button>
                  </div>
                );
              })}

           
          </div> */}

          <div className="bg-white w-1/2 h-[50px] absolute right-0 top-12  p-2 rounded-md mx-2 ipad:m-0  ">
            {/* <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel color="secondary" id="demo-select-small">
                เลือกสถานที่
              </InputLabel>
              <Select


                value={selectedDeviceString}
                label="เลือกสถานที่"
                color="secondary"
                onChange={(e: SelectChangeEvent) => {
                  //console.log(event.target.value)
                  setSelectedDeviceString(e.target.value);
                }}
              >
                <MenuItem value="" disabled>
                  <em>กรุณาเลือกสถานที่</em>
                </MenuItem>
                {devicesData &&
                  devicesData.data.map((d) => {
                    return (
                      <MenuItem
                        key={d.stationid}
                        onClick={() => {
                          setDataDevice(d);
                          setOpenCardRank(false);
                          setselectedDevice(d);
                        }}
                        value={d.name}
                      >
                        {d.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl> */}
      
       <Autocomplete
  disablePortal
  className=""
  id="combo-box-demo"
  size="small"
  options={
    devicesData?.data.filter((d) => d.name !== "มหาวิทยาลัยราชภัฏกำแพงเพชร" && d.environmentInformation.aqi.AQI.aqi !== null).map((option) => option.name) || []
  }
onChange={(event, value) => {
 
  const selectedDevice = devicesData?.data.find((d) => d.name === value);
  if (selectedDevice) {
    setDataDevice(selectedDevice);
    setOpenCardRank(false);
    setselectedDevice(selectedDevice);
    setZoom(16);
  }
  else{
    setDataDevice(null);
    setOpenCardRank(true);}
}
}
sx={{
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#DBDBDB', // Change border color
      height: '42px',
      '& input' : {
        padding : '1px',
      }
    },
    '&:hover fieldset': {
      borderColor: '#00CC99', // Change border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00CC99', // Change border color when focused
    },
  },
  '& .MuiInputLabel-root': {
    color: '#888888', // Default label color
    paddingLeft: '8px', // Adjust left padding
    paddingRight: '8px', // Adjust right padding
    top: '-3px',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#00CC99', // Label color when focused
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: 'purple', // Label color when there's an error
  },

  '& .MuiAutocomplete-endAdornment': {
    paddingRight: '10px', // Adjust padding for the dropdown arrow
    paddingBottom: '10px', // Adjust padding for the dropdown arrow
    paddingTop: '-10px', // Adjust padding for the dropdown arrow
  },
  '& .MuiAutocomplete-clearIndicator': {
    paddingLeft: '10px', // Adjust padding for the clear icon
  },
  

  
  
  
}}
  renderInput={(params) => <TextField {...params} label="กรุณาเลือกสถานที่" />}
/>
        
          </div>
        </div>
        <NewCardDeviceDetails
          open={popup}
          data={dataDevice}
          closeFunction={() => setPopup(false)}
          page={"map-psl"}
        />
        <div
          className={` ${openCardRank
              ? "absolute z-[1000] bottom-10 left-2  ipad:left-[10%] ipad:ml-[-42px]  iphoneSE:left-[50%] iphoneSE:ml-[-160px]  "
              : "hidden"
            }`}
        >
          <CardRankingPSL page="map" data={devicesData} />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default MapPSL;

// )

// : (
//   <div className="w-full h-[91vh]">
//     <SkeletonTheme baseColor="#D3D3D3	">
//       <Skeleton height="100%" />
//     </SkeletonTheme>
//   </div>
// )}

export function SelectSmall() {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel id="demo-select-small">Place</InputLabel>
      <Select value={age} label="Age" onChange={handleChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
