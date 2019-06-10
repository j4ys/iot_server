import "babel-polyfill";
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import cors from "cors";

dotenv.config();

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import User from "./Models/User";
import TokenGen from "./utils/TokenGen";
console.log(process.env);
const startServer = async () => {
  const app = express();

  try {
    await mongoose.connect("mongodb://zim:zimpass@localhost:27017/zim", {
      useNewUrlParser: true
    });
  } catch (err) {
    console.log(err);
  }
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    cors: {
      credentials: true,
      origin: "https://embryo.netlify.com"
    }
  });

  app.use(
    cors({
      credentials: true,
      origin: true
    })
  );
  app.use(cookieParser());

  app.use(async (req, res, next) => {
    const refreshtoken = req.cookies["refresh-token"];
    const accesstoken = req.cookies["access-token"];
    // console.log(req.cookies);
    // console.log(refreshtoken);
    if (!accesstoken && !refreshtoken) {
      console.log("both tokens are not avail");
      return next();
    }

    try {
      // console.log("verifying access token");
      const data = verify(
        accesstoken,
        "sdfakjsdfhksahdfkjashfdkjlahfkjahfkjashfkjahfjasdfhkjasfh"
      );
      req.userId = data.userId;
      // console.log("access token is valid " + data.userId);
      return next();
    } catch {}

    if (!refreshtoken) {
      console.log("refresh token not found");
      return next();
    }

    let data;

    try {
      console.log("veryfing refresh token");
      data = verify(
        refreshtoken,
        "jaskdjfklasdfqwueroiuweoiruqoiweurqemwrbmqwebrmnqwbermqwberhh"
      );
    } catch {
      console.log("err while verifying refresh toekn");
      return next();
    }

    const user = await User.findOne({ _id: data.userId });

    if (!user || user.count !== data.count) {
      return next();
    }

    const tokens = TokenGen(user);

    res.cookie("refresh-token", tokens.refreshToken);
    res.cookie("access-token", tokens.accessToken);
    req.userId = user.id;
    console.log("refresh token generated = " + user.id);
    next();
  });

  server.applyMiddleware({ app, cors: false });

  // server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
};

startServer();
