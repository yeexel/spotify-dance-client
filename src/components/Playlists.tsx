import * as React from "react";
import styled from "styled-components";
import { getPlaylists } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";
import Record from "../img/record.png";
import posed from "react-pose";

class Playlists extends React.Component<any, any> {
  state = {
    playlists: [],
    isLoading: false,
    hasMore: false,
    initialLoad: true,
    limit: 20,
    offset: 0
  };

  el: any;

  async componentDidMount() {
    await this._fetchPlaylists();

    this.setState({ initialLoad: false });

    window.addEventListener("scroll", this.scrollEventHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollEventHandler);
  }

  scrollEventHandler = () => {
    const { hasMore } = this.state;

    let scrollHeight, totalHeight;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;

    if (totalHeight >= scrollHeight && hasMore) {
      this.setState(
        { offset: this.state.offset + this.state.limit },
        this._fetchPlaylists
      );
    }
  };

  render() {
    const { playlists, isLoading, initialLoad } = this.state;

    // if (initialLoad) {
    //   return null;
    // }

    return (
      <Container pose={initialLoad ? "closed" : "open"}>
        {playlists.map((playlist: any, index: number) => {
          return (
            <PlaylistContainer
              onClick={() =>
                this.props.history.push(`/playlist/${playlist.id}`)
              }
              key={playlist.id}
              firstChild={index === 0}
            >
              <PlaylistImage
                src={
                  playlist.images && playlist.images.length
                    ? playlist.images[0]["url"] || ""
                    : ""
                }
              />
              <RecordImage
                style={{ position: "absolute" }}
                id="rec"
                width="250"
                height="250"
                src={Record}
              />
              <PlaylistTitle>{playlist.name}</PlaylistTitle>
            </PlaylistContainer>
          );
        })}
      </Container>
    );
  }

  _fetchPlaylists = async () => {
    const { authContext } = this.props;
    const { limit, offset } = this.state;

    this.setState({ isLoading: true });

    const playlistData = await getPlaylists(
      limit,
      offset,
      authContext.authToken
    );

    const playlists = [...this.state.playlists, ...playlistData.items];

    this.setState({
      isLoading: false,
      playlists,
      hasMore: playlists.length < playlistData.total
    });
  };
}

export default withAuthContext(Playlists);

const AnimatedContainer = posed.div({
  open: { opacity: 1 },
  closed: { opacity: 0 }
});

const Container = styled(AnimatedContainer)`
  display: grid;
  margin-top: 100px;
  grid-template-columns: auto auto auto auto;
  justify-content: space-evenly;

  @media (max-width: 1000px) {
    grid-template-columns: auto auto auto;
  }

  @media (max-width: 800px) {
    grid-template-columns: auto auto;
  }

  @media (max-width: 500px) {
    grid-template-columns: auto;
    margin-top: 80px;

    // display: flex;
    // flex-direction: row;
    // min-width: 100%;
    // min-height: 100%;
    // justify-content: flex-start;
  }
`;

const PlaylistContainer = styled.div<{ firstChild: boolean }>`
  width: 250px;
  height:350px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 15px;
  transition: 1s;
  border-radius: 5px;

  &:hover {
    // background-color: rgb(110, 154, 162, 0.8);

    @media (max-width: 500px) {
      transition: none;
      background-color: transparent;
    }
  }

  @media (max-width: 500px) {
    height:300px;
    // margin-left: ${props =>
      props.firstChild
        ? Math.ceil((document.documentElement.clientWidth - 250) / 2) - 10
        : 0}px;
  }
`;

const PlaylistImage = styled.img`
  width: 250px;
  height: 250px;
  z-index: 1;
  transition: 0.5s ease;
  // border: 2px solid #fff;
  border-radius: 5px;
  box-shadow: 0 8px 6px -6px black;

  ${PlaylistContainer}:hover & {
    transform: rotate(-3deg);
    margin: 0 0 0 -15px;
    cursor: pointer;

    @media (max-width: 500px) {
      transform: none;
      margin: 0;
    }
  }
`;

const RecordImage = styled.img`
  transition: 0.75s ease;
  width: 240px;
  height: 240px;
  padding: 5px;

  ${PlaylistContainer}:hover & {
    margin: 0 0 0 50px;
    transform: rotate(360deg);
  }

  @media (max-width: 500px) {
    display: none;
  }
`;

const PlaylistTitle = styled.span`
  align-self: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  color: #fff;
  opacity: 0;
  transition: opacity 500ms;
  max-width: 250px;

  ${PlaylistContainer}:hover & {
    transform: rotate(-3deg) initial;
    opacity: 1;
  }

  @media (max-width: 500px) {
    opacity: 1;
  }
`;

const PlaylistCreatedBy = styled.span`
  align-self: center;
  color: #fff;
`;
