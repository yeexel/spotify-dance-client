import * as React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

class Landing extends React.Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <VideoWrapper autoPlay playsInline muted loop id="myVideo">
          <source
            type="video/mp4"
            src="https://s3.eu-central-1.amazonaws.com/playlista/video2.mp4"
          />
        </VideoWrapper>
        <Hero>
          <HeroTitle>Rediscover your playlist.</HeroTitle>
          <Separator />
          <HeroTitleSecond>Analyze music taste.</HeroTitleSecond>
          <Separator />
          <HeroTitleThird>Share insights.</HeroTitleThird>
          <Separator />
          <HeroTitleFourth onClick={() => this.props.history.push("/about")}>
            What is Playlista?
          </HeroTitleFourth>
        </Hero>
      </React.Fragment>
    );
  }
}

export default withRouter(Landing);

const VideoWrapper = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
`;

const Hero = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const HeroTitleFourth = styled(HeroTitle)`
  font-size: 18px;
  cursor: pointer;
  text-decoration: underline;

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;
