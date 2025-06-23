import { MqttClient } from '../config/mqtt';
import { MqttTopicEnum } from '../enums/mqtt-topic.enum';
import StoreDataController from './storeData.controller';

class MqttController {
    subscriber = () => {
        const client = MqttClient();
        client.on("connect", () => {
            console.log("Mqtt connection success");
            client.subscribe(MqttTopicEnum.DEVICE_DATA);
        });
        client.on("error", () => {
            console.log("Mqtt connection fail");
            this.subscriber();
        });
        client.on("message", async function (topic, message) {
            const arydata: Array<string> = [topic, message.toString()];
            console.log(arydata[0]);
            if (arydata[0].includes('adc')) {
                return StoreDataController.store(arydata[1]);
            }
        });
    }


}

export default new MqttController();