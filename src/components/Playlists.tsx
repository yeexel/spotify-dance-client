import * as React from "react";
import styled from "styled-components";
import { getPlaylists } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";
import Record from "../img/record.png";

class Playlists extends React.Component<any, any> {
  state = {
    playlists: [],
    isLoading: false,
    hasMore: false,
    initialLoad: true,
    limit: 20,
    offset: 0
  }

  el: any;

  componentDidMount() {
    this._fetchPlaylists();

    this.setState({ initialLoad: false })

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

    if(totalHeight >= scrollHeight && hasMore) {
      this.setState({ offset: this.state.offset + this.state.limit }, this._fetchPlaylists);
    }
  }

  render() {
    const { playlists, isLoading, initialLoad } = this.state;

    if (initialLoad) {
      return null;
    }

    return (
      <Container>
        {playlists.map((playlist: any, index: number) => {
          return (
            <PlaylistContainer key={playlist.id} firstChild={index === 0}>
              <PlaylistImage src={playlist.images[0].url} />
              <RecordImage style={{ position: 'absolute' }} id="rec" width="250" height="250" src={Record} />
              <PlaylistTitle>{playlist.name}</PlaylistTitle>
              {/* <PlaylistCreatedBy>Created by <a style={{ color: '#fff', textDecoration: 'none' }} href={playlist.owner.uri}>{playlist.owner.display_name}</a></PlaylistCreatedBy> */}
            </PlaylistContainer>
          )
        })}
      </Container>
    );
  }

  _fetchPlaylists = async () => {
    const { authContext } = this.props;
    const { limit, offset } = this.state;

    this.setState({ isLoading: true });

    const playlistData = await getPlaylists(limit, offset, authContext.authToken);

    const playlists = [
      ...this.state.playlists,
      ...playlistData.items
    ];

    this.setState({
      isLoading: false,
      playlists,
      hasMore: playlists.length < playlistData.total
    });
  }
}

export default withAuthContext(Playlists);

const Container = styled.div`
  display: grid;
  margin-top: 100px;
  height: 100%;
  grid-template-columns: auto auto auto auto;
  // grid-gap: 10px;
  justify-content: space-evenly;
  margin-bottom: 50px;

  @media (max-width: 1000px) {
    grid-template-columns: auto auto auto;
  }

  @media (max-width: 800px) {
    grid-template-columns: auto auto;
  }

  @media (max-width: 500px) {
    // grid-template-columns: auto;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow-y: hidden;
    ::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      background: transparent;  /* optional: just make scrollbar invisible */
    }
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
    margin-left: ${props => props.firstChild ? Math.ceil((document.documentElement.clientWidth - 250) / 2) - 10 : 0}px;
  }
`

const PlaylistImage = styled.img`
  width: 250px;
  height: 250px;
  z-index: 1;
  transition: .5s ease;
  // border: 3px solid #fff;
  border-radius: 5px;
  box-shadow: 0 8px 6px -6px black;

  ${PlaylistContainer}:hover & {
    transform: rotate(-3deg);
    margin: 0 0 0 -15px;

    @media (max-width: 500px) {
      transform: none;
      margin: 0;
    }
  }
`

const RecordImage = styled.img`
  transition: .75s ease;
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
`

const PlaylistTitle = styled.span`
  align-self: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  color: #fff;
`

const PlaylistCreatedBy = styled.span`
  align-self: center;
  color: #fff;
`
