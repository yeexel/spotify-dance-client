import * as React from "react";
import styled from "styled-components";
import { getPlaylists } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";

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
              <PlaylistTitle>{playlist.name}</PlaylistTitle>
              <PlaylistCreatedBy>Created by: <a style={{ color: '#4c4c4c', textDecoration: 'none' }} href={playlist.owner.uri}>{playlist.owner.display_name}</a></PlaylistCreatedBy>
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
  margin-top: 20px;
  grid-template-columns: auto auto auto auto;
  grid-gap: 15px;
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
`

const PlaylistImage = styled.img`
  widht: 250px;
  height: 250px;
`

const PlaylistTitle = styled.span`
  align-self: center;
  font-size: 24px;
  font-weight: bold;
`

const PlaylistCreatedBy = styled.span`
  align-self: center;
  color: #4c4c4c;
`
