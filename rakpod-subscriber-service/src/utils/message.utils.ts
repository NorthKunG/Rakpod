import { MqttClient } from "../config/mqtt";
import { MessagePrototypeMQTT } from "../prototypes/message.prototype";
let client = MqttClient();
client.on("connect", function () {
  console.log("Mqtt connection success");
});
client.subscribe("/adcm/smart-environment/#");

export const sendMessageMQTT = (object: MessagePrototypeMQTT) => {

  // client.on("message", async function (topic, message) {
  //   const arydata: Array<any> = [topic, message.toString()];
  //   // console.log(arydata);
  //   switch (
  //     arydata[0] // for check topic
  //   ) {
  //     case "/adcm/smart-environment/message/2eaebab9-aa6b-11ec-8305-0242ac120002":
  //       console.log(arydata[1]);
  //   }
  // });

  client.publish(`/adcm/smart-environment/message/${object.station.stationuuid}`, JSON.stringify(object));
};
