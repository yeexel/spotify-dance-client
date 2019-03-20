import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { withAuthContext } from "../infrastructure/AuthContext";
import LogoT from "../img/logo_t.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Header extends React.Component<any, any> {
  state = {
    sideNav: false
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollEventListener);
  }

  toggleSideNav = () => {
    this.setState({ sideNav: !this.state.sideNav })
  }

  scrollEventListener = () => {
    const headerEl = document.getElementsByTagName("header")[0];

    if (window.pageYOffset > 50) {
      headerEl.style.background = "rgba(8, 8, 8, 1)";
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
            <Nav>
              <DesktopNav>
                <NavItem>
                  <Link to="/">
                    <FontAwesomeIcon icon="headphones" /> Playlists
                  </Link>
                </NavItem>
                <NavItemSeparator />
                <NavItem>
                  <Link to="/account">
                    <FontAwesomeIcon icon="user" /> Profile
                  </Link>
                </NavItem>
                <NavItemSeparator />
                <NavItem>|</NavItem>
                <NavItemSeparator />
                <NavItem onClick={authContext.logout}><FontAwesomeIcon icon="sign-out-alt" /> Logout</NavItem>
              </DesktopNav>
              <MobileNav onClick={this.toggleSideNav}>
                <FontAwesomeIcon icon="bars" />
              </MobileNav>
              <MobileSideNav show={this.state.sideNav}>
                <CloseBtnContainer onClick={this.toggleSideNav}>
                  <FontAwesomeIcon icon="times" />
                </CloseBtnContainer>
                <MobileSideNavLink to="/" onClick={this.toggleSideNav}>Playlists</MobileSideNavLink>
                <MobileSideNavLink to="/account" onClick={this.toggleSideNav}>Profile</MobileSideNavLink>
              </MobileSideNav>
            </Nav>
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
    height: 50px;
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

  @media (max-width: 500px) {
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  margin-top: -10px;

  > img {
    width: 150px;
    height: 150px;

    @media (max-width: 500px) {
      width: 90px;
      height: 90px;
    }
  }

  @media (max-width: 500px) {
    margin-top: -5px;
  }
`;

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DesktopNav = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 500px) {
    display: none;
  }
`;

const NavItem = styled.span`
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;

  > a {
    color: #fff;
    text-decoration: none;
  }
`

const NavItemSeparator = styled.div`
  width: 30px;
`;

const MobileNav = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 500px) {
    width: 20px;
    height: 20px;
    margin-top: -7px;
    margin-right: 15px;
    display: block;
  }
`;

const MobileSideNav = styled.div<{ show: boolean; }>`
  height: 100%; /* 100% Full-height */
  width: ${props => props.show ? 250 : 0}px; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 3; /* Stay on top */
  top: 0; /* Stay at the top */
  right: 0;
  background-color: #000; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
`;

const CloseBtnContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 24px;
  margin-left: 0;
  color: #fff;
`;

const MobileSideNavLink = styled(Link)`
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #fff;
  display: block;
  transition: 0.3s;
`;

const LoginButtonContainer = styled.div`
  margin-top: -7px;
  margin-right: 15px;
`

const LoginButton = styled.button`
  background-color: transparent;
  border-radius: 2em;
  border: 0.2em solid #fff;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 0.7em 1.5em;
  outline: none;
  text-transform: uppercase;
  transition: all 0.25s ease;

  @media (max-width: 500px) {
    font-size: 8px;
  }

  &:hover {
    background: #fff;
    color: #000;
  }
`;
