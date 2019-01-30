import * as React from "react";
import { AuthConsumer } from "./AuthContext";
import { Route, Redirect, RouteProps } from "react-router-dom";

const ProtectedRoute = ({ component, ...rest }: RouteProps) => {
  const Component: React.Component<any, any> | any = component;

  return (
    <AuthConsumer>
      {({ isAuth, isLoading }: any) => {
        return (
          <Route
            render={props => {
              if (isLoading) {
                // add spinner
                return null;
              }
              return isAuth ? <Component {...props} /> : <Redirect to="/" />;
            }}
            {...rest}
          />
        );
      }}
    </AuthConsumer>
  );
};

export { ProtectedRoute };
