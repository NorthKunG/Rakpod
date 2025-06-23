<h1>Smart Environment For Kamphaeng Phet Station</h1>

`api` can access data service that used in `envy.adcm.co.th/kpt`. in this document will represent only for Kamphaeng phet station (stationid=2eaebab9-aa6b-11ec-8305-0242ac120002).

- WEBSITE Domain    : `https://envy.adcm.co.th/kpt`
- API Domain        : `https://api-envy.adcm.co.th/`

---



all data for this station begin from `2022-04-08` to `present` 
using station uuid : `2eaebab9-aa6b-11ec-8305-0242ac120002`

---

`GET` - `https://api-envy.adcm.co.th/weather-station/id/:station_uuid`

for get AQI with weather-station in current datetime 

EXAMPLE : `https://api-envy.adcm.co.th/weather-station/id/2eaebab9-aa6b-11ec-8305-0242ac120002`

RESPONSE : 

```json
{
  "type": "success",
  "status": 200,
  "massage": "Weather Station Detail",
  "data": {
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
      "datetime": "2023-05-08 10:00:00",
      "temp": null,
      "hum": null,
      "PM1": null,
      "PM25": 15.6,
      "PM10": 21.47,
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
          "index": 16,
          "value": 15.6
        },
        "PM10": {
          "index": 11,
          "value": 21.47
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
          "Level": 1,
          "aqi": 16
        }
      }
    }
  }
}
```

---

`GET` - `api-envy.adcm.co.th/environment/weather-station/`

for get history of environment in given weather-station

### Environment API ** Method GET ONLY **

| Query params | type                  |
| :----------- | :-------------------- |
| stationid    | uuid                  |
| date         | date ("YYYY-MM-DD")   |
| last         | number > 0            |
| lastType     | enum('days','months') |



EXAMPLE : `api-envy.adcm.co.th/environment/weather-station/`

RESPONSE : 
```json
{
  "errors": [
    {
      "msg": "station id required and not empty",
      "param": "stationid",
      "location": "query"
    },
    {
      "msg": "Invalid value(s)",
      "param": "_error",
      "nestedErrors": [
        {
          "msg": "Invalid value",
          "param": "date",
          "location": "query"
        },
        {
          "msg": "date is require format YYYY-MM-DD",
          "param": "date",
          "location": "query"
        },
        {
          "msg": "Invalid value",
          "param": "last",
          "location": "query"
        },
        {
          "msg": "last is require and type number more than 0 and not empty",
          "param": "last",
          "location": "query"
        }
      ]
    }
  ]
}
```
THIS RESPONSE WILL SHOW THE MISSING VALUE IN QUERY PARAM

---

IN TERM TO USE THIS API `api-envy.adcm.co.th/environment/weather-station/` YOU NEED TO GIVE THE QUERYPARAM require `stationid` by default

AND OTHER QUERY PARAM BETWEEN `date` AND `last` 

`GET` - `api-envy.adcm.co.th/environment/weather-station/?stationid=${station_uuid&date={date in YYYY-MM-DD}`

for get history of environment in given weather-station in hourly in given date

EXAMPLE : `api-envy.adcm.co.th/environment/weather-station/?stationid=2eaebab9-aa6b-11ec-8305-0242ac120002&date=2023-05-05`

RESPONSE : 

```json
{
  "type": "success",
  "parameters": {
    "stationid": "2eaebab9-aa6b-11ec-8305-0242ac120002",
    "date": "2023-05-03"
  },
  "status": 200,
  "massage": "All Environment Custom type",
  "data": [
    {
      "datetime": "2023-05-03 00:00:00",
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
    },
    ................................................
        {
      "datetime": "2023-05-03 14:00:00",
      "temp": 46.08,
      "hum": 21.28,
      "PM1": null,
      "PM25": 18,
      "PM10": 24.69,
      "O3": null,
      "CO": 0,
      "SO2": null,
      "NO2": null,
      "CO2": 473.69,
      "windDr": 241,
      "windSp": 3,
      "rain": null,
      "light": 53333,
      "UV": 0,
      "aqi": {
        "PM25": {
          "index": 18,
          "value": 18
        },
        "PM10": {
          "index": 12,
          "value": 24.69
        },
        "O3": {
          "index": null,
          "value": null
        },
        "CO": {
          "index": 0,
          "value": 0
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
          "Level": 1,
          "aqi": 18
        }
      }
    },
    .....................................................
```


`GET` - `api-envy.adcm.co.th/environment/weather-station/?stationid=${station_uuid&last={number of previous data}&lastType=${type of previous data ['days','months']}`

for get history of environment in given weather-station in previous `?? days` or `?? months` in daily data

EXAMPLE : `api-envy.adcm.co.th/environment/weather-station/?stationid=2eaebab9-aa6b-11ec-8305-0242ac120002&last=2&lastType=days`

RESPONSE : 

```json
{
  "type": "success",
  "parameters": {
    "stationid": "2eaebab9-aa6b-11ec-8305-0242ac120002",
    "last": "2",
    "lasttype": "days"
  },
  "status": 200,
  "massage": "All Environment Custom type",
  "data": [
    {
      "datetime": "2023-05-06",
      "temp": 48.32,
      "hum": 18.32,
      "PM1": null,
      "PM25": 16.77,
      "PM10": 22.97,
      "O3": null,
      "CO": 0,
      "SO2": null,
      "NO2": null,
      "CO2": 500.71,
      "windDr": 103,
      "windSp": 17,
      "rain": null,
      "light": 32546,
      "UV": 0,
      "aqi": {
        "PM25": {
          "index": 17,
          "value": 16.77
        },
        "PM10": {
          "index": 11,
          "value": 22.97
        },
        "O3": {
          "index": null,
          "value": null
        },
        "CO": {
          "index": 0,
          "value": 0
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
          "Level": 1,
          "aqi": 17
        }
      }
    },
    {
      "datetime": "2023-05-07",
      "temp": 45.85,
      "hum": 21.03,
      "PM1": null,
      "PM25": 15.45,
      "PM10": 21.24,
      "O3": null,
      "CO": 0,
      "SO2": null,
      "NO2": null,
      "CO2": 476.03,
      "windDr": 58,
      "windSp": 79,
      "rain": null,
      "light": 38696,
      "UV": 0,
      "aqi": {
        "PM25": {
          "index": 15,
          "value": 15.45
        },
        "PM10": {
          "index": 11,
          "value": 21.24
        },
        "O3": {
          "index": null,
          "value": null
        },
        "CO": {
          "index": 0,
          "value": 0
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
          "Level": 1,
          "aqi": 15
        }
      }
    }
  ]
}
```

EXAMPLE : `api-envy.adcm.co.th/environment/weather-station/?stationid=2eaebab9-aa6b-11ec-8305-0242ac120002&last=1&lastType=months`

RESPONSE : 

```json
{
  "type": "success",
  "parameters": {
    "stationid": "2eaebab9-aa6b-11ec-8305-0242ac120002",
    "last": "1",
    "lasttype": "months"
  },
  "status": 200,
  "massage": "All Environment Custom type",
  "data": [
    {
      "datetime": "2023-04-01",
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
    },
    ......................................
        {
      "datetime": "2023-04-30",
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
  ]
}
```

---

<h2>PARAMETER DESCRIPTION</h2>


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
| addressSubDistrict |      ท่าโพธิ์         |
| addressDistrict    |       เมือง        |
| addressProvince    |      พิษณุโลก      |
| status             | 'online','offline' |


---

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


---


