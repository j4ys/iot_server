import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hi: String!
    users: [User!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String): User!
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }
`;
