import * as React from "react";
import { Link } from "react-router-dom";
import { getAccount } from "../infrastructure/api";
import { withAuthContext } from "../infrastructure/AuthContext";

interface State {
  displayName: string;
  email: string;
  isLoading: boolean;
  imageSrc: string;
  imageHeight: number;
  imageWidth: number;
}

class Account extends React.Component<any, State> {
  state = {
    displayName: "",
    email: "",
    imageSrc: "",
    imageHeight: 0,
    imageWidth: 0,
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
      email: accountData.email,
      displayName: accountData.display_name,
      imageSrc: accountData.images[0].url,
      imageHeight: accountData.images[0].height,
      imageWidth: accountData.images[0].width
    });
  };

  render() {
    const {
      isLoading,
      email,
      imageSrc,
      imageHeight,
      imageWidth,
      displayName
    } = this.state;

    return (
      <React.Fragment>
        <div>Account page YES!!!</div>
        {isLoading ? (
          <div>"Loading user data..."</div>
        ) : (
          <div>
            <span>{displayName}</span>
            <br />
            <span>{email}</span>
            <br />
            <img src={imageSrc} width={imageWidth} height={imageHeight} />
          </div>
        )}
        <Link to="/">Dashboard</Link>
      </React.Fragment>
    );
  }
}

export default withAuthContext(Account);
