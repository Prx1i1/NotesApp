import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
/*import AppRoutes from './AppRoutes';*/
import { Layout } from './components/Layout';
import './custom.css';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Trash } from './components/Trash';




export default class App extends Component {
  

    constructor(props) {
        super(props)
        this.state = { isMenuVisible: false }
        console.log(this.state)
    }


    static displayName = App.name;

    toggleMenu = () => {
        console.log("a top level function", this.state)
        let temp = !this.state.isMenuVisible
        this.setState({ isMenuVisible: temp})
        return temp
    }

    getMenuState = () => {
        return this.state.isMenuVisible
    }

    AppRoutes = [
        {
            index: true,
            element: <Home />
        },
        {
            path: '/counter',
            element: <Counter />
        },
        {
            path: '/fetch-data',
            element: <FetchData toggleMenu={this.toggleMenu} isMenuVisible={this.getMenuState} />
        },
        {
            path: '/trash',
            element: <Trash />
        }
    ];

  render() {
    return (
        <Layout toggleMenu={this.toggleMenu }>
        <Routes>
          {this.AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Layout>
    );
  }
}
