import * as React from "react";
import styled from "styled-components";
import DesktopAccount from "../img/tinified/desktop_account.png";
import DesktopPlaylistList from "../img/tinified/desktop_playlist_list.png";
import MobilePlaylistViewHover from "../img/tinified/mobile_playlist_view_hover.png";
import MobilePlaylistView from "../img/tinified/mobile_playlist_view.png";

class About extends React.Component {
  render() {
    return (
      <Wrapper>
        <h1>About Playlista</h1>
        <p>
          With Playlista, it’s easy to share your favorite playlist for every
          moment – on your phone, your computer, your tablet and more.
        </p>
        <p>
          There are dozens of metrics which categorize your playlist like
          danceability, positiveness, energy and much more. Choose a playlist,
          create public link and let Playlista surprise your friends.
        </p>
        <p>
          You can also preview custom vinyl on cover image hover or browse
          through the list of links you shared to see how many times friends
          opened them.
        </p>
        <p>
          Analyze your music taste with Playlista. Login with Spotify and start
          exploring.
        </p>
        <GreyParagraph>
          Playlista was created by Oleksii Kulikov in June 2019.
        </GreyParagraph>
        <GreyParagraph>
          If you have any suggestions or ideas for this project - don't hesitate
          to send <a href="mailto:yeexel@gmail.com">mail</a>. You can also find
          the author on{" "}
          <a href="https://github.com/yeexel" target="_blank">
            GitHub
          </a>{" "}
          :)
        </GreyParagraph>
        <Separator />
        <img src={DesktopPlaylistList} alt="" />
        <Separator />
        <ImageGroupMobile>
          <span>
            <img src={MobilePlaylistView} alt="" />
          </span>
          <SeparatorGroup />
          <span>
            <img src={MobilePlaylistViewHover} alt="" />
          </span>
        </ImageGroupMobile>
        <Separator />
        <img src={DesktopAccount} alt="" />
        <Separator />
      </Wrapper>
    );
  }
}

export default About;

const Wrapper = styled.div`
  margin: 0 auto;
  margin-top: 100px;
  width: 950px;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: 500px) {
    margin-top: 45px;
    width: 350px;
    padding: 0;

    > h1 {
      font-size: 22px;
    }

    > p {
      font-size: 16px !important;
    }
  }

  > p {
    font-size: 20px;
    text-align: left;

    > a {
      color: #e3e3e3 !important;
    }
  }

  > img {
    width: 100%;
    border: 2px solid #fff;
  }
`;

const GreyParagraph = styled.p`
  color: #e3e3e3;
  line-height: 1px;
  font-size: 14px !important;

  @media (max-width: 500px) {
    font-size: 10px !important;
    line-height: 20px;
    margin-bottom: -10px;
  }
`;

const Separator = styled.div`
  height: 35px;
`;

const SeparatorGroup = styled.div`
  display: none;

  @media (max-width: 500px) {
    display: block;
    height: 32px;
  }
`;

const ImageGroupMobile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 500px) {
    flex-direction: column;
  }

  > span > img {
    width: 15rem;
    border: 2px solid #fff;
  }
`;
