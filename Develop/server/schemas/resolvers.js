const { User } = require("../models");
const { signToken } = require("../utils/auth");
const bcrypt = require("bcryptjs"); // For password hashing

const resolvers = {
  Query: {
    // The "me" query returns the currently authenticated user's data
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await User.findById(context.user._id); // Retrieve user data based on the JWT user info
    },
  },

  Mutation: {
    // The "login" mutation allows a user to login with email and password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("No user found with this email");
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error("Incorrect password");
      }

      const token = signToken(user);
      return { token, user };
    },

    // The "addUser" mutation creates a new user and returns a token
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // The "saveBook" mutation saves a book to the user's saved books array
    saveBook: async (
      parent,
      { bookId, authors, description, title, image, link },
      context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: {
            savedBooks: { bookId, authors, description, title, image, link },
          },
        },
        { new: true }
      );

      return updatedUser;
    },

    // The "removeBook" mutation removes a book from the user's saved books array
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $pull: { savedBooks: { bookId } },
        },
        { new: true }
      );

      return updatedUser;
    },
  },
};

module.exports = resolvers;
