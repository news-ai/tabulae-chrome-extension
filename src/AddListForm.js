import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {grey600} from 'material-ui/styles/colors';
import * as api from './api';

export default class AddListForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const name = this.refs.newListName.getValue();
    if (!name) return;
    this.setState({isSubmitting: true});
    return api.post(`/lists`, {name, contacts: []})
    .then(response => {
      this.setState({isSubmitting: false});
      this.props.onFinish(response.data);
      this.props.onClose();
    });

  }

  render() {
    return (
      <div style={this.props.style}>
        <FontIcon onClick={this.props.onClose} className='fa fa-times pointer' style={{float: 'right', fontSize: '0.9em', color: grey600}} />
        <label style={{marginTop: 10}} >New List Name</label>
        <TextField fullWidth ref='newListName'/>
        <div style={{margin: '10px 0'}} className='horizontal-center'>
          <RaisedButton
          style={{zIndex: 0}}
          primary
          label='Submit'
          icon={<FontIcon className={this.state.isSubmitting ? 'fa fa-spinner fa-spin' : 'fa fa-arrow-up'} />}
          onClick={this.onSubmit}
          />
        </div>
      </div>
    );
  }
}