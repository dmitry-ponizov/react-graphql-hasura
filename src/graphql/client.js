import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-boost";

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://instaclone.hasura.app/v1/graphql",
    options: { reconnect: true },
  }),
  cache: new InMemoryCache(),
});

export default client;
