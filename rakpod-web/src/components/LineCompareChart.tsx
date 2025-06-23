import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
const labels = [
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

export const options:ChartOptions<'line'> = {
   maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: '',
      },
      datalabels:{
        display:false,
        
      }
    },
  };  


const LineCompareChart:React.FC<{testData:any}> = ({testData}) => { 
    const data = {
        labels ,
        datasets:testData
          
      };
  return (
    <>
   <Line options={options} data={data} />
    </>
  )
}

export default LineCompareChart








