import React, { FC, useState, useEffect, useRef } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartOptions,
  Legend,
} from "chart.js";
import { Bar  } from "react-chartjs-2";
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

let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
let today = moment().format("YYYY-MM-DD");
// let numberDays = moment().format("DD");



const fetchDataFromApiToday = async (deviceId: string) => {
  return await API.get(
    `environment/weather-station/?stationid=${deviceId}&date=${today}`
  );
};

const fetchDataFromApiSelectday = async (deviceID : string, date : string) => {
  return await API.get(
    `environment/weather-station/?stationid=${deviceID}&date=${date}`
  );
}

const fetchDataFromApiYesterday = async (deviceId: string) => {
  return await API.get(
    `environment/weather-station/?stationid=${deviceId}&date=${yesterday}`
  );
};
const fetchDataFromApiLast7Days = async (deviceId: string) => {
  return await API.get(
    `environment/weather-station/?stationid=${deviceId}&last=7&lastType=days`
  );
};
const fetchDataFromApiLastMonth = async (deviceId: string) => {
  return await API.get(
    `environment/weather-station/?stationid=${deviceId}&last=1&lastType=months`
  );
};
const fetchDataFromApiThisMonth = async (deviceId: string) => {
  return await API.get(
    `environment/weather-station/?stationid=${deviceId}&last=0&lastType=months`
  );
  // return await axios.get(
  //   `https://api-envy.adcm.co.th/environment/weather-station/?stationid=${deviceId}&last=${numberDays}&lastType=days`
  // );
};

const options: ChartOptions<"bar"> = {
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    bar: {
      borderWidth: 2,
      borderRadius: 3,
    },
  },

  scales: {
    x: {
      grid: {
        display: true,
      },
    },
    y: {
      grid: {
        display: true,
  
      },
      title: {
        display: true,
      },
    },
  },
  plugins: {
    datalabels: {
      clamp: true,
      align: "top",
      anchor: "end",
      font: (context) => {
        return { size: 12 };
      },
      formatter: function (value: any, context: any) {
        const checkNull =
          typeof value === "object" ? 0 : Number(value.toFixed(0));
        return checkNull;
      },
      borderColor: "#111111",
      backgroundColor: "#D3D3D3",
      borderRadius: 5,
      color: "black",
    },
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const dataOptions = (
  label: Array<string>,
  color: string | Array<any>,
  BorderColor: string | Array<any>,
  name: string,
  data: Array<number>
) => {
  return {
    labels: label,
    datasets: [
      {
        label: name,
        data: data,
        backgroundColor: color,
        borderColor: BorderColor,
      },
    ],
  };
};

const BarChart: FC<{ data_graph:any; selectedSensor: string; deviceId: string ; chartRef : any }> = ({
  data_graph,
  selectedSensor,
  deviceId,
  chartRef
}) => {
  const [selectButton, setSelectButton] = useState(1);
  const [rawData, setRawData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any | null>(null);
  // const chartRef = useRef<any>(null);
  let data = data_graph;
  
  // const handleExportChartToImage = async() => {


   
  //     const chart = chartRef.current;
  //     const canvas = chart?.toBase64Image();
  //     console.log(canvas)

  //     if (canvas) {
  //       const link = document.createElement("a");
  //       link.href = canvas;
  //       link.download = "chart.png";
  //       link.click();
  //     }
  

   

    

    
  // };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch (selectButton) {
          case 1:
            response = await fetchDataFromApiToday(deviceId);
            break;
          case 2:
            response = await fetchDataFromApiYesterday(deviceId);
            break;
          case 3:
            response = await fetchDataFromApiLast7Days(deviceId);
            break;
          case 4:
            response = await fetchDataFromApiThisMonth(deviceId);
            break;
          case 5:
            response = await fetchDataFromApiLastMonth(deviceId);
            break;
          default:
            return;
        }
        
        const { data } = response.data;
        setRawData(data);
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  
    return () => {
      setRawData([]);
      // Uncomment and implement the line below if you need to handle chart cleanup
      // localStorage.setItem('chart', chartRef.current.toBase64Image());
    };
  }, [deviceId, selectButton]);
  
  // Effect for fetching data based on data_graph
  useEffect(() => {
    if (data_graph != null) {
      const fetchData = async () => {
        try {
          const response = await fetchDataFromApiSelectday(deviceId, data_graph);
          const { data } = response.data;
          setRawData(data);
  
        } catch (error) {
          console.error("Error fetching data for selected day:", error);
        }
      };
  
      fetchData();
    }
  }, [data_graph, deviceId]); // Ensure `deviceId` is included if it's used in `fetchDataFromApiSelectday`

  // useEffect(() => {
  //   handleExportChartToImage();
  // }
  // ,[selectButton,data_graph])



 

  useEffect(() => {
    const conditionColors: string[] = [];
    const conditionBorderColors: string[] = [];
    const color: any =
      selectedSensor === "PM25" || selectedSensor === "PM10" || selectedSensor === "S02"
        ? conditionColors
        : "#939fe4";
    const colorBorder: any =
      selectedSensor === "PM25" || selectedSensor === "PM10"  || selectedSensor === "S02"
        ? conditionBorderColors
        : "#464d77";
    const labels: string[] =
      selectButton === 1 || selectButton === 2
        ? rawData.map((d: any) => d.datetime.split(" ")[1])
        : rawData.map((d: any) => d.datetime);
    const dataLabels: number[] = rawData.map((d: any) => d[selectedSensor]);
    if (selectedSensor === "PM25") {
      for (const d in dataLabels) {
        if (dataLabels[d] <= 15) {
          conditionColors.push("#47B5FF");
          conditionBorderColors.push("#47B5FF");
        } else if (dataLabels[d] <= 25) {
          conditionColors.push("#81CD47");
          conditionBorderColors.push("#81CD47");
        } else if (dataLabels[d] <= 37.5) {
          conditionColors.push("#FFEB12");
          conditionBorderColors.push("#FFEB12");
        } else if (dataLabels[d] <= 75) {
          conditionColors.push("#FD841F");
          conditionBorderColors.push("#FD841F");
        } else {
          conditionColors.push("#E64848");
          conditionBorderColors.push("#E64848");
        }

        //console.log(dataLabels[d]);
      }
    } else if (selectedSensor === "PM10") {
      for (const d in dataLabels) {
        if (dataLabels[d] <= 50) {
          conditionColors.push("#47B5FF");
          conditionBorderColors.push("#47B5FF");
        } else if (dataLabels[d] <= 80) {
          conditionColors.push("#81CD47");
          conditionBorderColors.push("#81CD47");
        } else if (dataLabels[d] <= 120) {
          conditionColors.push("#FFEB12");
          conditionBorderColors.push("#FFEB12");
        } else if (dataLabels[d] <= 180) {
          conditionColors.push("#FD841F");
          conditionBorderColors.push("#FD841F");
        } else {
          conditionColors.push("#E64848");
          conditionBorderColors.push("#E64848");
        }

        //console.log(dataLabels[d]);
      }
    } else if (selectedSensor === "SO2") {
      for (const d in dataLabels) {
        if (dataLabels[d] <= 100) {
          conditionColors.push("#47B5FF");
          conditionBorderColors.push("#47B5FF");
        } else if (dataLabels[d] <= 200) {
          conditionColors.push("#81CD47");
          conditionBorderColors.push("#81CD47");
        } else if (dataLabels[d] <= 300) {
          conditionColors.push("#FFEB12");
          conditionBorderColors.push("#FFEB12");
        } else if (dataLabels[d] <= 400) {
          conditionColors.push("#FD841F");
          conditionBorderColors.push("#FD841F");
        } else {
          conditionColors.push("#E64848");
          conditionBorderColors.push("#E64848");
        }

        //console.log(dataLabels[d]);
      }
    }
  // console.log(conditionColors);
    const chartData = dataOptions(
      labels,
      color,
      colorBorder,
      selectedSensor,
      dataLabels
    );

    setChartData(chartData);

    
  }, [selectedSensor, rawData, selectButton]);

  
console.log('chartRef',chartRef.current?.toBase64Image())
  return (
    <div>
      <div className="w-full flex justify-center gap-2 my-2 ">
        
        <button
          className={`${
            selectButton === 1
              ? "bg-[#DBDBDB] text-[#888888] font-bold"
              : "bg-[#888888] text-white font-medium"
          }  text-[10px] ipad:text-[14px]  px-4 py-2 rounded-lg shadow-lg `}
          onClick={() => setSelectButton(1)}
        >
          วันนี้
        </button>
        <button
          className={`${
            selectButton === 2
              ? "bg-[#DBDBDB] text-[#888888] font-bold"
              : "bg-[#888888] text-white font-medium"
          }  text-[10px] ipad:text-[14px]  px-4 py-1 rounded-lg shadow-lg `}
          onClick={() => setSelectButton(2)}
        >
          เมื่อวาน
        </button>
        <button
          className={`${
            selectButton === 3
              ? "bg-[#DBDBDB] text-[#888888] font-bold"
              : "bg-[#888888] text-white font-medium"
          }  text-[10px] ipad:text-[14px]  px-4 py-1 rounded-lg shadow-lg `}
          onClick={() => setSelectButton(3)}
        >
          ย้อนหลัง 7 วัน
        </button>
        <button
          className={`${
            selectButton === 4
              ? "bg-[#DBDBDB] text-[#888888] font-bold"
              : "bg-[#888888] text-white font-medium"
          }  text-[10px] ipad:text-[14px]  px-4 py-1 rounded-lg shadow-lg `}
          onClick={() => setSelectButton(4)}
        >
          เดือนนี้
        </button>
        <button
          className={`${
            selectButton === 5
              ? "bg-[#DBDBDB] text-[#888888] font-bold"
              : "bg-[#888888] text-white font-medium"
          }  text-[10px] ipad:text-[14px]  px-4 py-1 rounded-lg shadow-lg `}
          onClick={() => setSelectButton(5)}
        >
          เดือนที่แล้ว
        </button>
      </div>
      {/* {selectedSensor} */}
      {/* <button className=" z-[1000] btn btn-sm bg-[#00CC99] text-white font-bold" onClick={handleExportChartToImage}>ส่งออกข้อมูลกราฟ</button> */}
      <div className="h-[300px]">
        {chartData && <Bar ref={chartRef} data={chartData} options={options} />}
        
        
      </div>
    </div>
  );
  
};

export default BarChart;
