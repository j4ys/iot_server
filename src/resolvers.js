import User from "./Models/User";
export const resolvers = {
  Query: {
    hi: () => "hello",
    users: () => {
      return User.find();
    }
  },
  Mutation: {
    createUser: async (_, args) => {
      console.log(args);
      try {
        const user = new User(args);
        return await user.save();
      } catch (err) {
        throw new Error("Error occured while creating your account");
      }
    }
  }
};
