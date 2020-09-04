import React, { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { useAppValue } from "../context";

const RenderRoute = (route) => {
  const [{ user }] = useAppValue();
  const history = useHistory();
  useEffect(() => {
    if (!user) {
      return history.push("/login");
    }
  }, [user, history, route.path]);
  if (route.layout) {
    return (
      <route.layout>
        <Route
          {...route}
          //exact
          //path={route.path}
          render={(props) => <route.component {...props} />}
        />
      </route.layout>
    );
  }
  return (
    <Route
      exact
      path={route.path}
      render={(props) => <route.component {...props} />}
    />
  );
};

export default RenderRoute;
