import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

export const CreateCon = device_name => {
  return mqtt.connect(process.env.MQTT_URI, {
    clientId: device_name
  });
};
