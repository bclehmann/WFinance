import * as React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import "./NavMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Brand from "../components/Where1/brand";

export default class NavMenu extends React.PureComponent<
  {},
  { isOpen: boolean }
> {
  public state = {
    isOpen: false
  };

  public render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3 where1-titlebar">
          <Container>
            <NavbarBrand tag={Link} to="/">
              <Brand subtext="Finance" />
            </NavbarBrand>
            <NavbarToggler className="mr-2" onClick={this.toggle}>
              <FontAwesomeIcon icon={faBars} className="navbar-toggler-icon" />
            </NavbarToggler>
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={this.state.isOpen}
              navbar
            >
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">
                    Home
                  </NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }

  private toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
}
