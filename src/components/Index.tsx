import Header from "./Header";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { withAuthContext } from "../infrastructure/AuthContext";
import { withRouter } from "react-router-dom";

class Index extends React.Component<any, any> {
  componentDidMount() {
    const { authContext } = this.props;

    authContext.setAuthToken();
  }

  componentDidUpdate() {
    const { authContext, location, history } = this.props;

    if (authContext.isAuth && location.pathname === "/") {
      history.push("/playlists");
    }
  }

  render() {
    const { children, authContext } = this.props;

    const isPublicSharePage = window.location.pathname.indexOf("/s/") !== -1;

    return (
      <React.Fragment>
        <GlobalStyle />
        <Container auth={authContext.isAuth || isPublicSharePage}>
          <Header />
          {children}
        </Container>
      </React.Fragment>
    );
  }
}

export default withAuthContext(withRouter(Index));

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    padding: 0;
    margin: 0;
    height: 100%;
    min-height: 100%;
    font-family: "KoHo", sans-serif;
  }
`;

const Container = styled.div<{ auth: boolean }>`
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  background-image: ${props =>
    props.auth ? "linear-gradient(90deg, #C074B2, #8AB5E8)" : "none"};
`;
