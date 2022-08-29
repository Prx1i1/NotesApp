import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
    static displayName = Layout.name;

  render() {
    return (
      <div className="mainBody">
            <NavMenu toggleMenu={this.props.toggleMenu} update={this.props.update} />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
