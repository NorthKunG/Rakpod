import React, { FC, useState, useEffect } from "react";
import moment from "moment";
import faker from "faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Unit } from "./RealtimeGraph";
import ChartDataLabels from "chartjs-plugin-datalabels";
import API from "./api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options:any = (label: string) => ({
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      grid: {
        display: true,
        //borderDash: [10, 10],
      },
    },
    y: {
      grid: {
        display: true,
        //borderDash: [10, 10],
        beginAtZero: true,
     
      },
      title: {
        display: true,
        text: Unit[label],
      },
    },
  },
  plugins: {
    datalabels: {
      clamp: true,
      align: 'top',
      anchor: 'end',
      font:{
        size:6
      }, 
      formatter: function(value:any, context:any) {
         const checkNull  =  typeof(value) === 'object' ? 0 : Number(value.toFixed(0));
         //console.log(checkNull)
        console.log(typeof(value))
        return checkNull;
      },
      borderColor:"#111111",
      backgroundColor:"#D3D3D3",
      borderRadius:5,
      color:"black",
    },
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
  borderRadius: 3,
});

export const labels = [
  "00.00",
  "01.00",
  "02.00",
  "03.00",
  "04.00",
  "05.00",
  "06.00",
  "07.00",
  "08.00",
  "09.00",
  "10.00",
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
  "17.00",
  "18.00",
  "19.00",
  "20.00",
  "21.00",
  "22.00",
  "23.00",
];

moment.updateLocale("th", {});
export const labelsWeek = [
  moment().subtract(7, "d").format("YYYY-MM-DD"),
  moment().subtract(6, "d").format("YYYY-MM-DD"),
  moment().subtract(5, "d").format("YYYY-MM-DD"),
  moment().subtract(4, "d").format("YYYY-MM-DD"),
  moment().subtract(3, "d").format("YYYY-MM-DD"),
  moment().subtract(2, "d").format("YYYY-MM-DD"),
  moment().subtract(1, "d").format("YYYY-MM-DD"),
];

function daysOfMonth() {
  var prevMonth = moment().subtract(1, "month").startOf("month");
  var prevMonthDays = prevMonth.daysInMonth();

  // Array to collect dates of previous month
  var prevMonthDates = [];

  for (var i = 0; i < prevMonthDays; i++) {
    // Calculate moment based on start of previous month, plus day offset
    var prevMonthDay = prevMonth.clone().add(i, "days").format("YYYY-MM-DD");

    prevMonthDates.push(prevMonthDay);
    labelsMonth = prevMonthDates;
  }
}
export let labelsMonth: string[] = [];
daysOfMonth();

const data1 = (
  label: Array<string>,
  color: string,
  name: string,
  data?: Array<number>
) => {
  return {
    labels: label,
    datasets: [
      {
        label: name,
        data: data,
        backgroundColor: color,
        borderColor: color,
        fill: true,
      },
    ],
  };
};

const BarGraph: FC<{
  selectedData: number;
  colorSensor: string;
  sensorName: string;
  deviceId?: string;
}> = ({ selectedData, colorSensor, sensorName, deviceId }) => {
  let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  let today = moment().format("YYYY-MM-DD");
  let numberDays = moment().format("DD");
  const [labelData, setLabelData] = useState<string[]>([]);


  //const [refresh,setRefresh] = useState(false);

  const fetchDataFromApiToday = async (deviceId: string, ) => {
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&date=${today}`
      )
      .then((res) => {
        console.log(res.data);
        //setLabelData(res.data.data);
        setLabelData(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };
  const fetchDataFromApiYesterday = async (deviceId: string,) => {
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&date=${yesterday}`
      )
      .then((res) => {
        console.log(res.data);
        setLabelData(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };
  const fetchDataFromApiLast7Days = async (
    deviceId: string,
  ) => {
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&last=7&lastType=days`
      )
      .then((res) => {
        console.log(res.data);
        setLabelData(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };
  const fetchDataFromApiLastMonth = async (
    deviceId: string,
  ) => {
    await API
      .get(
        `environment/weather-station/?stationid=${deviceId}&last=1&lastType=months`
      )
      .then((res) => {
        console.log(res.data);
        setLabelData(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };
  const fetchDataFromApiThisMonth = async (
    deviceId: string,
  ) => {
    await API
      // .get(
      //   `environment/weather-station/?stationid=${deviceId}&last=${numberDays}&lastType=days`
      // )
      .get(
        `environment/weather-station/?stationid=${deviceId}&last=0&lastType=months`
      )
      .then((res) => {
        console.log(res.data);
        setLabelData(res.data.data);
      })
      .catch(() => {
        alert("Error fetching");
      });
  };

  useEffect(() => {
    setLabelData([]);
    if (deviceId) {
      if (selectedData === 1) {
        fetchDataFromApiToday(deviceId);
      } else if (selectedData === 2) {
        fetchDataFromApiYesterday(deviceId);
      } else if (selectedData === 3) {
        fetchDataFromApiLast7Days(deviceId);
        //fetchDataFromApi(deviceId, value);
      } else if (selectedData === 4) {
        fetchDataFromApiThisMonth(deviceId);
      } else if (selectedData === 5) {
        fetchDataFromApiLastMonth(deviceId);
        //fetchDataFromApi(deviceId, selectedData);
      }
      //fetchDataFromApi(deviceId, value);
    }
  }, [selectedData]);
  return (
    <>
      <Bar
        options={options(sensorName)}
        data={
          selectedData === 1
            ? data1(
              labelData.map((d: any) => d.datetime.split(" ")[1]),

              colorSensor,
              sensorName,
              labelData.map((d: any) => d[sensorName])
            )
            : selectedData === 2
              ? data1(
                labelData.map((d: any) => d.datetime.split(" ")[1]),

                colorSensor,
                sensorName,
                labelData.map((d: any) => d[sensorName])
              )
              : selectedData === 3
                ? data1(
                  labelData.map((d: any) => d.datetime),

                  colorSensor,
                  sensorName,
                  labelData.map((d: any) => d[sensorName])
                )
                : selectedData === 4
                ? data1(
                  labelData.map((d: any) => d.datetime),

                  colorSensor,
                  sensorName,
                  labelData.map((d: any) => d[sensorName])
                )
                : data1(
                  labelData.map((d: any) => d.datetime),

                  colorSensor,
                  sensorName,
                  labelData.map((d: any) => d[sensorName])
                )
        }
      />
    </>
  );
};

export default BarGraph;
