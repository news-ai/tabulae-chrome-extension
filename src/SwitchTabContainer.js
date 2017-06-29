import React, { Component } from 'react';
import ListView from './ListView';
import EmailView from './EmailView';
import cn from 'classnames';

export default class SwitchTabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'listview'
    };
  }

  render() {
    const {currentTab} = this.state;
    return (
      <div style={{height: '100%'}}>
        <div className='row' style={{borderBottom: '1px solid gray'}} >
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
        <ListView style={{display: currentTab === 'listview' ? 'block' : 'none'}} />
        <EmailView style={{display: currentTab === 'emailview' ? 'block' : 'none'}} />
      </div>
    );
  }
}
