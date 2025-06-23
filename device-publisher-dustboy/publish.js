import mqtt from 'mqtt';

const options = {
  host: 'mosquitto',
  port: 1883,
  username: 'adcm',
  password: 'p@ssw0rd'
};

const client = mqtt.connect(options);

// Function to generate data for each device
const generateData = (deviceId) => ({
    info: {
        ssid: "Lily",
        id: deviceId.toLowerCase(),
        mac: "CC:7B:5C:BB:23:48",
        ip: "192.168.1.168",
        flash_size: 4194304,
        version: "2024.12.2 Jan 27 2025, 09:22:34"
    },
    d: {
        pm1: Math.floor(Math.random() * 10) + 1,
        pm2_5: Math.floor(Math.random() * 15) + 5,
        pm10: Math.floor(Math.random() * 25) + 15,
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 30) + 60
    },
    millis: 2816512,
    rssi: -30,
    nickname: deviceId,
    heap: 141628
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(() => {
        // Publish for each device (ADC-001 to ADC-008)
        for (let i = 1; i <= 8; i++) {
            const deviceId = `ADC-${String(i).padStart(3, '0')}`;
            const topic = `adc/${deviceId}/status`;
            const data = generateData(deviceId);
            
            client.publish(topic, JSON.stringify(data), { qos: 1, retain: false }, (err) => {
                if (err) {
                    console.error(`Publish error for ${deviceId}:`, err);
                } else {
                    console.log(`Message published for ${deviceId} at`, new Date().toISOString());
                }
            });
        }
    }, 30000);
});

client.on('error', (err) => {
    console.error('Connection error:', err);
    client.end();
});
