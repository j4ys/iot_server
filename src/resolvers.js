import User from "./Models/User";
import Device from "./Models/Device";
import * as yup from "yup";
import FormatErrors from "./utils/FormatErrors";
import bcrypt from "bcryptjs";
import TokenGen from "./utils/TokenGen";
import { registerschema, adddeviceschema } from "./utils/validationSchemas";
import mqtt from "mqtt";

export const resolvers = {
  Query: {
    users: async (_, __, { req, res }) => {
      return await User.find();
    },
    isAdmin: async (_, __, { req, res }) => {
      if (!req.userId) {
        return false;
      }
      try {
        const user = await User.findOne({ _id: req.userId });
        if (user.isadmin) {
          return true;
        }
      } catch (err) {
        return false;
      }
      return false;
    },
    me: async (_, __, { req }) => {
      console.log("me query" + req.userId);
      if (!req.userId) {
        return false;
      }
      const user = await User.findOne({ _id: req.userId });
      console.log(user);
      if (!user) {
        return false;
      } else {
        return true;
      }
    },
    user: async (_, email) => {
      return await User.findOne(email);
    },
    devices: async (_, __, { req, res }) => {
      if (!req.userId) {
        throw new Error("user not logged in");
      }
      return await Device.find();
    }
  },
  Mutation: {
    register: async (_, args) => {
      try {
        await registerschema.validate(args, { abortEarly: false });
      } catch (err) {
        const errors = FormatErrors(err);
        return errors;
      }

      const { email, username, password } = args;

      const usernameAlreadyExist = await User.findOne({ username });
      const emailAlreadyExist = await User.findOne({ email });
      let alreadyExistError = [];
      if (usernameAlreadyExist) {
        alreadyExistError.push({
          path: "username",
          message: "username already exist"
        });
      }
      if (emailAlreadyExist) {
        alreadyExistError.push({
          path: "email",
          message: "Email id already in use"
        });
      }

      if (alreadyExistError.length !== 0) {
        return alreadyExistError;
      }

      args.password = await bcrypt.hash(args.password, 10);

      try {
        const user = new User(args);
        await user.save();
      } catch (err) {
        throw new Error("Error occured while creating your account");
      }
      return null;
    },
    login: async (_, { email, password }, { __, res }) => {
      const data = await User.findOne({ email: email });
      //check if we found a user with that email
      if (!data) {
        return null;
      }
      //check password
      let valid = await bcrypt.compare(password, data.password);
      if (!valid) {
        return null;
      }

      //generate tokens
      const tokens = TokenGen(data);
      res.cookie("refresh-token", tokens.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7
      });
      res.cookie("access-token", tokens.accessToken, {
        maxAge: 1000 * 60 * 35
      });
      return data;
    },
    logout: (_, __, { req, res }) => {
      console.log("logout resolver");
      console.log(req.userId);
      if (!req.userId) {
        return false;
      }
      res.clearCookie("access-token");
      res.clearCookie("refresh-token");
      return true;
    },
    addDevice: async (_, args, { req, res }) => {
      try {
        await adddeviceschema.validate(args, { abortEarly: false });
      } catch (err) {
        const errors = FormatErrors(err);
        return errors;
      }
      const { device_id, name } = args;
      const deviceIdAlreadyExist = await Device.findOne({ device_id });
      const nameAlreadyExist = await Device.findOne({ name });
      let alreadyExistError = [];
      console.log(deviceIdAlreadyExist);
      if (deviceIdAlreadyExist) {
        alreadyExistError.push({
          path: "device_id",
          message: "this device_id already exist"
        });
      }
      if (nameAlreadyExist) {
        alreadyExistError.push({
          path: "name",
          message: "device name already in use"
        });
      }
      if (alreadyExistError.length !== 0) {
        return alreadyExistError;
      }
      try {
        const device = new Device(args);
        device.save();
      } catch (err) {
        throw new Error("error occured while creating device");
      }
      return null;
    },
    removeDevice: async (_, args, { req, res }) => {
      let { device_id } = args;
      console.log(device_id);
      const resp = await Device.findOneAndDelete({ device_id });
      console.log(resp);
      if (resp) {
        return true;
      }
      return false;
      // console.log(res);
      // if (res) {
      //   return true;
      // } else {
      //   return false;
      // }
    },
    changeDeviceId: async (_, args, { req, res }) => {
      let { name, device_id } = args;
      try {
        await Device.findOneAndUpdate({ name }, { $set: { device_id } });
        return await Device.findOne({ device_id });
      } catch {}
    },
    plusTemp: async (_, args, { req, res }) => {
      const { device_id } = args;
      await Device.findOneAndUpdate({ device_id }, { $inc: { temp: 1 } });

      const device = await Device.findOne({ device_id });
      const client = mqtt.connect("mqtt://127.168.1.2", {
        clientId: device.name
      });
      client.publish(`feeds/${device_id}/temp`, device.temp.toString());
      return device;
    },
    minusTemp: async (_, args, { req, res }) => {
      const { device_id } = args;
      await Device.findOneAndUpdate({ device_id }, { $inc: { temp: -1 } });
      const device = await Device.findOne({ device_id });
      const client = mqtt.connect("mqtt://127.168.1.2", {
        clientId: device.name
      });
      client.publish(`feeds/${device_id}/temp`, device.temp.toString());
      return device;
    },
    changestatus: async (_, args, { req, res }) => {
      const { device_id } = args;
      await Device.findOneAndUpdate(
        { device_id },
        { $set: { status: !device.status } }
      );
      const device = await Device.findOne({ device_id });
      const client = mqtt.connect("mqtt://127.168.1.2", {
        clientId: device.name
      });
      client.publish(`feeds/${device_id}/status`, device.status.toString());
      return device;
    }
  }
};
