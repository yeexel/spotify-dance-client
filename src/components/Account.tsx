import * as React from "react";
import styled from "styled-components";
import { getAccount } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";

interface State {
  data: {
    name: string,
    email: string,
    country: string,
    avatar_url: string
  },
  isLoading: boolean;
}

class Account extends React.Component<any, State> {
  state = {
    data: {
      name: "",
      email: "",
      country: "",
      avatar_url: ""
    },
    isLoading: true
  };

  componentDidMount() {
    this._fetchAccountData();
  }

  _fetchAccountData = async () => {
    const { authContext } = this.props;

    const accountData = await getAccount(authContext.authToken);

    this.setState({
      isLoading: false,
      data: accountData
    });
  };

  render() {
    const {
      isLoading,
      data
    } = this.state;

    if (isLoading) {
      return null;
    }

    return (
      <Container>
        <LeftSection>
          <Avatar src={data.avatar_url} />
          <DisplayName>{data.name}</DisplayName>
          <Country src={`https://www.countryflags.io/${data.country.toLowerCase()}/flat/32.png`} />
        </LeftSection>
        <RightSection>
          <ZeroPlaylistsRated>You haven't shared any playlists yet.</ZeroPlaylistsRated>
        </RightSection>
      </Container>
    );
  }
}

export default withAuthContext(Account);

const Container = styled.div`
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
  // background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 500px) {
    width: auto;
  }
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #fff;
`;

const DisplayName = styled.span`
  margin-top: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 24px;
`;

const Country = styled.img`
  border-radius: 50%;
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

const ZeroPlaylistsRated = styled.span`
  align-self: center;
  color: #fff;
`;
