class WeatherStationPrototype {
  stationid: string;
  name: string;
  description: string;
  sensor: Array<String>;
  latitude: number;
  longitude: number;
  addressDetail: string;
  addressSubDistrict: string;
  addressDistrict: string;
  addressProvince: string;
  status: string;
  environmentInformation: any;

  constructor(data: any) {
    this.stationid = data["uuid"];
    this.name = data["name"];
    this.description = data["description"];
    this.sensor = JSON.parse(data["sensor"]);
    this.latitude = data["location_latitude"];
    this.longitude = data["location_longitude"];
    this.addressDetail = data["address_detail"];
    this.addressSubDistrict = data["address_subdistrict"];
    this.addressDistrict = data["address_district"];
    this.addressProvince = data["address_province"];
    this.status = data["status"];
    this.environmentInformation = {};
  }

  toString(): string {
    return `{"stationid" : ${this.stationid},"name" : ${this.name},"description" : ${this.description},"sensor" : ${this.sensor},"latitude" : ${this.latitude},"longitude" : ${this.longitude},"addressDetail" : ${this.addressDetail},"addressSubDistrict" : ${this.addressSubDistrict},"addressDistrict" : ${this.addressDistrict},"addressProvince" : ${this.addressProvince},"status" : ${this.status},"environmentInformation" : ${this.environmentInformation}}`;
  }
}

class WeatherStationPrototypeDB {
  // uuid: string
  name: string;
  description: string;
  sensor: any;
  location_latitude: number;
  location_longitude: number;
  address_detail: string;
  address_subdistrict: string;
  address_district: string;
  address_province: string;
  constructor(data: any) {
    // this.uuid = data['stationid']
    this.name = data["name"];
    this.description = data["description"];
    this.sensor =
      data["sensor"] == undefined ? undefined : JSON.stringify(data["sensor"]);
    this.location_latitude = data["latitude"];
    this.location_longitude = data["longitude"];
    this.address_detail = data["addressDetail"];
    this.address_subdistrict = data["addressSubDistrict"];
    this.address_district = data["addressDistrict"];
    this.address_province = data["addressProvince"];
  }
}

export { WeatherStationPrototype, WeatherStationPrototypeDB };
