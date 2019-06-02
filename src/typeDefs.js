import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    me: Boolean!
    user(email: String!): User
    devices: [Device!]!
    isAdmin: Boolean!
  }

  type Device {
    id: ID!
    name: String!
    device_id: String!
    temp: Int
    status: Boolean!
  }

  type Error {
    path: String!
    message: String!
  }

  type Mutation {
    register(username: String!, email: String!, password: String): [Error!]
    login(email: String!, password: String!): User
    logout: Boolean!
    addDevice(name: String!, device_id: String!, status: Boolean!): [Error!]
    removeDevice(device_id: String!): Boolean!
    changeDeviceId(name: String!, device_id: String!): Device!
    plusTemp(device_id: String!): Device!
    minusTemp(device_id: String!): Device!
    changestatus(device_id: String!): Device!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    count: Int
    isadmin: Boolean
    location: String!
  }
`;
