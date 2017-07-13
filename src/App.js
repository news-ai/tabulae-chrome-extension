
/*global mixpanel*/
import React, { Component } from 'react';
// import logo from './logo.svg';
import SwitchTabContainer from './SwitchTabContainer';


import './App.css';
import * as api from './api';

const NotLoggedIn = _ => (
  <div style={{height: '100%'}} className='vertical-center horizontal-center'>
    <span>Please log in at
    <a href='https://tabulae.newsai.co' target='_blank' rel='noopener noreferrer'>Tabulae</a> to access the Tabulae Chrome extension for Contact Quick-Add and Email QuickView.</span>
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
    this.alert = this.alert.bind(this);
  }

  componentWillMount() {
    api.get('/users/me')
    .then(response => {
      const person = response.data;
      this.setState({loggedIn: true, person});
      if (process.env.NODE_ENV === 'production') {
        mixpanel.person.set({email: person.email, name: person.name});
        mixpanel.identify(person.id);
        mixpanel.track('open_chrome_extension');
      }
    })
    .catch(err => {
      console.log(err);
      this.setState({loggedIn: false})
    });
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
