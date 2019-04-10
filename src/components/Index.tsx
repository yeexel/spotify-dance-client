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
        <Container auth={authContext.isAuth}>
          <Header />
          {!authContext.isAuth && (
            <video autoPlay playsInline muted loop id="myVideo">
              <source src={require("../img/video2.mp4")} type="video/mp4" />
              {/* <source type="video/mp4" src="https://gcs-vimeo.akamaized.net/exp=1554910179~acl=%2A%2F987978732.mp4%2A~hmac=326b7f964b7b2d72e85cf5d90a2b2201845b3f144a1fe7c8f4d75c08edda02b2/vimeo-prod-skyfire-std-us/01/3362/10/266811431/987978732.mp4" /> */}
            </video>
          )}
          {children}
          {!authContext.isAuth && (
            <Hero>
              <HeroTitle>Rediscover your playlist.</HeroTitle>
              <Separator />
              <HeroTitleSecond>Analyze music taste.</HeroTitleSecond>
              <Separator />
              <HeroTitleThird>Share insights.</HeroTitleThird>
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

const Container = styled.div<{ auth: boolean; }>`
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  background-image: ${props => props.auth ? 'linear-gradient(90deg, #C074B2, #8AB5E8)' : 'none'};

  #myVideo {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    // filter: blur(2px);
    object-fit: cover;
  }
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
  z-index: 2;

  @media (max-width: 500px) {
    font-size: 30px;
  }
`;

const HeroTitleSecond = styled(HeroTitle)`
  font-size: 40px;

  @media (max-width: 500px) {
    font-size: 26px;
  }
`;

const HeroTitleThird = styled(HeroTitle)`
  font-size: 32px;

  @media (max-width: 500px) {
    font-size: 24px;
  }
`;

const Separator = styled.div`
  height: 4vmin;
`;
