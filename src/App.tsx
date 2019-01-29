import React, { Component } from "react";
import * as querystring from "query-string";

class App extends Component {
  state = {
    loggedIn: false,
    authToken: ""
  };

  loginWithSpotify = () => {
    const child: any = window.open(
      "http://localhost:5000/login",
      "top",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes"
    );

    // @ts-ignore
    window.spotifyCallback = token => {
      child.close();
      console.log(token);
      this.setState({
        loggedIn: true,
        authToken: token
      });
    };
  };

  componentDidMount() {
    const parsedQueryString = querystring.parse(window.location.search);

    if (parsedQueryString.auth_token) {
      window.opener.spotifyCallback(parsedQueryString.auth_token);
    }
  }

  render() {
    const { loggedIn, authToken } = this.state;

    return (
      <div className="App">
        {!loggedIn && (
          <button onClick={this.loginWithSpotify}>Login with Spotify</button>
        )}
        {authToken}
      </div>
    );
  }
}

export default App;
