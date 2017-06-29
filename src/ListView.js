import React, { Component } from 'react';
import {listObj} from './data';
const mockLists = _ => Promise.resolve(listObj);

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    mockLists()
    .then(response => console.log(response));
  }

  render() {
    return (
      <div style={this.props.style} >LISTVIEW</div>
    );
  }
}
