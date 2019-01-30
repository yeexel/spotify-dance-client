import * as React from "react";
import * as querystring from "query-string";

interface Props {}

interface State {
  isAuth: boolean;
  authToken: string;
  isLoading: boolean;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface AppContextInterface {}

const LS_KEY = "spotdance-at";

const AuthContext = React.createContext({});

class AuthProvider extends React.Component<Props, State> {
  state = {
    isAuth: false,
    isLoading: true,
    authToken: ""
  };

  componentDidMount() {
    console.log("AuthProvider::componentDidMount");

    const authToken = window.localStorage.getItem(LS_KEY);

    if (authToken) {
      console.log("AuthProvider::setAuthTokenFromComponentDidMount");
      this.setState({ isAuth: true, authToken, isLoading: false });
    } else {
      this.setState({ isLoading: false });
    }
  }

  initLogin = () => {
    console.log("AuthContext::initLogin");

    const spotifyLoginPopup: any = window.open(
      "http://localhost:5000/login",
      "top",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes"
    );

    // @ts-ignore
    window.spotifyLoginCallback = authToken => {
      console.log(authToken);
      spotifyLoginPopup.close();
      window.localStorage.setItem(LS_KEY, authToken);
      this.setState({
        isAuth: true,
        isLoading: false,
        authToken
      });
    };
  };

  setAuthToken = () => {
    const parsedQueryString = querystring.parse(window.location.search);

    if (window.opener && parsedQueryString.auth_token) {
      window.opener.spotifyLoginCallback(parsedQueryString.auth_token);
    }
  };

  logout = () => {
    console.log("AuthContext::logout");

    if (window.localStorage.getItem(LS_KEY)) {
      window.localStorage.removeItem(LS_KEY);
    }

    this.setState({ isAuth: false, authToken: "", isLoading: false });
  };

  render() {
    const { isAuth, authToken, isLoading } = this.state;

    return (
      <AuthContext.Provider
        value={{
          isAuth,
          authToken,
          isLoading,
          initLogin: this.initLogin,
          setAuthToken: this.setAuthToken,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

function withAuthContext<
  P extends { authContext?: AppContextInterface },
  R = Omit<P, "authContext">
>(Component: any): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <AuthConsumer>
        {value => <Component {...props} authContext={value} />}
      </AuthConsumer>
    );
  };
}

export { AuthProvider, AuthConsumer, withAuthContext };
