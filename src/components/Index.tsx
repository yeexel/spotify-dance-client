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
              <HeroTitle>Rediscover your playlist.</HeroTitle>
              <Separator />
              <HeroTitleSecond>Get music taste insights.</HeroTitleSecond>
              <Separator />
              <HeroTitleThird>Share with a world.</HeroTitleThird>
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
  font-size: 52px;
  color: #fff;
  font-weight: bold;

  @media (max-width: 500px) {
    font-size: 30px;
  }
`;

const HeroTitleSecond = styled(HeroTitle)`
  font-size: 36px;

  @media (max-width: 500px) {
    font-size: 22px;
  }
`;

const HeroTitleThird = styled(HeroTitle)`
  font-size: 28px;

  @media (max-width: 500px) {
    font-size: 18px;
  }
`;

const Separator = styled.div`
  height: 4vmin;
`;
