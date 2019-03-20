import * as React from "react";
import styled from "styled-components";
import { getPlaylists } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";
import Record from "../img/record.png";

class Playlists extends React.Component<any, any> {
  state = {
    data: {
      items: []
    },
    isLoading: true
  }

  el: any;

  componentDidMount() {
    this._fetchPlaylists();
  }

  render() {
    const { data, isLoading } = this.state;

    if (isLoading) {
      return null;
    }

    return (
      <Container>
        {data.items.map((playlist: any) => {
          return (
            <PlaylistContainer key={playlist.id}>
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

    const accountData = await getPlaylists(authContext.authToken);

    this.setState({
      isLoading: false,
      data: accountData
    });
  }
}

export default withAuthContext(Playlists);

const Container = styled.div`
  display: grid;
  margin-top: 100px;
  height: 100%;
  grid-template-columns: auto auto auto auto;
  grid-gap: 10px;
  justify-content: space-evenly;
  margin-bottom: 50px;

  @media (max-width: 1000px) {
    grid-template-columns: auto auto auto;
  }

  @media (max-width: 800px) {
    grid-template-columns: auto auto;
  }

  @media (max-width: 500px) {
    grid-template-columns: auto;
  }
`;

const PlaylistContainer = styled.div`
  width: 250px;
  height:350px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 15px;
  transition: 1s;
  border-radius: 5px;

  &:hover {
    background-color: rgb(110, 154, 162, 0.8);

    @media (max-width: 500px) {
      transition: none;
      background-color: transparent;
    }
  }
`

const PlaylistImage = styled.img`
  widht: 250px;
  height: 250px;
  z-index: 1;
  transition: .5s ease;
  border: 3px solid #fff;
  border-radius: 5px;

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

    @media (max-width: 500px) {
      transform: none;
      margin: 0;
    }
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
