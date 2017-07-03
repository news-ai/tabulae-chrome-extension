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
    .then(_ => {
      this.setState({isSubmitting: false});
      this.props.onFinish();
      this.props.onClose();
    });

  }

  render() {
    return (
      <div style={this.props.style}>
        <IconButton onClick={this.props.onClose} iconClassName='fa fa-times' style={{float: 'right', fontSize: '0.9em', color: grey600}} />
        <label>New List Name</label>
        <TextField fullWidth ref='newListName'/>
        <div style={{margin: '10px 0'}} className='horizontal-center'>
          <RaisedButton
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