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

    return null;
  }
}

export default withAuthContext(Account);
