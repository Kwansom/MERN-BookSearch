const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String!
  }
  type Auth {
    token: String!
    user: User!
  }
  type Query {
    me: User # Get the current authenticated user
  }
  # Mutations for writing/updating data
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      bookId: String!
      authors: [String!]!
      description: String!
      title: String!
      image: String
      link: String!
    ): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
