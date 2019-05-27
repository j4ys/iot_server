import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    me: User!
    user(email: String!): User
  }

  type Error {
    path: String!
    message: String!
  }

  type Mutation {
    register(username: String!, email: String!, password: String): [Error!]
    login(email: String!, password: String!): User
    logout: Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    count: Int
  }
`;
