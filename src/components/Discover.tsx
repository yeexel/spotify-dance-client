import * as React from "react";
import posed from "react-pose";
import styled from "styled-components";
import { getRecommendations, createPlaylist } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";

function parseTime(millisec: number): object {
  // @ts-ignore
  const normalizeTime = (time: string): string =>
    time.length === 1 ? time.padStart(2, "0") : time;

  let seconds: string = (millisec / 1000).toFixed(0);
  let minutes: string = Math.floor(parseInt(seconds) / 60).toString();
  let hours: string = "";

  if (parseInt(minutes) > 59) {
    hours = normalizeTime(Math.floor(parseInt(minutes) / 60).toString());
    minutes = normalizeTime(
      (parseInt(minutes) - parseInt(hours) * 60).toString()
    );
  }
  seconds = normalizeTime(Math.floor(parseInt(seconds) % 60).toString());

  return {
    hours: +hours,
    minutes: +minutes,
    seconds: seconds,
    ms: millisec
  };
}

interface State {
  isLoading: boolean;
  data: {
    playlists?: Array<object>;
    recommendations?: Array<object>;
    error?: boolean;
  };
}

// @ts-ignore
class Discover extends React.Component<any, State> {
  state = {
    isLoading: true,
    data: {
      playlists: [],
      recommendations: [],
      error: false
    }
  };

  componentDidMount() {
    this._fetchRecommendations();
  }

  _createPlaylist = async () => {
    const {
      data: { recommendations }
    } = this.state;

    const trackIds = recommendations.map((r: any) => r.spotify_id);

    const playlistCreated = await createPlaylist(
      trackIds,
      this.props.authContext.authToken
    );

    this.props.history.push(`/playlists`);
  };

  _fetchRecommendations = async () => {
    const { authContext } = this.props;

    const recommendations = await getRecommendations(authContext.authToken);

    this.setState({
      isLoading: false,
      data: recommendations
    });
  };

  _playPauseTrack = (audioId: string) => {
    // @ts-ignore
    const audioEl: HTMLAudioElement = document.getElementById(audioId);

    if (!audioEl.paused) {
      audioEl.pause();
    } else {
      audioEl.play();
    }
  };

  render() {
    const { data, isLoading } = this.state;

    let ErrorContainer = null;

    if (!data) return null;

    // @ts-ignore
    if (data.error) {
      // @ts-ignore
      ErrorContainer = <ErrorParagraph>{data.msg}</ErrorParagraph>;
    }

    return (
      <Container pose={isLoading ? "closed" : "open"}>
        <LeftSection>
          <Header>Your favorite playlists</Header>
          {ErrorContainer}
          {data && data.playlists ? (
            <PlaylistWrapper>
              {data.playlists.map((playlist: any) => {
                return (
                  <PlaylistItem
                    onClick={() =>
                      this.props.history.push(
                        `/playlist/${playlist.spotify_id}`
                      )
                    }
                    key={playlist.id}
                  >
                    <PlaylistItemCover>
                      <img src={playlist.cover_image} />
                    </PlaylistItemCover>
                    <PlaylistItemName>{playlist.name}</PlaylistItemName>
                  </PlaylistItem>
                );
              })}
            </PlaylistWrapper>
          ) : null}
        </LeftSection>
        {!data.error ? (
          <RightSection>
            <Header>Today' tracks</Header>
            {data && data.recommendations ? (
              <TrackWrapper>
                {data.recommendations.map((recommendation: any) => {
                  const durationParsed: any = parseTime(
                    recommendation.track_duration
                  );

                  const audioId = `audio-${recommendation.id}`;

                  return (
                    <TrackItem
                      key={audioId}
                      onClick={() => this._playPauseTrack(audioId)}
                    >
                      <TrackName>{recommendation.track_name}</TrackName>
                      <TrackArtist>{recommendation.artist}</TrackArtist>
                      <TrackDuration>
                        {durationParsed.minutes}
                        {":"}
                        {durationParsed.seconds}
                      </TrackDuration>
                      <TrackPlay>Click to play</TrackPlay>
                      <audio id={audioId}>
                        <source
                          src={recommendation.preview_url}
                          type="audio/mp3"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </TrackItem>
                  );
                })}
              </TrackWrapper>
            ) : null}
            {data && data.recommendations.length ? (
              <Header>
                <span>
                  <AddToPlaylistBtn onClick={this._createPlaylist}>
                    Create playlist
                  </AddToPlaylistBtn>
                </span>
              </Header>
            ) : null}
          </RightSection>
        ) : null}
      </Container>
    );
  }
}

export default withAuthContext(Discover);

const AnimatedContainer = posed.div({
  open: { opacity: 1 },
  closed: { opacity: 0 }
});

const Container = styled(AnimatedContainer)`
  margin-top: 150px;
  display: flex;
  flex-direction: row;
  height: auto;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
  }
`;

const LeftSection = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 500px) {
    width: auto;
  }
`;

const RightSection = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 30px;

  @media (max-width: 500px) {
    width: auto;
    margin-top: 50px;
  }
`;

const Header = styled.p`
  color: #fff;
  font-size: 22px;
`;

const ErrorParagraph = styled.p`
  color: #e3e3e3;
`;

const PlaylistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;

  &:hover {
    cursor: pointer;
  }
`;

const TrackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;

  &:hover {
    cursor: pointer;
  }
`;

const PlaylistItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;

  &:hover {
    background-color: #c390ba;
  }
`;

const TrackPlay = styled.span`
  width: 10%;
  display: none;
  font-size: 14px;
  color: #e3e3e3;
`;

const TrackItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;

  &:hover {
    background-color: #c390ba;
  }

  &:hover ${TrackPlay} {
    display: block;
  }
`;

const PlaylistItemCover = styled.div`
  > img {
    width: 55px;
    height: 55px;
  }
`;

const TrackName = styled.div`
  color: #fff;
  width: 40%;
`;

const TrackArtist = styled.div`
  color: #e3e3e3;
  width: 35%;
`;

const TrackDuration = styled.div`
  color: #fff;
  width: 15%;
`;

const PlaylistItemName = styled.div`
  margin-left: 18px;
  color: #fff;
  align-self: center;
  font-size: 18px;
`;

const AddToPlaylistBtn = styled.a`
  background-color: transparent;
  border-radius: 2em;
  border: 0.2em solid #fff;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 0.7em 1.5em;
  outline: none;
  min-width: 120px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.25s ease;

  @media (max-width: 500px) {
    font-size: 10px;
    min-width: 80px;
  }

  &:hover {
    background: #fff;
    color: #000;
  }
`;
