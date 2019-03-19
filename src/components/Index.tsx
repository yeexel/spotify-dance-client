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
  body {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 800px;
  background: linear-gradient(30deg, #a38180 0%, #f8a36c 100%);
  -webkit-animation: adjustHue 10s infinite;

  & @-webkit-keyframes adjustHue {
    50% {
      -webkit-filter: saturate(150%) hue-rotate(-35deg);
    }
  }
`;
