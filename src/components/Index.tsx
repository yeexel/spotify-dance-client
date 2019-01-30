import * as React from "react";
import { withAuthContext } from "../infrastructure/AuthContext";

class Index extends React.Component<any, any> {
  componentDidMount() {
    const { authContext } = this.props;

    authContext.setAuthToken();
  }

  render() {
    const { authContext } = this.props;

    if (!authContext.isAuth) {
      return (
        <button onClick={authContext.initLogin}>Login with Spotify bro</button>
      );
    }

    return (
      <React.Fragment>
        <div>Dashboard</div>
        <button onClick={authContext.logout}>Logout</button>
      </React.Fragment>
    );
  }
}

export default withAuthContext(Index);
