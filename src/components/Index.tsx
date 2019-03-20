import Header from "./Header";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { withAuthContext } from "../infrastructure/AuthContext";

class Index extends React.Component<any, any> {
  componentDidMount() {
    const { authContext } = this.props;

    authContext.setAuthToken();
  }

  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        <GlobalStyle />
        <Container>
          <Header />
          {children}
        </Container>
      </React.Fragment>
    );
  }
}

export default withAuthContext(Index);

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

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  background-image: linear-gradient(90deg, #C074B2, #8AB5E8);
  -webkit-animation: adjustHue 10s infinite;

  & @-webkit-keyframes adjustHue {
    50% {
      -webkit-filter: saturate(150%) hue-rotate(-35deg);
    }
  }
`;
