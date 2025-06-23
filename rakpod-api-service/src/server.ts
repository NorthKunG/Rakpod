import MqttController from './controllers/subscriber.controller';
import http from 'http';
import { Server } from 'socket.io';
import StoreDataController from './controllers/storeData.controller';

import express from 'express';
const app = express();
const server = http.createServer(app);

// สร้าง Socket.IO server
const io = new Server(server, {
    path: '/socketio/',
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

// เรียกใช้ initSocketIO เพื่อส่ง io instance ไปยัง StoreDataController
StoreDataController.initSocketIO(io);

// ตั้งค่า Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // เริ่มต้น server
const PORT = process.env.PORT || 2541;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

MqttController.subscriber();

/*
setInterval(() => {
    testSendData();
}, 1000)

import { MqttClient } from './config/mqtt';
const client = MqttClient();
client.on("connect", function () {
    console.log("Mqtt connection success for test sent data");
});
const testSendData = () => {
    const weatherStationTest1 = {
        _uuid: "c505faed-ff5d-469d-bef9-6d0dab5cfa2a",
        _temp: randomInteger(25, 35),
        _hum: randomInteger(30, 80),
        _pm1: randomInteger(30, 100) / 100
    }
    const weatherStationTest2 = {
        _uuid: "c505faed-ff5d-469d-bef9-6d0dab5cfa2b",
        _temp: randomInteger(25, 35),
        _hum: randomInteger(70, 80),
        _pm2_5: randomInteger(0, 25),
        _pm10: randomInteger(0, 50)
    }
    const weatherStationTest3 = {
        _uuid: "c505faed-ff5d-469d-bef9-6d0dab5cfa2c",
        _pm2_5: randomInteger(25, 35),
        _pm10: randomInteger(0, 55),
        _o3: randomInteger(0, 40),
        _co: randomInteger(0, 55) / 10,
        _so2: randomInteger(0, 70),
        _no2: randomInteger(0, 80)
    }
    const weatherStationTest4 = {
        uuid: "c505faed-ff5d-469d-bef9-6d0dab5cfa2d",
        pm2_5: 0,
        pm10: 0
    }
    // console.log(weatherStationTest1);
    client.publish('/adcm/smart-environment/data', JSON.stringify(weatherStationTest1));
    client.publish('/adcm/smart-environment/data', JSON.stringify(weatherStationTest2));
    client.publish('/adcm/smart-environment/data', JSON.stringify(weatherStationTest3));
    client.publish('/adcm/smart-environment/data', JSON.stringify(weatherStationTest4));
}
function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
*/
