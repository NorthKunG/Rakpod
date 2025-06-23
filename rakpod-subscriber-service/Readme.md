# Project Adc Microsystems Smart Environment (name)

## NEW!! EXPORT ALL STATIONS
POST `environment/export` to export weather data by stationid and
body = {
    stationid : [`uuid of station`] uuid station list of selected station
}
<details>
<summary>Respond</summary>
example : `/environment/export?date=2024-04-17`

```json
{
    "type": "success",
    "parameters": {
        "stationid": [
            "4de4efaf-39a2-11ed-8305-0242ac120002",
            "67d66395-39a2-11ed-8305-0242ac120002"
        ],
        "date": "2024-04-17"
    },
    "status": 201,
    "massage": "Export All Environment Custom type",
    "data": {
        "path": "/environment/export/get-file/envy_ws20240417_hourly_req20240422"
    }
}
```
</details>

## GET WEATHER STATION BY PROVINCE
GET `weather-station/province/:provinceCode` to get weather station by province code such as `PLK`, `KPT` or by province name such as `กำแพงเพชร`, `พิษณุโลก`

<details>
<summary>Respond</summary>
example : `weather-station/province/KPT` or weather-station/province/กำแพงเพชร

```json
{
    "type": "success",
    "status": 200,
    "massage": "All Weather Station",
    "results": 1,
    "data": [
        {
            "stationid": "2eaebab9-aa6b-11ec-8305-0242ac120002",
            "name": "มหาวิทยาลัยราชภัฏกำแพงเพชร",
            "description": "มหาวิทยาลัยราชภัฏกำแพงเพชร",
            "sensor": [
                "PM10",
                "PM25",
                "CO",
                "CO2",
                "UV",
                "hum",
                "light",
                "rain",
                "temp",
                "windDr",
                "windSp"
            ],
            "latitude": 16.48307228,
            "longitude": 99.55804443,
            "addressDetail": "69 หมู่ 1",
            "addressSubDistrict": "นครชุม",
            "addressDistrict": "เมือง",
            "addressProvince": "กำแพงเพชร",
            "status": "offline",
            "environmentInformation": {
                "datetime": "2023-04-29 14:00:00",
                "temp": null,
                "hum": null,
                "PM1": null,
                "PM25": null,
                "PM10": null,
                "O3": null,
                "CO": null,
                "SO2": null,
                "NO2": null,
                "CO2": null,
                "windDr": null,
                "windSp": null,
                "rain": null,
                "light": null,
                "UV": null,
                "aqi": {
                    "PM25": {
                        "index": null,
                        "value": null
                    },
                    "PM10": {
                        "index": null,
                        "value": null
                    },
                    "O3": {
                        "index": null,
                        "value": null
                    },
                    "CO": {
                        "index": null,
                        "value": null
                    },
                    "NO2": {
                        "index": null,
                        "value": null
                    },
                    "SO2": {
                        "index": null,
                        "value": null
                    },
                    "AQI": {
                        "Level": null,
                        "aqi": null
                    }
                }
            }
        }
    ]
}
```
</details>

## GET COMPARE DATA OF ALL WSTATION

POST `environment/compare` to get weather station compare with a sensor
    using req.body in json format
body = {
    stationlist : [`uuid of station`] uuid station list of selected station
    sensor : sensor key name from get sensor api
}

using query string param for set type of data
+++ ?date=`YYYY-MM-DD` to get data in given date
+++ ?to=`YYYY-MM-DD`&from=`YYYY-MM-DD` to get data between the date

### editing new format of response
```
    example : `environment/compare?from=2022-10-22&to=2022-10-25`
    req.body : {
    "stationlist":["3cdc224f-39a2-11ed-8305-0242ac120002", "4de4efaf-39a2-11ed-8305-0242ac120002","5c5e98e0-39a2-11ed-8305-0242ac120002", "67d66395-39a2-11ed-8305-0242ac120002", "82c75f59-39a2-11ed-8305-0242ac120002", "fc7e3523-39a1-11ed-8305-0242ac120002", "217e804a-39a2-11ed-8305-0242ac120002"],
    "sensor":"pm25_microgram_per_cubicmeter"
}
```
<details>
<summary>Respond</summary>

<p>

```
{
    "type": "success",
    "parameters": {
        "sensorKey": "pm25_microgram_per_cubicmeter",
        "wstationlist": [
            "3cdc224f-39a2-11ed-8305-0242ac120002",
            "4de4efaf-39a2-11ed-8305-0242ac120002",
            "5c5e98e0-39a2-11ed-8305-0242ac120002",
            "67d66395-39a2-11ed-8305-0242ac120002",
            "82c75f59-39a2-11ed-8305-0242ac120002",
            "fc7e3523-39a1-11ed-8305-0242ac120002",
            "217e804a-39a2-11ed-8305-0242ac120002"
        ],
        "begindate": "2022-10-22",
        "enddate": "2022-10-25"
    },
    "status": 200,
    "massage": "All Environment Compare",
    "data": [
        {
            "sensor": "pm25_microgram_per_cubicmeter",
            "data": [
                {
                    "datetime": "2022-10-22 00:00:00",
                    "weather_station_id": 18,
                    "weather_station_uuid": "3cdc224f-39a2-11ed-8305-0242ac120002",
                    "weather_station_name": "คลังน้ำมันปตท. (ถนนศรีสุริโยทัย เลียบทางรถไฟ)",
                    "sensor": 27.1
                },
                {
                    "datetime": "2022-10-22 01:00:00",
                    "weather_station_id": 18,
                    "weather_station_uuid": "3cdc224f-39a2-11ed-8305-0242ac120002",
                    "weather_station_name": "คลังน้ำมันปตท. (ถนนศรีสุริโยทัย เลียบทางรถไฟ)",
                    "sensor": 26
                },
                {
                    "datetime": "2022-10-22 02:00:00",
                    "weather_station_id": 18,
                    "weather_station_uuid": "3cdc224f-39a2-11ed-8305-0242ac120002",
                    "weather_station_name": "คลังน้ำมันปตท. (ถนนศรีสุริโยทัย เลียบทางรถไฟ)",
                    "sensor": 27.47
                },
.................
            ]
        },
        {
            "sensor": "pm25_microgram_per_cubicmeter",
            "data": [
                {
                    "datetime": "2022-10-22 00:00:00",
                    "weather_station_id": 19,
                    "weather_station_uuid": "4de4efaf-39a2-11ed-8305-0242ac120002",
                    "weather_station_name": "หลังตลาดกิตติกร ตลาดไนท์พลาซ่า",
                    "sensor": 20.44
                },
                {
                    "datetime": "2022-10-22 01:00:00",
                    "weather_station_id": 19,
                    "weather_station_uuid": "4de4efaf-39a2-11ed-8305-0242ac120002",
                    "weather_station_name": "หลังตลาดกิตติกร ตลาดไนท์พลาซ่า",
                    "sensor": 20.89
                },
...............
            ]
        }
    ]
}
```

</p>
</details>

### OLD FORMAT
```
    example : `environment/compare?from=2022-10-10&to=2022-10-12`
    req.body : {
    "stationlist":["3cdc224f-39a2-11ed-8305-0242ac120002", "4de4efaf-39a2-11ed-8305-0242ac120002","5c5e98e0-39a2-11ed-8305-0242ac120002", "67d66395-39a2-11ed-8305-0242ac120002", "82c75f59-39a2-11ed-8305-0242ac120002", "fc7e3523-39a1-11ed-8305-0242ac120002", "217e804a-39a2-11ed-8305-0242ac120002"],
    "sensor":["pm25_microgram_per_cubicmeter","pm10_microgram_per_cubicmeter"]
}
```
<details>
<summary>Respond</summary>

<p>

```
{
    "type": "success",
    "parameters": {
        "sensorList": [
            "pm25_microgram_per_cubicmeter",
            "pm10_microgram_per_cubicmeter"
        ],
        "wstationlist": [
            "3cdc224f-39a2-11ed-8305-0242ac120002",
            "4de4efaf-39a2-11ed-8305-0242ac120002",
            "5c5e98e0-39a2-11ed-8305-0242ac120002",
            "67d66395-39a2-11ed-8305-0242ac120002",
            "82c75f59-39a2-11ed-8305-0242ac120002",
            "fc7e3523-39a1-11ed-8305-0242ac120002",
            "217e804a-39a2-11ed-8305-0242ac120002"
        ],
        "begindate": "2022-10-10",
        "enddate": "2022-10-12"
    },
    "status": 200,
    "massage": "All Environment Compare",
    "data": {
        "wstation": [
            {
                "id": 18,
                "name": "คลังน้ำมันปตท. (ถนนศรีสุริโยทัย เลียบทางรถไฟ)"
            },
            {
                "id": 19,
                "name": "หลังตลาดกิตติกร ตลาดไนท์พลาซ่า"
            },
            {
                "id": 20,
                "name": "บริเวณสี่แยกบ้านแขก"
            },
        ],
        "compare": [
             {
                "sensor": "pm25_microgram_per_cubicmeter",
                "data": [
                    {
                        "18": 0.06,
                        "19": 1.05,
                        "20": 1.77,
                        "21": 0.01,
                        "23": 1,
                        "24": 29,
                        "25": 0,
                        "datetime": "2022-10-10 00:00:00"
                    },
                    {
                        "18": 0.01,
                        "19": 0.69,
                        "20": 1.91,
                        "21": 0,
                        "23": 1,
                        "24": 29,
                        "25": 0,
                        "datetime": "2022-10-10 01:00:00"
                    },
                    {
                        "18": 0.01,
                        "19": 0.53,
                        "20": 1.37,
                        "21": 0.01,
                        "23": 1,
                        "24": 27,
                        "25": 0.01,
                        "datetime": "2022-10-10 02:00:00"
                    },
                    
                ]
            },
            {
                "sensor": "pm10_microgram_per_cubicmeter",
                "data": [
                    {
                        "18": 0.11,
                        "19": 1.3,
                        "20": 2.01,
                        "21": 0.02,
                        "23": 1,
                        "24": 30,
                        "25": 0.02,
                        "datetime": "2022-10-10 00:00:00"
                    },
                    .........
        ]
    }
}
```

</p>
</details>


# EXPORT DATA TO XLSX FILE
GET `/environment/export/:stationid` export hours data for a station by uuid
```
query :  
    date=`YYYY-MM-DD`
    last=`number of day/month`&lastType=[`days`,`months`]
    from=`YYYY-MM-DD`&to=`YYYY-MM-DD`
+++
    type=`type of data` [`daily`,`hourly`(default)] --> `minutely` inprogress on implement
    AQI=`some text` [`true`,`yes`,`OK`,....] if don't use , just ignore this query (default is NOT USE)
```
```
PS.
    "date" option can using "type" : `hourly` and `minutely`

    "last" option can using "type" : `hourly` and `daily`

    "from"/"to" option can using "type" : `hourly` , `daily` and ---`minutely` not using 

    !!! "AQI" option can using with "type" : `hourly` and `daily`
    `minutely` using with date only
```

<details>
<summary>Respond</summary>

<p>

example : `environment/export/3cdc224f-39a2-11ed-8305-0242ac120002?from=2022-09-23&to=2022-09-25`
```
{
    "type": "success",
    "parameters": {
        "stationid": "3cdc224f-39a2-11ed-8305-0242ac120002",
        "begindate": "2022-09-23",
        "enddate": "2022-09-25"
    },
    "status": 200,
    "massage": "Export All Environment Custom type",
    "data": {
        "path": "/environment/export/get-file/envy_ws18_20220923to20220925_req20220925"
    }
}
```

</p>
</details>

# RESTFUL API Smart Environment application and socket.io service

# Data Form for collect sensor data from device

```
{
    _uuid,
    _temp,_hum,_pm1,_pm2_5,
    _pm10,_o3,_co,_so2,
    _no2,_co2,_win_dir,_win_sp,
    _rain,_light,_uv
}
```

## socket.io version 3.1.0 for Real-time Data

```
connect ${host}/socketio/
example
socket = io("https://api-envy.adcm.co.th", {
    path: "/socketio/"
});
```

| Description        | Event                              | Event Example                                              |
| :----------------- | :--------------------------------- | :--------------------------------------------------------- |
| for Real-Time Data | /weather-station/${stationid}/data | /weather-station/c505faed-ff5d-469d-bef9-6d0dab5cfa2a/data |

## About Weather Station

### Weather Station Parameter

| parameter          |      example       |
| :----------------- | :----------------: |
| stationid          |        uuid        |
| name               |  Borirak Station   |
| description        |   for test only    |
| sensor             |   PM1,PM25,PM10    |
| latitude           |    16.74546432     |
| longitude          |    100.19811249    |
| addressDetail      |        "-"         |
| addressSubDistrict |      ท่าโพธิ์      |
| addressDistrict    |       เมือง        |
| addressProvince    |      พิษณุโลก      |
| status             | 'online','offline' |

#### body example for create weather station

```
{
    "name" : "Kamphaeng Phet Rajabhat University",
    "description" : "It is used to measure the environment. of Kamphaeng Phet Rajabhat University",
    "latitude" : 16.45236015,
    "longitude" : 99.51399994,
    "addressDetail" : "69 หมู่ 1",
    "addressSubDistrict" : "นครชุม",
    "addressDistrict" :"เมือง",
    "addressProvince" : "กำแพงเพชร",
    "sensor" : ["PM25","PM10","CO","temp","hum","windDr","windSp","CO2","rain","light","UV"]
}
```

### Weather Station API

| Description                                                             | Endpoint                       | Method |
| :---------------------------------------------------------------------- | :----------------------------- | -----: |
| All Weather Station with Current Environment Information                | /weather-station               |    GET |
| A Weather Station with Current Environment Information using station id | /weather-station/id/:stationid |    GET |
| Create a Weather Station                                                | /weather-station               |   POST |
| Update a Weather Station using station id                               | /weather-station/id/:stationid |    PUT |
| Delete a Weather Station using station id                               | /weather-station/id/:stationid | DELETE |

## About Environment

### Environment data Parameter

| parameter | meaning                      |   unit |
| :-------- | :--------------------------- | -----: |
| temp      | Temperature                  |     °C |
| hum       | Humidity                     |      % |
| PM1       | Particulate matter <= 1 μm   |  µg/m³ |
| PM25      | Particulate matter <= 2.5 μm |  µg/m³ |
| PM10      | Particulate matter <= 10 μm  |  µg/m³ |
| O3        | Ozone                        |    ppb |
| CO        | Carbon Monoxide              |    ppm |
| NO2       | Nitrogen Dioxide             |    ppb |
| SO2       | Sulfur Dioxide               |    ppb |
| CO2       | Carbon Dioxide               |    ppm |
| windDr    | Wind Direction               | degree |
| windSp    | Wind Speed                   |   km/h |
| rain      | Rain Volume per day          |     mm |
| light     | Light                        |    lux |
| UV        | Ultraviolet                  |   W/m² |

### Environment API ** Method GET ONLY **

| Query params | type                  |
| :----------- | :-------------------- |
| stationid    | uuid                  |
| date         | date ("YYYY-MM-DD")   |
| last         | number > 0            |
| lastType     | enum('days','months') |

```
query(params) require!
    one date = stationid,date('yyyy-mm-dd')
    last x days,month,year = stationid,last,lasttype({days,months,years})
```

| Description                | Endpoint                     | Query                   |
| :------------------------- | :--------------------------- | :---------------------- |
| Environment by onedate     | /environment/weather-station | stationid,date          |
| Environment by last x type | /environment/weather-station | stationid,last,lastType |

<!-- | Environment by between two date | /weather-station | -->

## License

[ADC MICROSYSTEMS](https://adcm.co.th)
