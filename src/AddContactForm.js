/*global chrome*/
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';
import * as api from './api';

export default class AddContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      textObj: {},
      dirty: false,
      alert: undefined
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.sync.get('tabulaeChromeExtension', generalStore => {
        const store = generalStore.tabulaeChromeExtension;
        if (store) {
          if (store.listId === this.props.selectedListId) this.setState({textObj: store.text});
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedListId !== nextProps.selectedListId) {
      this.setState({textObj: {}, dirty: false});
    }
  }

  onChange(fieldname, value) {
    this.setState(
      (state, props) => ({dirty: true, textObj: Object.assign({}, state.textObj, {[fieldname]: value})}),
      _ => {
        if (process.env.NODE_ENV === 'production') {
          chrome.storage.sync.set({tabulaeChromeExtension: {
            listId: this.props.selectedListId,
            text: this.state.textObj
          }}, function() {
              // Notify that we saved.
              console.log('Settings saved');
            });
        }
      });
  }

  onSubmit() {
    let customfields = [];
    let contactBody = this.props.fieldsmap.reduce((acc, field) => {
      if (!field.hidden && !field.internal) {
        const textvalue = this.state.textObj[field.value];
        if (field.customfield) {
          customfields = [...customfields, {value: textvalue, name: field.name}];
        } else {
          acc[field.value] = textvalue;
        }
      }
      return acc;
    }, {});
    contactBody.customfields = customfields;
    contactBody.listid = this.props.selectedListId;

    const list = this.props.lists[this.props.selectedListId];
    this.setState({isSubmitting: true, alert: "Contact saving... Don't close the window."});

    return api.post(`/contacts`, [contactBody])
    .then(response => {
      const ids = response.data.map(contact => contact.id);
      const listBody = {
        name: list.name,
        contacts: list.contacts === null ? ids : [...list.contacts, ...ids],
      };
      if (list.client) listBody.client = list.client;
      if (list.tags !== null) listBody.tags = list.tags;

      return api.patch(`/lists/${list.id}`, listBody);
    })
    .then(response => {
      const list = response.data;
      this.setState({isSubmitting: false, alert: undefined, dirty: false});
      this.props.onUpdateLists(list);
      this.props.onAlert(`Contact added to List: "${list.name}"`);
      this.props.onRefresh();
    });
  }

  render() {
    return (
      <div>
      {
        this.props.fieldsmap.filter(field => !field.hidden && !field.internal).map(field =>
          <TextField
          floatingLabelFixed
          fullWidth
          floatingLabelText={field.name}
          value={this.state.textObj[field.value] || ''}
          onChange={e => this.onChange(field.value, e.target.value)}
          key={field.value}
          />)
      }
        <Snackbar open={this.state.alert} message={this.state.alert} />
        <div style={{margin: '10px 0'}} className='horizontal-center'>
          <RaisedButton
          primary
          label='Submit'
          style={{zIndex: 0}}
          icon={<FontIcon className={this.state.isSubmitting ? 'fa fa-spinner fa-spin' : 'fa fa-arrow-up'} />}
          onClick={this.onSubmit}
          />
        </div>
      </div>
    );
  }
}
