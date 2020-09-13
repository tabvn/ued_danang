import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import routes from "../routers";
import RenderRoute from "./RenderRoute";
import { apolloClient, JWT_TOKEN_KEY } from "../client";
import { AppProvider } from "../context";
import { ME_QUERY } from "../graphqls/query/me";
import AppSpin from "./AppSpin";
import NotFound from "../pages/notfound";

const App = () => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  const [user, setUser] = useState();
  const [currentPermission, setCurrentPermissions] = useState();
  const [loading, setLoading] = useState(!!token);
  const initialState = {
    currentPermission,
    user,
    permissions: currentPermission,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        localStorage.setItem(JWT_TOKEN_KEY, action.payload.id);
        return {
          ...state,
          user: action.payload.user,
          permissions: action.payload.permissions
            ? action.payload.permissions
            : [],
        };
      case "logout":
        localStorage.removeItem(JWT_TOKEN_KEY);
        apolloClient.clearStore();
        return {
          ...state,
          user: null,
          currentPermission: null,
        };
      default:
        return state;
    }
  };
  useEffect(() => {
    if (token) {
      apolloClient
        .query({
          query: ME_QUERY,
        })
        .then(({ data }) => {
          setUser(data.viewer.user);
          setLoading(false);
        })
        .catch((e) => {
          localStorage.removeItem(JWT_TOKEN_KEY);
          setUser(null);
          setLoading(false);
        });
    }
  }, [token]);
  if (loading) {
    return <AppSpin />;
  }
  let arr = [];
  let getRoutes = (items) => {
    let middleArr = [];
    for (let i = 0; i < items.length; i++) {
      middleArr.push(items[i]);
      if (items[i].child) {
        middleArr = [...middleArr, ...getRoutes(items[i].child)];
      }
    }
    return middleArr;
  };
  for (let i = 0; i < routes.length; i++) {
    arr.push(routes[i]);
    if (routes[i].child) {
      arr = [...arr, ...getRoutes(routes[i].child)];
    }
  }
  return (
    <AppProvider initialState={initialState} reducer={reducer}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <Switch>
            {arr
              .filter((route) => route.path)
              .map((route, index) => (
                <RenderRoute key={index} {...route} routeKey={route.key} />
              ))}
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    </AppProvider>
  );
};

export default App;
