import * as React from "react";
import { AuthConsumer } from "../infrastructure/AuthContext";
import { Link } from "react-router-dom";

class Account extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>Account page YES!!!</div>
        <Link to="/">Dashboard</Link>
        <AuthConsumer>
          {({ logout }: any) => {
            return <button onClick={logout}>Logout</button>;
          }}
        </AuthConsumer>
      </React.Fragment>
    );
  }
}

export { Account };
