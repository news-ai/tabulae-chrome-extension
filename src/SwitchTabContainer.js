import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {blue500} from 'material-ui/styles/colors';
import AddContactView from './AddContactView';
import EmailView from './EmailView';

export default class SwitchTabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTab: undefined
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh(refreshTab) {
    this.setState({refreshTab});
    setTimeout(_ => this.setState({refreshTab: undefined}), 50);
  }

  render() {
    const {refreshTab} = this.state;
    return (
      <div style={{height: '100%'}}>
        <Tabs tabItemContainerStyle={{backgroundColor: blue500}} >
          <Tab label='Add Contact'>
          {
            refreshTab !== 'AddContactView' &&
            <AddContactView style={{margin: '0 5px'}} onRefresh={_ => this.onRefresh('AddContactView')} />
          }
          </Tab>
          <Tab label='Email QuickView'>
          {
            refreshTab !== 'EmailView' &&
            <EmailView onRefresh={_ => this.onRefresh('EmailView')} />
          }
          </Tab>
        </Tabs>
      </div>
    );
  }
}
