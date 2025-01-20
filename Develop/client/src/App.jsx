import "./App.css";
import { Outlet } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"; // Import Apollo

import Navbar from "./components/Navbar";

// Set up Apollo Client
const client = new ApolloClient({
  uri: "/graphql", 
  cache: new InMemoryCache(), 
});

function App() {
  return (
    <ApolloProvider client={client}>
      {" "}
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
