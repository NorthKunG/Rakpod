-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2025 at 02:44 PM
-- Server version: 5.7.44
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rakpod`
--

-- --------------------------------------------------------

--
-- Table structure for table `weather_station`
--

CREATE TABLE `weather_station` (
  `id` int(11) NOT NULL,
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
  `status` enum('online','offline') DEFAULT 'offline'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `weather_station`
--

INSERT INTO `weather_station` (`id`, `uuid`, `name`, `description`, `sensor`, `location_latitude`, `location_longitude`, `address_detail`, `address_subdistrict`, `address_district`, `address_province`, `created_at`, `updated_at`, `status`) VALUES
(1, 'ADC-001', 'แยกหลังวัดใหญ่', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.82324791, 100.26512146, 'ใกล้กับวัดใหญ่ อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:40:57', '2025-05-28 12:40:57', 'offline'),
(2, 'ADC-002', 'ตลาดราชพฤษ', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.81938362, 100.27056885, 'ตลาดราชพฤกษ์ อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:03', '2025-05-28 12:41:03', 'offline'),
(3, 'ADC-003', 'สวนเฉลิมพระเกียรติ', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.82039070, 100.28890228, 'สวนเฉลิมพระเกียรติ อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:08', '2025-05-28 12:41:08', 'offline'),
(4, 'ADC-004', 'แยกธนาคารกรุงไทย (สวนกลางเมือง)', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.81518555, 100.26306915, 'แยกธนาคารกรุงไทย (สวนกลางเมือง) อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:13', '2025-05-28 12:41:13', 'offline'),
(5, 'ADC-005', 'ถนนคนเดิน (ฝั่งสพาน)', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.80502510, 100.24555206, 'ถนนคนเดิน (ฝั่งสะพาน) อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:19', '2025-05-28 12:41:19', 'offline'),
(6, 'ADC-006', 'แยกตลาดสถานีรถไฟ', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.81401634, 100.26466370, 'แยกตลาดสถานีรถไฟ อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:26', '2025-05-28 12:41:26', 'offline'),
(7, 'ADC-007', 'แยกมัสยิด (ข้ามทางรถไฟ)', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.82018280, 100.26633453, 'แยกมัสยิด (ข้ามทางรถไฟ) อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:32', '2025-05-28 12:41:32', 'offline'),
(8, 'ADC-008', 'ขนส่งเก่า (ในอาคารผู้โดยสาร)', 'สถานีตรวจวัดสภาพอากาศในจังหวัดพิษณุโลก', '[\"PM10\",\"PM25\",\"CO2\"]', 16.81836700, 100.27899933, 'ขนส่งเก่า (ในอาคารผู้โดยสาร) อำเภอเมืองพิษณุโลก', 'เมืองเก่า', 'เมืองพิษณุโลก', 'พิษณุโลก', '2025-05-28 12:41:38', '2025-05-28 12:41:38', 'offline');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `weather_station`
--
ALTER TABLE `weather_station`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `weather_station`
--
ALTER TABLE `weather_station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
