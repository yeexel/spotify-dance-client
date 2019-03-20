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
    const { children, authContext } = this.props;

    return (
      <React.Fragment>
        <GlobalStyle />
        <Container>
          <Header />
          {children}
          {!authContext.isAuth && (
            <Hero>
              <HeroTitle>Pick up your playlist and make your friends dance.</HeroTitle>
              <Separator />
              <HeroTitleSecond>Share the experience.</HeroTitleSecond>
            </Hero>
          )}
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
`;

const Hero = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const HeroTitle = styled.span`
  font-size: 4vmin;
  color: #fff;
  font-weight: bold;
`;

const HeroTitleSecond = styled(HeroTitle)`
  font-size: 3.5vmin;
`;

const Separator = styled.div`
  height: 4vmin;
`;
