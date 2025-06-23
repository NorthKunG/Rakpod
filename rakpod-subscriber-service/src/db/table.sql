-- smart_environment.weather_station definition

CREATE TABLE `weather_station` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sensor` varchar(1000) NOT NULL,
  `location_latitude` float(10,8) NOT NULL,
  `location_longitude` float(11,8) NOT NULL,
  `address_detail` varchar(255) DEFAULT '-',
  `address_subdistrict` varchar(255) DEFAULT '-',
  `address_district` varchar(255) DEFAULT '-',
  `address_province` varchar(255) DEFAULT '-',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('online','offline') DEFAULT 'offline',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- smart_environment.environment definition

CREATE TABLE `environment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `temperature_celsius` float DEFAULT NULL,
  `humidity_percent` float DEFAULT NULL,
  `pm1_microgram_per_cubicmeter` float DEFAULT NULL,
  `pm25_microgram_per_cubicmeter` int(11) DEFAULT NULL,
  `pm10_microgram_per_cubicmeter` int(11) DEFAULT NULL,
  `O3_ppb` int(11) DEFAULT NULL,
  `CO_ppm` float DEFAULT NULL,
  `NO2_ppb` int(11) DEFAULT NULL,
  `SO2_ppb` int(11) DEFAULT NULL,
  `CO2_ppm` float DEFAULT NULL,
  `wind_speed_kmph` float DEFAULT NULL,
  `wind_direction_degree` int(11) DEFAULT NULL,
  `rain_gauge_mm` float DEFAULT NULL,
  `light_lux` int(11) DEFAULT NULL,
  `UV_watt_per_squaremeter` float DEFAULT NULL,
  `wstation_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `environment_ibfk_1` (`wstation_id`),
  CONSTRAINT `environment_ibfk_1` FOREIGN KEY (`wstation_id`) REFERENCES `weather_station` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3954167 DEFAULT CHARSET=utf8;

-- smart_environment.environment_avg definition

CREATE TABLE `environment_avg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) DEFAULT NULL,
  `datetime` datetime NOT NULL,
  `temperature_celsius` float DEFAULT NULL,
  `humidity_percent` float DEFAULT NULL,
  `pm1_microgram_per_cubicmeter` float DEFAULT NULL,
  `pm25_microgram_per_cubicmeter` int(11) DEFAULT NULL,
  `pm10_microgram_per_cubicmeter` int(11) DEFAULT NULL,
  `O3_ppb` int(11) DEFAULT NULL,
  `CO_ppm` float DEFAULT NULL,
  `NO2_ppb` int(11) DEFAULT NULL,
  `SO2_ppb` int(11) DEFAULT NULL,
  `CO2_ppm` float DEFAULT NULL,
  `wind_speed_kmph` float DEFAULT NULL,
  `wind_direction_degree` int(11) DEFAULT NULL,
  `rain_gauge_mm` float DEFAULT NULL,
  `light_lux` int(11) DEFAULT NULL,
  `UV_watt_per_squaremeter` float DEFAULT NULL,
  `wstation_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `environment_avg_ibfk_1` (`wstation_id`),
  CONSTRAINT `environment_avg_ibfk_1` FOREIGN KEY (`wstation_id`) REFERENCES `weather_station` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=647 DEFAULT CHARSET=utf8;

-- event for summary
CREATE EVENT EnvironmentHourlySummary
ON SCHEDULE EVERY 1 HOUR
STARTS '2022-03-23 01:00:00.000'
ON COMPLETION NOT PRESERVE
ENABLE
DO INSERT INTO environment_avg
(
	count,
	datetime,
	temperature_celsius,
	humidity_percent,
	pm1_microgram_per_cubicmeter,
	pm25_microgram_per_cubicmeter,
	pm10_microgram_per_cubicmeter,
	O3_ppb,
	CO_ppm,
	NO2_ppb,
	SO2_ppb,
	CO2_ppm,
	wind_speed_kmph,
	wind_direction_degree,
	rain_gauge_mm,
	light_lux,
	UV_watt_per_squaremeter,
	wstation_id
)
	SELECT 
	count(*) AS count,
	CONCAT_WS(' ', DATE(now()- INTERVAL 1 HOUR), HOUR(now()- INTERVAL 1 HOUR)) AS datetime,
	AVG(e.temperature_celsius) AS temperature_celsius,
    AVG(e.humidity_percent) AS humidity_percent,
    AVG(e.pm1_microgram_per_cubicmeter) AS pm1_microgram_per_cubicmeter,
	AVG(e.pm25_microgram_per_cubicmeter) AS pm25_microgram_per_cubicmeter,
    AVG(e.pm10_microgram_per_cubicmeter) AS pm10_microgram_per_cubicmeter,
    AVG(e.O3_ppb) AS O3_ppb ,
    AVG(e.CO_ppm) AS CO_ppm,
    AVG(e.NO2_ppb) AS NO2_ppb,
    AVG(e.SO2_ppb) AS SO2_ppb,
    AVG(e.CO2_ppm) AS CO2_ppm,
    AVG(e.wind_speed_kmph) AS wind_speed_kmph,
    AVG(e.wind_direction_degree) AS wind_direction_degree,
    AVG(e.rain_gauge_mm) AS rain_gauge_mm,
    AVG(e.light_lux) AS light_lux,
    AVG(e.UV_watt_per_squaremeter) AS UV_watt_per_squaremeter,
	wstation_id
FROM environment e
WHERE DATE(e.datetime) = DATE(now()- INTERVAL 1 HOUR)
AND HOUR(e.datetime) = HOUR(now()- INTERVAL 1 HOUR)
GROUP BY wstation_id