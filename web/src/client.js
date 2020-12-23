import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_URL } from "./config";

export const JWT_TOKEN_KEY = "app_token";

const getToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

const httpLink = createHttpLink({
  uri: `${API_URL}/query`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
