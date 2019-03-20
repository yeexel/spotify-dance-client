import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { withAuthContext } from "../infrastructure/AuthContext";
import LogoT from "../img/logo_t.png";

class Header extends React.Component<any, any> {
  componentDidMount() {
    window.addEventListener("scroll", this.scrollEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollEventListener);
  }

  scrollEventListener = () => {
    const headerEl = document.getElementsByTagName("header")[0];

    if (window.pageYOffset > 50) {
      headerEl.style.background = "rgba(8, 8, 8, 0.9)";
      headerEl.style.transition = "background-color 200ms linear";
    } else {
      headerEl.style.background = "transparent";
    }
  }

  render() {
    const { authContext } = this.props;

    return (
      <HeaderContainer>
        <Container>
          <Logo>
            <img src={LogoT} />
          </Logo>
          {authContext.isAuth && (
            <Icons>
              <Link to="/account">
                <div className="block">
                  <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Mi45IDQ4Mi45IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0ODIuOSA0ODIuOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIzOS43LDI2MC4yYzAuNSwwLDEsMCwxLjYsMGMwLjIsMCwwLjQsMCwwLjYsMGMwLjMsMCwwLjcsMCwxLDBjMjkuMy0wLjUsNTMtMTAuOCw3MC41LTMwLjUgICAgYzM4LjUtNDMuNCwzMi4xLTExNy44LDMxLjQtMTI0LjljLTIuNS01My4zLTI3LjctNzguOC00OC41LTkwLjdDMjgwLjgsNS4yLDI2Mi43LDAuNCwyNDIuNSwwaC0wLjdjLTAuMSwwLTAuMywwLTAuNCwwaC0wLjYgICAgYy0xMS4xLDAtMzIuOSwxLjgtNTMuOCwxMy43Yy0yMSwxMS45LTQ2LjYsMzcuNC00OS4xLDkxLjFjLTAuNyw3LjEtNy4xLDgxLjUsMzEuNCwxMjQuOUMxODYuNywyNDkuNCwyMTAuNCwyNTkuNywyMzkuNywyNjAuMnogICAgIE0xNjQuNiwxMDcuM2MwLTAuMywwLjEtMC42LDAuMS0wLjhjMy4zLTcxLjcsNTQuMi03OS40LDc2LTc5LjRoMC40YzAuMiwwLDAuNSwwLDAuOCwwYzI3LDAuNiw3Mi45LDExLjYsNzYsNzkuNCAgICBjMCwwLjMsMCwwLjYsMC4xLDAuOGMwLjEsMC43LDcuMSw2OC43LTI0LjcsMTA0LjVjLTEyLjYsMTQuMi0yOS40LDIxLjItNTEuNSwyMS40Yy0wLjIsMC0wLjMsMC0wLjUsMGwwLDBjLTAuMiwwLTAuMywwLTAuNSwwICAgIGMtMjItMC4yLTM4LjktNy4yLTUxLjQtMjEuNEMxNTcuNywxNzYuMiwxNjQuNSwxMDcuOSwxNjQuNiwxMDcuM3oiIGZpbGw9IiNGRkZGRkYiLz4KCQk8cGF0aCBkPSJNNDQ2LjgsMzgzLjZjMC0wLjEsMC0wLjIsMC0wLjNjMC0wLjgtMC4xLTEuNi0wLjEtMi41Yy0wLjYtMTkuOC0xLjktNjYuMS00NS4zLTgwLjljLTAuMy0wLjEtMC43LTAuMi0xLTAuMyAgICBjLTQ1LjEtMTEuNS04Mi42LTM3LjUtODMtMzcuOGMtNi4xLTQuMy0xNC41LTIuOC0xOC44LDMuM2MtNC4zLDYuMS0yLjgsMTQuNSwzLjMsMTguOGMxLjcsMS4yLDQxLjUsMjguOSw5MS4zLDQxLjcgICAgYzIzLjMsOC4zLDI1LjksMzMuMiwyNi42LDU2YzAsMC45LDAsMS43LDAuMSwyLjVjMC4xLDktMC41LDIyLjktMi4xLDMwLjljLTE2LjIsOS4yLTc5LjcsNDEtMTc2LjMsNDEgICAgYy05Ni4yLDAtMTYwLjEtMzEuOS0xNzYuNC00MS4xYy0xLjYtOC0yLjMtMjEuOS0yLjEtMzAuOWMwLTAuOCwwLjEtMS42LDAuMS0yLjVjMC43LTIyLjgsMy4zLTQ3LjcsMjYuNi01NiAgICBjNDkuOC0xMi44LDg5LjYtNDAuNiw5MS4zLTQxLjdjNi4xLTQuMyw3LjYtMTIuNywzLjMtMTguOGMtNC4zLTYuMS0xMi43LTcuNi0xOC44LTMuM2MtMC40LDAuMy0zNy43LDI2LjMtODMsMzcuOCAgICBjLTAuNCwwLjEtMC43LDAuMi0xLDAuM2MtNDMuNCwxNC45LTQ0LjcsNjEuMi00NS4zLDgwLjljMCwwLjksMCwxLjctMC4xLDIuNWMwLDAuMSwwLDAuMiwwLDAuM2MtMC4xLDUuMi0wLjIsMzEuOSw1LjEsNDUuMyAgICBjMSwyLjYsMi44LDQuOCw1LjIsNi4zYzMsMiw3NC45LDQ3LjgsMTk1LjIsNDcuOHMxOTIuMi00NS45LDE5NS4yLTQ3LjhjMi4zLTEuNSw0LjItMy43LDUuMi02LjMgICAgQzQ0Nyw0MTUuNSw0NDYuOSwzODguOCw0NDYuOCwzODMuNnoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                </div>
              </Link>
              <div
                onClick={authContext.logout}
                style={{ cursor: "pointer" }}
                className="block"
              >
                <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3MS4yIDQ3MS4yIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NzEuMiA0NzEuMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIyNy42MTksNDQ0LjJoLTEyMi45Yy0zMy40LDAtNjAuNS0yNy4yLTYwLjUtNjAuNVY4Ny41YzAtMzMuNCwyNy4yLTYwLjUsNjAuNS02MC41aDEyNC45YzcuNSwwLDEzLjUtNiwxMy41LTEzLjUgICAgcy02LTEzLjUtMTMuNS0xMy41aC0xMjQuOWMtNDguMywwLTg3LjUsMzkuMy04Ny41LDg3LjV2Mjk2LjJjMCw0OC4zLDM5LjMsODcuNSw4Ny41LDg3LjVoMTIyLjljNy41LDAsMTMuNS02LDEzLjUtMTMuNSAgICBTMjM1LjAxOSw0NDQuMiwyMjcuNjE5LDQ0NC4yeiIgZmlsbD0iI0ZGRkZGRiIvPgoJCTxwYXRoIGQ9Ik00NTAuMDE5LDIyNi4xbC04NS44LTg1LjhjLTUuMy01LjMtMTMuOC01LjMtMTkuMSwwYy01LjMsNS4zLTUuMywxMy44LDAsMTkuMWw2Mi44LDYyLjhoLTI3My45Yy03LjUsMC0xMy41LDYtMTMuNSwxMy41ICAgIHM2LDEzLjUsMTMuNSwxMy41aDI3My45bC02Mi44LDYyLjhjLTUuMyw1LjMtNS4zLDEzLjgsMCwxOS4xYzIuNiwyLjYsNi4xLDQsOS41LDRzNi45LTEuMyw5LjUtNGw4NS44LTg1LjggICAgQzQ1NS4zMTksMjM5LjksNDU1LjMxOSwyMzEuMyw0NTAuMDE5LDIyNi4xeiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
              </div>
            </Icons>
          )}
          {!authContext.isAuth && (
            <LoginButtonContainer>
              <LoginButton onClick={authContext.initLogin}>
                Login with Spotify
              </LoginButton>
            </LoginButtonContainer>
          )}
        </Container>
      </HeaderContainer>
    );
  }
}

export default withAuthContext(Header);

const HeaderContainer = styled.header`
  color: #fff;
  height: 100px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;

  @media (max-width: 500px) {
    height: 40px;
    // background-color: rgba(8, 8, 8, 0.9);
    transition: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
`;

const Logo = styled.div`
  margin-top: -10px;

  > img {
    width: 16.5vmin;
    height: 16.5vmin;

    // @media (max-width: 500px) {
    //   width: 80px;
    //   height: 80px;
    // }
  }

  @media (max-width: 500px) {
    margin-top: -5px;
  }
`;

const Icons = styled.div`
  ${HeaderContainer} ${Container} & {
    min-width: 85px;
  }

  ${HeaderContainer} ${Container} & .block {
    display: inline-block;
  }

  ${HeaderContainer} ${Container} & img {
    margin: 0 15px 0;
    display: block;
    height: 25px;
    width: 25px;

    @media (max-width: 500px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const LoginButtonContainer = styled.div`
  margin-top: -10px;
`

const LoginButton = styled.button`
  background-color: transparent;
  border-radius: 2em;
  border: 0.2em solid #fff;
  color: #fff;
  cursor: pointer;
  font-size: 1.4vmin;
  font-weight: bold;
  padding: 0.7em 1.5em;
  outline: none;
  text-transform: uppercase;
  transition: all 0.25s ease;

  &:hover {
    background: #fff;
    color: #000;
  }
`;
