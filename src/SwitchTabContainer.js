import React, { Component } from 'react';
import AddContactView from './AddContactView';
import EmailView from './EmailView';

export default class SwitchTabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'AddContactView',
      refreshTab: undefined
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh(refreshTab) {
    this.setState({refreshTab});
    setTimeout(_ => this.setState({refreshTab: undefined}), 50);
  }

  render() {
    const {currentTab, refreshTab} = this.state;
    const className = 'large-4 medium-4 small-4 columns pointer';
    return (
      <div style={{height: '100%'}}>
        <div className='row' style={{
          borderBottom: '1px solid gray',
        }} >
          <div
          className={className}
          style={{backgroundColor: currentTab === 'AddContactView' && 'lightblue'}}
          onClick={_ => this.setState({currentTab: 'AddContactView'})}
          >Add Contact</div>
          <div
          className={className}
          style={{backgroundColor: currentTab === 'EmailView' && 'lightblue'}}
          onClick={_ => this.setState({currentTab: 'EmailView'})}
          >See Emails</div>
        </div>
        <div style={{margin: 8}}>
          {
            refreshTab !== 'AddContactView' &&
            <AddContactView onRefresh={_ => this.onRefresh('AddContactView')} style={{display: currentTab === 'AddContactView' ? 'block' : 'none', width: '100%'}} />
          }
          {
            refreshTab !== 'EmailView' &&
            <EmailView onRefresh={_ => this.onRefresh('EmailView')} style={{display: currentTab === 'EmailView' ? 'block' : 'none', width: '100%'}} />
          }
        </div>
      </div>
    );
  }
}
