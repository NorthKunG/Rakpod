export interface NewGetDataFromAPI {
  type: string;
  status: number;
  message: string;
  data: DeviceNew[];
}

export interface DeviceNew {
  stationid: string;
  name: string;
  description: string;
  sensor: Array<string>;
  latitude: number;
  longitude: number;
  addressDetail: string;
  addressSubDistrict: string;
  addressDistrict: string;
  addressProvince: string;
  status: string;
  environmentInformation: EnvironmentInformation;
}

interface EnvironmentInformation {
  datetime: string;
  temp: number;
  hum: number;
  PM1: number;
  PM25: number;
  PM10: number;
  O3: number;
  CO: number;
  SO2: number;
  NO2: number;
  CO2: number;
  windDr: number;
  windSp: number;
  rain: number;
  light: number;
  UV: number;
  aqi: {
    PM25: NewUnit;
    PM10: NewUnit;
    O3: NewUnit;
    CO: NewUnit;
    NO2: NewUnit;
    SO2: NewUnit;
    AQI: {
      Level: number;
      aqi: number;
    };
  };
}

interface NewUnit {
  index: number;
  value: number;
}
