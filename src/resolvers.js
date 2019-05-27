import User from "./Models/User";
import * as yup from "yup";
import FormatErrors from "./utils/FormatErrors";
import bcrypt from "bcryptjs";
import TokenGen from "./utils/TokenGen";

const schema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(3)
    .max(10),
  email: yup
    .string()
    .required()
    .email()
    .min(10)
    .max(255),
  password: yup
    .string()
    .required()
    .min(8)
    .max(50)
});
export const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    me: async (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }
      return await User.findOne(req.userId);
    },
    user: async (_, email) => {
      return await User.findOne(email);
    }
  },
  Mutation: {
    register: async (_, args) => {
      try {
        await schema.validate(args, { abortEarly: false });
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
    }
  }
};
