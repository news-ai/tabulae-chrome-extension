import React, { Component } from 'react';
import ListView from './ListView';
import EmailView from './EmailView';

export default class SwitchTabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'listview',
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
    return (
      <div style={{height: '100%'}}>
        <div className='row' style={{
          borderBottom: '1px solid gray',
        }} >
          <div
          className='large-6 medium-6 small-6 columns pointer'
          style={{backgroundColor: currentTab === 'listview' && 'lightblue'}}
          onClick={_ => this.setState({currentTab: 'listview'})}
          >Add Contact</div>
          <div
          className='large-6 medium-6 small-6 columns pointer'
          style={{backgroundColor: currentTab === 'emailview' && 'lightblue'}}
          onClick={_ => this.setState({currentTab: 'emailview'})}
          >See Emails</div>
        </div>
        <div style={{margin: 8}}>
          {
            refreshTab !== 'listview' &&
            <ListView onRefresh={_ => this.onRefresh('listview')} style={{display: currentTab === 'listview' ? 'block' : 'none', width: '100%'}} />
          }
          {
            refreshTab !== 'emailview' &&
            <EmailView onRefresh={_ => this.onRefresh('listview')} style={{display: currentTab === 'emailview' ? 'block' : 'none', width: '100%'}} />
          }
        </div>
      </div>
    );
  }
}
