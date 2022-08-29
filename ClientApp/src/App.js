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
  
    static displayName = App.name;

    constructor() {
        super()
        this.state = { isMenuVisible: false, dummy: 0 }
        console.log(this.state)
    }

    update = () => {
        this.setState({dummy : this.state.dummy + 1})
    }

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

    getAppRoutes() {
        return [{
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
            }]
    }

    render() {
      let appRoutes = this.getAppRoutes()
    return (
        <Layout toggleMenu={this.toggleMenu} isMenuVisible={this.state.isMenuVisible} update={this.update}>
            {this.getMenuState()}
        <Routes>
          {appRoutes.map((route, index) => {
            const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Layout>
    );
  }
}
