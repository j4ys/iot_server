import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

export const CreateCon = device_name => {
  return mqtt.connect("mqtt://localhost", {
    clientId: device_name
  });
};
