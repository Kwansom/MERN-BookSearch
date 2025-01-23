const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express"); // Import ApolloServer
const db = require("./config/connection");
// const routes = require("./routes");
const { typeDefs, resolvers } = require("../server/schemas"); // Import typeDefs and resolvers
const { authMiddleware } = require("../server/utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // used to get user from token
    const user = authMiddleware({ req });
    return user; // Return user in context for GraphQL resolvers
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server now running on port ${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);
