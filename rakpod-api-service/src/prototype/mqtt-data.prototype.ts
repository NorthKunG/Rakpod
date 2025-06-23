export interface IMqttData {
  info: IInfo;
  d: IData;
  millis: number;
  rssi: number;
  nickname: string;
  heap: number;
  datetime?: string;
  stationid: string;
}

export interface IInfo {
  ssid: string;
  id: string;
  mac: string;
  ip: string;
  flash_size: number;
  version: string;
}

export interface IData {
  pm1: number;
  pm2_5: number;
  pm10: number;
  temperature: number;
  humidity: number;
}
