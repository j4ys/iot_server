import User from "./Models/User";
import * as yup from "yup";
import FormatErrors from "./utils/FormatErrors";
import bcrypt from "bcryptjs";

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
    users: () => {
      return User.find();
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
    }
  }
};
