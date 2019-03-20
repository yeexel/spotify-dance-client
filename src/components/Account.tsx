import * as React from "react";
import { Link } from "react-router-dom";
import { getAccount } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";

interface State {
  data: {
    name: string,
    email: string,
    avatar_url: string
  },
  isLoading: boolean;
}

class Account extends React.Component<any, State> {
  state = {
    data: {
      name: "",
      email: "",
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

    return (
      <div>
        <div>Account page YES!!!</div>
        {isLoading ? (
          <div>"Loading user data..."</div>
        ) : (
          <div>
            <span>{data.name}</span>
            <br />
            <span>{data.email}</span>
            <br />
            <img src={data.avatar_url} width={200} height={200} />
          </div>
        )}
        <Link to="/">Dashboard</Link>
      </div>
    );
  }
}

export default withAuthContext(Account);
