import * as mqtt from 'mqtt';
import * as dotenv from "dotenv";
dotenv.config();

export const MqttClient = () => {
    let client: mqtt.MqttClient = mqtt.connect(String(process.env.MQTT_HOST), {
        username: process.env.MQTT_USERNAME, // Username ที่สร้าง
        password: process.env.MQTT_PASSWORD, // Password ที่สร้าง
        port: Number(process.env.MQTT_PORT),
        clientId: "mqttjs_AdcMicrosystems_SmartEnvironment_" + Math.random().toString(3).substr(2, 8),
        // clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
        keepalive: 60,
        reconnectPeriod: 1000,
        protocolId: "MQIsdp",
        protocolVersion: 3,
        clean: true,
        // encoding: "utf8",
    });
    return client
}