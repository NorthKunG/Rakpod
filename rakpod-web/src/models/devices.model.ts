export interface Device {
  id: number;
  name: string;
  AQI: number;
}
export interface Location {
  lat: number;
  lng: number;
}

export interface GetDataFromAPI {
  type: string;
  status: number;
  message: string;
  data: DataDeviceFromAPI[];
}

export interface DataDeviceFromAPI {
  placeid: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  addressDetail: string;
  addressDistrict: string;
  addressCity: string;
  addressCountry: string;
  projectid: number;
  airQuality: DataDeviceDetailsFromAPI;
}

interface DataDeviceDetailsFromAPI {
  datetime: string;
  pm25: Unit;
  pm10: Unit;
  o3: Unit;
  co: Unit;
  no2: Unit;
  so2: Unit;
  AQI: { Level: number; aqi: number };
}

interface Unit {
  index: number;
  value: number;
  unit: string;
}


