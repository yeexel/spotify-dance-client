import React, { Component } from "react";
import styled from "styled-components";
import { getPlaylist } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";

interface State {
  playlist: object,
  isLoading: boolean
}

class PlaylistView extends Component<any ,State> {
  state = {
    playlist: {},
    isLoading: true
  }

  componentDidMount() {
    this._fetchPlaylist();
  }

  _fetchPlaylist = async () => {
    const { authContext, match: { params: { id: playlistId } } } = this.props;

    const playlistData = await getPlaylist(playlistId, authContext.authToken);

    this.setState({
      playlist: playlistData,
      isLoading: false
    });
  }

  render() {
    const { playlist, isLoading } = this.state;

    if (isLoading) {
      return null;
    }

    const currentPlaylist: any = playlist;

    return (
      <Container>
        <LeftSection>
          <CoverImage src={currentPlaylist.images[0].url} />
          <PlaylistName>{currentPlaylist.name}</PlaylistName>
          <PlaylistDescription dangerouslySetInnerHTML={ { __html: currentPlaylist.description } } />
        </LeftSection>
        <RightSection>
          <PlaylistInfoLine>You <PlaylistInfoLineSubject>{`${currentPlaylist.danceability >= 65 ? 'will probably' : 'might not'}`}</PlaylistInfoLineSubject> enjoy dancing to this playlist.</PlaylistInfoLine>
          <PlaylistInfoLine><PlaylistInfoLineSubject>{`${currentPlaylist.tracks.total}`}</PlaylistInfoLineSubject> {`${currentPlaylist.tracks.total == 1 ? 'track' : 'tracks'}`} can be found inside.</PlaylistInfoLine>
          <PlaylistInfoLine>
            This playlist has <PlaylistInfoLineSubject>{`${currentPlaylist.followers.total}`}</PlaylistInfoLineSubject> {`${currentPlaylist.followers.total == 1 ? 'follower' : 'followers'}`}.
          </PlaylistInfoLine>
          <PlaylistInfoLine>It was created by <PlaylistInfoLineSubject>{`${currentPlaylist.created_by_user ? 'you' : currentPlaylist.owner.display_name}`}</PlaylistInfoLineSubject>.</PlaylistInfoLine>
        </RightSection>
      </Container>
    );
  }
}

export default withAuthContext(PlaylistView);

const Container = styled.div`
  margin-top: 150px;
  display: flex;
  flex-direction: row;
  height: auto;

  a {
    color: #fff;
    text-decoration: none;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
  }
`;

const LeftSection = styled.div`
  width: 40%;
  // background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 500px) {
    width: auto;
  }
`;

const CoverImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 5px;
  box-shadow: 0 8px 6px -6px black;
`;

const PlaylistName = styled.span`
  align-self: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  max-width: 250px;
  color: #fff;

  @media (max-width: 500px) {
    max-width: auto;
  }
`;

const PlaylistDescription = styled(PlaylistName)`
  color: #e3e3e3;
  font-size: 16px;
  max-width: 250px;
  text-align: justify;

  @media (max-width: 500px) {
    display: none;
  }
`;

const RightSection = styled.div`
  width: 60%;
  display: flex;
  // background-color: #e3e3e3;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 500px) {
    width: auto;
    margin-top: 50px;
  }
`;

const PlaylistInfoLine = styled.span`
  align-self: center;
  color: #fff;
  font-size: 26px;

  @media (max-width: 500px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`

const PlaylistInfoLineSubject = styled.span`
  font-weight: bold;
  font-size: 32px;

  @media (max-width: 500px) {
    font-size: 20px;
  }
`;
