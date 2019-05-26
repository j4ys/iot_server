import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    users: [User!]!
  }

  type Error {
    path: String!
    message: String!
  }

  type Mutation {
    register(username: String!, email: String!, password: String): [Error!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    count: Int
  }
`;
