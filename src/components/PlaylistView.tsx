import React, { Component } from "react";
import styled from "styled-components";
import { getPlaylist, analyzePlaylist } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface State {
  playlist: object,
  isLoading: boolean,
  showDescription: boolean
}

function parseTime(millisec: number): object {
  // @ts-ignore
  const normalizeTime = (time: string): string => (time.length === 1) ? time.padStart(2, '0') : time;

  let seconds: string = (millisec / 1000).toFixed(0);
  let minutes: string = Math.floor(parseInt(seconds) / 60).toString();
  let hours: string = '';

  if (parseInt(minutes) > 59) {
    hours = normalizeTime(Math.floor(parseInt(minutes) / 60).toString());
    minutes = normalizeTime((parseInt(minutes) - (parseInt(hours) * 60)).toString());
  }
  seconds = normalizeTime(Math.floor(parseInt(seconds) % 60).toString());

  return {
    hours: +hours,
    minutes: +minutes,
    seconds: +seconds,
    ms: millisec
  }
 }

class PlaylistView extends Component<any ,State> {
  state = {
    playlist: {},
    isLoading: true,
    showDescription: false
  }

  componentDidMount() {
    this._fetchPlaylist();
  }

  toggleDescription = () => {
    this.setState({ showDescription: !this.state.showDescription })
  }

  _fetchPlaylist = async () => {
    const { authContext, match: { params: { id: playlistId } } } = this.props;

    const playlistData = await getPlaylist(playlistId, authContext.authToken);

    this.setState({
      playlist: playlistData,
      isLoading: false
    });
  }

  _analyzePlaylist = async () => {
    const { authContext, match: { params: { id: playlistId } } } = this.props;

    const danceability = await analyzePlaylist(playlistId, authContext.authToken);

    alert(danceability);
  }

  render() {
    const { playlist, isLoading, showDescription } = this.state;

    if (isLoading) {
      return null;
    }

    const currentPlaylist: any = playlist;

    const hasMoreThan100Tracks = currentPlaylist.tracks > 100;

    const parsedTime: any = parseTime(currentPlaylist.duration_ms);

    let playTimeHours = null;
    let playTimeMinutes = null;

    if (parsedTime.hours > 0) {
      playTimeHours = (
        <React.Fragment>
          <PlaylistInfoLineSubject>{parsedTime.hours}</PlaylistInfoLineSubject> {`${parsedTime.hours === 1 ? 'hour' : 'hours'}`} and
        </React.Fragment>
      )
    }

    playTimeMinutes = (
      <React.Fragment>
        <PlaylistInfoLineSubject>{parsedTime.minutes}</PlaylistInfoLineSubject> {`${parsedTime.minutes === 1 ? 'minute' : 'minutes'}`}
      </React.Fragment>
    )

    return (
      <Container>
        <LeftSection>
          <CoverImage src={currentPlaylist.cover_image} />
          <PlaylistName>{currentPlaylist.name}</PlaylistName>
          {currentPlaylist.description && (
            <React.Fragment>
              <DescriptionToggle onClick={this.toggleDescription}>{`${showDescription ? 'Hide' : 'Show'}`} description <FontAwesomeIcon style={{ verticalAlign: 'middle', marginBottom: '2px' }} icon={showDescription? "angle-up" : "angle-down"} /></DescriptionToggle>
              <PlaylistDescription show={showDescription} dangerouslySetInnerHTML={ { __html: currentPlaylist.description } } />
            </React.Fragment>
          )}
          <BtnWrapper>
            {/* <AnalyzeBtn onClick={this._analyzePlaylist} show={!hasMoreThan100Tracks}><FontAwesomeIcon icon="cogs" /> Analyze</AnalyzeBtn> */}
            <ListenOnSpotifyBtn href={currentPlaylist.uri}><FontAwesomeIcon icon="music" /> Play on Spotify</ListenOnSpotifyBtn>
          </BtnWrapper>
        </LeftSection>
        <RightSection>
          <Separator />
          <PlaylistInfoLine show={true}><PlaylistInfoLineSubject>{`${currentPlaylist.tracks}`}</PlaylistInfoLineSubject> {`${currentPlaylist.tracks == 1 ? 'track' : 'tracks'}`} and <PlaylistInfoLineSubject>{`${currentPlaylist.followers}`}</PlaylistInfoLineSubject> {`${currentPlaylist.followers == 1 ? 'follower' : 'followers'}`}</PlaylistInfoLine>
          <React.Fragment>
            {currentPlaylist.danceability !== -1 ? (
              <PlaylistInfoLine show={true}>Play time is {playTimeHours} {playTimeMinutes}</PlaylistInfoLine>
            ) : null}
          </React.Fragment>
          <React.Fragment>
            {currentPlaylist.danceability !== -1 ? (
              <PlaylistInfoLine show={true}>Danceability is <PlaylistInfoLineSubject>{currentPlaylist.danceability}%</PlaylistInfoLineSubject></PlaylistInfoLine>
            ) : null}
          </React.Fragment>
          <PlaylistInfoLine show={true}>Created by <PlaylistInfoLineSubject>{`${currentPlaylist.owner}`}</PlaylistInfoLineSubject></PlaylistInfoLine>
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
  height: auto;

  @media (max-width: 500px) {
    width: auto;
  }
`;

const CoverImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 5px;
  box-shadow: 0 8px 6px -6px black;
  transition: all 0.25s ease;

  // &:hover {
  //   opacity: .5;
  // }
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

const DescriptionToggle = styled(PlaylistName)`
  font-size: 14px;
  color: #e3e3e3;
  // text-decoration: underline dashed;
  cursor: pointer;
`;

const PlaylistDescription = styled(PlaylistName)<{show?: boolean;}>`
  color: #e3e3e3;
  font-size: 16px;
  max-width: 250px;
  text-align: justify;

  display: ${props => props.show ? 'block' : 'none'};
`;

const RightSection = styled.div`
  width: 60%;
  display: flex;
  // background-color: #e3e3e3;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 250px;

  @media (max-width: 500px) {
    width: auto;
    margin-top: 30px;
    height: auto;
  }
`;

const PlaylistInfoLine = styled.span<{ show: boolean; }>`
  align-self: center;
  color: #fff;
  font-size: 26px;
  display: ${props => props.show ? 'display' : 'none'};

  @media (max-width: 500px) {
    font-size: 16px;
    margin-bottom: 5px;
  }
`

const PlaylistInfoLineSubject = styled.span`
  font-weight: bold;
  font-size: 32px;

  @media (max-width: 500px) {
    font-size: 20px;
  }
`;

const Separator = styled.div`
  display: none;

  height: 1px;
  width: 100%;
  background-color: #e3e3e3;
  margin-bottom: 20px;

  @media (max-width: 500px) {
    display: block;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 350px;

  @media (max-width: 500px) {
    width: 270px;
  }
`;

const ListenOnSpotifyBtn = styled.a`
  margin-top: 15px;
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

const AnalyzeBtn = styled(ListenOnSpotifyBtn)<{ show: boolean; }>`
  display: ${props => props.show ? 'display' : 'none'};
`
