import React, { Component } from 'react';
// import logo from './logo.svg';
import SwitchTabContainer from './SwitchTabContainer';


import './App.css';
import * as api from './api';

const NotLoggedIn = _ => (
  <div style={{height: '100%'}} className='vertical-center horizontal-center'>
    <span>Please log in at <a href='https://tabulae.newsai.co'>Tabulae</a> to access the Tabulae chrome extension.</span>
  </div>
  );

const ErrorOverlay = ({errorMessage}) => (
  <div style={{height: '100%'}} className='vertical-center horizontal-center'>
    <span style={{color: 'red'}}>{errorMessage}</span>
  </div>
  );

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      person: undefined,
      errorOn: false
    };
    this.fetchLists = this.fetchLists.bind(this);
    this.alert = this.alert.bind(this);
  }

  componentWillMount() {
    api.get('/users/me')
    .then(response => this.setState({loggedIn: true, person: response.data}))
    .catch(err => this.setState({loggedIn: false}));
  }

  fetchLists() {
    api.get(`/lists?limit=50&offset=0&order=-Created`)
    .then(response => {

    })
    .catch(err => this.alert('Lists cannot be fetched at this moment. Please contact support.'));
  }

  alert(message) {
    this.setState({errorOn: true, errorMessage: message});
    setTimeout(_ => this.setState({errorOn: false, errorMessage: undefined}), 5000);
  }

  render() {
    return (
      <div className='App'>
      {this.state.errorOn &&
        <ErrorOverlay errorMessage={this.state.errorMessage} />}
      {
        this.state.loggedIn ?
        <SwitchTabContainer /> :
        <NotLoggedIn />
      }
      </div>
    );
  }
}

export default App;
