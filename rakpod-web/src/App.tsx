import React from "react";
import { Route, Routes } from "react-router-dom";
import TestComponent from "./components/Test_component";
import DeviceDetails from "./pages/DeviceDetails/Devicedetails";
import ExportData from "./pages/ExportData/ExportData";
import HomePageTest from "./pages/Homepagetest/Homepagetest";
import Map from "./pages/Map/Map";
import Place from "./pages/Place/Place";
import MapPSL from "./pages/Map/MapPSL";
const App: React.FC = () => {
  return (
    <>
      <div className="bg-[#F6F6F6]  min-h-screen ">
        <Routes>
          <Route path="/" element={<HomePageTest />} />
          <Route path="full-map" element={<Map />} />
          <Route path="full-map/psl" element={<MapPSL />} />
          <Route path="device/:deviceId" element={<DeviceDetails />} />
          <Route path="export" element={<ExportData/>}/>
          <Route path="place" element={<Place/>}/>
          <Route path="test" element={<TestComponent />} />
          <Route path="kpt" element={<HomePageTest province="kpt"/>}/>
        </Routes>
      </div>
    </>
  );
};
export default App;
