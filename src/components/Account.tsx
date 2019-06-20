import * as React from "react";
import styled from "styled-components";
import { getAccount, getLinkList } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";
import posed from "react-pose";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

interface State {
  data: {
    name: string;
    email: string;
    country: string;
    avatar_url: string;
  };
  links: Array<object>;
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
    links: [],
    isLoading: true
  };

  componentDidMount() {
    this._fetchAccountData();
    this._fetchLinkList();
  }

  _fetchAccountData = async () => {
    const { authContext } = this.props;

    const accountData = await getAccount(authContext.authToken);

    this.setState({
      isLoading: false,
      data: accountData
    });
  };

  _fetchLinkList = async () => {
    const { authContext } = this.props;

    const linkListData = await getLinkList(authContext.authToken);

    // @ts-ignore
    this.setState({ links: linkListData });
  };

  render() {
    const { isLoading, data, links } = this.state;

    if (isLoading || !links) {
      return null;
    }

    return (
      <Container pose={isLoading ? "closed" : "open"}>
        <LeftSection>
          <Avatar src={data.avatar_url} />
          <DisplayName>{data.name}</DisplayName>
          <Country
            src={`https://www.countryflags.io/${data.country.toLowerCase()}/flat/32.png`}
          />
        </LeftSection>
        <RightSection>
          {!links.length && (
            <ZeroPlaylistsRated>
              You haven't shared any playlists yet.
            </ZeroPlaylistsRated>
          )}
          {links.length && (
            <LinkListContainer>
              <Table>
                <TableRowHeader>
                  <TableHeader>Playlist link</TableHeader>
                  <TableHeader>Clicks</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRowHeader>
                {links.map((link: any) => {
                  return (
                    <TableRow>
                      <TableData>{link.name}</TableData>
                      <TableData>{link.visit_count}</TableData>
                      <TableData>{`${distanceInWordsToNow(
                        link.created_at
                      )} ago`}</TableData>
                      <TableData>
                        {link.is_active ? "Active" : "Disabled"}
                      </TableData>
                      <TableData>
                        {/* {link.is_active ? "Active" : "Disabled"} */}
                      </TableData>
                    </TableRow>
                  );
                })}
              </Table>
            </LinkListContainer>
          )}
        </RightSection>
      </Container>
    );
  }
}

export default withAuthContext(Account);

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
  width: 100%;
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

const LinkListContainer = styled.div`
  // align-self: center;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  color: #fff;
  border-collapse: collapse;

  @media (max-width: 500px) {
    width: 350px;
  }
`;

const TableRowHeader = styled.tr`
  width: 100%;
`;

const TableRow = styled.tr`
  width: 100%;

  &:hover {
    background-color: #c390ba;
    cursor: pointer;
  }
`;

const TableHeader = styled.th`
  font-weight: bold;
  font-size: 20px;
  white-space: nowrap;
  border-bottom: 1px solid lightgray;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (max-width: 500px) {
    font-size: 15px;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }
`;

const TableData = styled.td`
  text-align: center;
  font-size: 18px;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (max-width: 500px) {
    font-size: 13px;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }
`;
