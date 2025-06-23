

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => 1000),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export const options:ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio:false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
    datalabels:{
      display:true,
      align:"top",
      anchor:"end",
      backgroundColor:"#D3D3D3",
      borderRadius:5,
      color:"black",
      borderWidth:2,
      borderColor:"green"
      
      
    }
  },
  
  
};
const TestComponent: React.FC = () => {
  return (
    <>
    <div className="h-[300px]">

    <Bar options={options} data={data} />;
    </div>

      {/* <div className="test_css">Test Component</div> */}
    </>
  );
};

export default TestComponent;
