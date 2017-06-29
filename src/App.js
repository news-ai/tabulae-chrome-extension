import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as api from './api';


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    api.get('/users/me')
    .then(response => {
      console.log(response);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
