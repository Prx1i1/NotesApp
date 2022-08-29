import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
          <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-0" container light>
          <button onClick={()=>this.props.toggleMenu()}><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></button>
          <NavbarBrand className="mx-2" tag={Link} to="/">NotesProject</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              {/*<NavItem>*/}
              {/*  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>*/}
              {/*</NavItem>*/}
              {/*<NavItem>*/}
              {/*  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>*/}
              {/*</NavItem>*/}
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/fetch-data">Notes Collection</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/trash">Trash</NavLink>
              </NavItem>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
