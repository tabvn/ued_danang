import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split, ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
import { API_URL, APP_URL } from "./config";
import { notification } from "antd";

export const JWT_TOKEN_KEY = "app_token";
const httpLink = new HttpLink({
  uri: `${API_URL}/query`,
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message === "access denied") {
        notification.error({ message: message });
        window.location.href = APP_URL + "/";
      } else {
        //notification.error({ message: message });
      }
    });
  }
  if (networkError) console.log(`Network error: ${networkError}`);
});

const getWebsocketURL = () => {
  return API_URL.replace("https://", "wss://").replace("http://", "ws://");
};

const getToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};
// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `${getWebsocketURL()}/query`,
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = getToken();
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  },
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache: new InMemoryCache(),
});
