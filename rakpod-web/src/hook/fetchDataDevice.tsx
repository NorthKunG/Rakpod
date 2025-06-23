import axios from "axios";
import { useEffect, useState } from "react";

interface SampleData {
  data: DataInSample;
  message: string;
  parameter: Parameter;
  status: number;
  type: string;
}

interface DataInSample {
  average: DataAllSensors;
  daily: DataAllSensors[];
  hourly: DataAllSensors[];
  minutely: DataAllSensors[];
}

interface Parameter {
  placeid: string;
  last: string;
  lasttype: string;
}

interface DataAllSensors {
  co2: number | null;
  datetime?: string;
  humidity: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  temp: number | null;
  wind: number | null;
}

const useFetchData = (url: string) => {
  const [data, setData] = useState<SampleData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(url);

        setData(response);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [url]);

  return {
    data,
    loading,
  };
};

export default useFetchData;
