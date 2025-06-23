import React, { useState } from "react";
import { Chart as ChartJS } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:2541";

ChartJS.register(StreamingPlugin);

export const Unit: {
  [key: string]: string;
} = {
  PM25: "µg./m3",
  PM10: "µg./m3",
  CO: "ppm",
  O3: "ppb",
  NO2: "ppb",
  SO2: "ppb",
  temp: "°C",
  hum: "%",
  windDr: "°",
  windSp: "m/s",
  CO2: "ppm",
  rain: "mm",
  UV: "W/m2",
  light: "lux",
  PM1: "µg./m3",
};

const toTimestamp = (strDate: string) => {
  const dt = new Date(strDate).getTime();
  return dt;
};

const RealtimeGraph: React.FC<{ label: string; deviceId?: string }> = ({
  label,
  deviceId,
}) => {
  //const [socketSensor, setSocketSensor] = useState<String | null>(null);
  const connectSocketIO = (id: string, selectedSensor: string) => {
    console.log(selectedSensor);

    const socket = io(ENDPOINT, { path: "/socketio/" });
    // socket.on("disconnect", () => {
    //   console.log(socket.id); // undefined
    // });
    socket.on("connect", function () {
      console.log("socket connected");
    });
    socket.on(`/weather-station/${id}/data`, (data: any) => {
      //console.log(selectedSensor);
      setSocketData(data);
      setSocketTime(toTimestamp(data.datetime));
      //console.log(data.datetime)
    });
    socket.on("connect_error", (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });
  };

  React.useEffect(() => {
    let socket = io(ENDPOINT, { path: "/socketio/" });
    if (deviceId && label) {
     // connectSocketIO(deviceId, label);
     socket.on("connect", function () {
      console.log("socket connected");
    });
    socket.on(`/weather-station/${deviceId}/data`, (data: any) => {
      //console.log(selectedSensor);
      setSocketData(data);
      setSocketTime(toTimestamp(data.datetime));
      //console.log(data.datetime)
    });
    socket.on("connect_error", (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });
    } 
    // else {
    //   console.log("loading...");
    // }

    return () => {
      setDataGraph([]);
      socket.on("disconnect", () => {
        console.log(socket.connected); // false
      });
    };
  }, [deviceId, label]);

  const [socketTime, setSocketTime] = React.useState<number | null>(null);
  const [socketData, setSocketData] = React.useState<any | null>(null);
  const [dataGraph, setDataGraph] = React.useState([]);

  return (
    <>
      <Line
        data={{
          datasets: [
            {
              label: label,
              backgroundColor: "#7C0DEB",
              borderColor: "#7C0DEB",
              cubicInterpolationMode: "monotone",
              fill: true,
              data: dataGraph,
            },
          ],
        }}
        options={{
          plugins: {
            datalabels: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false,
              },
              type: "realtime",
              realtime: {
                duration: 30000,
                refresh: 3000,
                delay: 2000,
                onRefresh: (chart) => {
                  chart.data.datasets.forEach((dataset) => {
                    //console.log(socketTime);
                    if (socketTime && socketData) {
                      dataset.data.push({
                        x: socketTime,
                        y: socketData[label],
                      });
                    } else {
                      dataset.data.push({
                        x: Date.now(),
                        y: 0,
                      });
                    }
                  });
                },
              },

              title: {
                display: true,
                text: "เวลา",
              },
            },
            y: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: Unit[label],
              },
            },
          },
        }}
      />
    </>
  );
};

export default RealtimeGraph;
