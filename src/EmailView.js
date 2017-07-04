import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {blue200, blue50, lightBlue50, grey600, grey400} from 'material-ui/styles/colors';
import * as api from './api';
import {normalize, schema} from 'normalizr';
import moment from 'moment-timezone';
const listSchema = new schema.Entity('lists');
const listListSchema = [listSchema];
const emailSchema = new schema.Entity('emails');
const emailListSchema = [emailSchema];
const contactSchema = new schema.Entity('contacts');
const contactListSchema = [contactSchema];


const FORMAT = 'ddd, MMM Do Y, hh:mm A';
const DEFAULT_DATESTRING = '0001-01-01T00:00:00Z';

const fontIconStyle = {fontSize: 16};

const CountViewItem = ({label, count, iconName, onTouchTap, style}) => {
  return (
      <Chip style={style} backgroundColor={blue50} onTouchTap={onTouchTap}>
        <Avatar
        size={25}
        backgroundColor={blue200}
        color='#ffffff'
        >{count}</Avatar>
        {label} <FontIcon style={fontIconStyle} className={iconName}/>
      </Chip>
    );
}

const EmailItem = ({subject, body, to, from, contactId, listid, opened, clicked, sendat, contact, created}) => {
  const recepientString = contact ? `${contact.firstname} ${contact.lastname} <${to}>` : to;
  const sendAtDatestring = sendat === DEFAULT_DATESTRING ?
  moment(created).tz(moment.tz.guess()).format(FORMAT) :
  moment(sendat).tz(moment.tz.guess()).format(FORMAT);
  return (
    <Paper zDepth={1} className='row' style={{margin: '5px 0', padding: '10px 3px'}} >
      <div className='large-12 medium-12 small-12 columns'>
        <span style={{color: grey600, fontSize: '0.9em'}} >{sendAtDatestring}</span>
      </div>
      <div className='large-12 medium-12 small-12 columns'>
        <span style={{color: grey600}} >{from}</span>
      </div>
      <div className='large-12 medium-12 small-12 columns'>
        <span style={{color: grey600}} ><strong>To: </strong>{recepientString}</span>
      </div>
      <div style={{margin: '10px 0'}} className='large-12 medium-12 small-12 columns'>
        <a href={`https://tabulae.newsai.co/tables/${listid}/${contactId}`} target='_blank'>
          <span style={{fontWeight: 'bold'}} >{subject}</span>
        </a>
      </div>
      <div className='large-6 medium-6 small-6 columns'>
        <CountViewItem label='Opened' count={opened} iconName='fa fa-paper-plane-o' />
      </div>
      <div className='large-6 medium-6 small-6 columns'>
        <CountViewItem label='Clicked' count={clicked} iconName='fa fa-hand-pointer-o' />
      </div>
    </Paper>
    );
};

export default class EmailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: {},
      contactIds: [],
      lists: {},
      listIds: [],
      emails: {},
      emailIds: [],
      offset: 0,
      isReceiving: false
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSearchKeyDown = e => e.key === 'Enter' ? this.onSearch(this.refs.searchValue.getValue()) : null;
  }

  componentWillMount() {
    // this.onSearch('ycp217@nyu.edu');
  }

  onSearch(queryString) {
    if (!queryString) return;
    this.setState({isReceiving: true});

    return api.get(`/emails/search?q="${queryString}"&limit=50&offset=${this.state.offset}`)
    .then(response => {
      const emailRes = normalize(response.data, emailListSchema);
      const listRes = normalize(response.included.filter(item => item.type === 'lists'), listListSchema);
      const contactRes = normalize(response.included.filter(item => item.type === 'contacts'), contactListSchema);
      // console.log(emailRes);
      // console.log(listRes);
      // console.log(contactRes);
      this.setState(({contacts, contactIds, lists, listIds, emails, emailIds, offset}) => ({
        emails: Object.assign({}, emails, emailRes.entities.emails),
        emailIds: [...emailIds, ...emailRes.result.filter(emailId => !emails[emailId])],
        lists: Object.assign({}, lists, listRes.entities.lists),
        listIds: [...listIds, ...listRes.result.filter(listId => !lists[listId])],
        contacts: Object.assign({}, contacts, contactRes.entities.contacts),
        contactIds: [...contactIds, ...contactRes.result.filter(contactId => !contacts[contactId])],
        total: response.summary.total,
        offset: response.data.length === 50 ? offset + 50 : null,
        isReceiving: false,
      }));
    })
    .catch(err => console.log(err));
  }

  render() {
    const {emailIds, emails, contacts, offset, isReceiving} = this.state;
    return (
      <div style={this.props.style}>
        <div className='vertical-center'>
          <TextField id='searchValue' fullWidth floatingLabelFixed floatingLabelText='Search Emails' onKeyDown={this.onSearchKeyDown} placeholder='e.g. person@company.com' ref='searchValue' />
          <IconButton iconClassName='fa fa-search' onClick={_ => this.onSearch(this.refs.searchValue.getValue()) } />
        </div>
        <div>
        {emailIds.map(emailId =>
          <EmailItem key={emailId} contact={contacts[emails[emailId].contactId]} {...emails[emailId]} />)}
        </div>
      {offset !== null && offset !== 0 &&
        <div className='vertical-center'>
          <div className='pointer' onClick={_ => this.onSearch(this.refs.searchValue.getValue()) }>Fetch More</div>
        {isReceiving &&
          <FontIcon color={grey400} className='fa fa-spin fa-spinner' />}
        </div>
      }
      </div>
    );
  }
}
