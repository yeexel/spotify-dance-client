import * as React from "react";
import { AuthConsumer } from "./AuthContext";
import { Route, Redirect, RouteProps } from "react-router-dom";

const ProtectedRoute = ({ component, ...rest }: RouteProps) => {
  const Component: React.Component<any, any> | any = component;

  return (
    <AuthConsumer>
      {({ isAuth }: any) => (
        <Route
          render={props =>
            isAuth ? <Component {...props} /> : <Redirect to="/" />
          }
          {...rest}
        />
      )}
    </AuthConsumer>
  );
};

export { ProtectedRoute };
