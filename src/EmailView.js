import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import * as api from './api';
import {normalize, schema} from 'normalizr';
import IconButton from 'material-ui/IconButton';
import {lightBlue50, grey600} from 'material-ui/styles/colors';
import moment from 'moment-timezone';
const listSchema = new schema.Entity('lists');
const listListSchema = [listSchema];
const emailSchema = new schema.Entity('emails');
const emailListSchema = [emailSchema];
const contactSchema = new schema.Entity('contacts');
const contactListSchema = [contactSchema];


const FORMAT = 'ddd, MMM Do Y, hh:mm A';
const DEFAULT_DATESTRING = '0001-01-01T00:00:00Z';

const EmailItem = ({subject, body, to, from, contactId, listid, opened, clicked, sendat, contact, created}) => {
  const recepientString = contact ? `${contact.firstname} ${contact.lastname} <${to}>` : to;
  const sendAtDatestring = sendat === DEFAULT_DATESTRING ?
  moment(created).tz(moment.tz.guess()).format(FORMAT) :
  moment(sendat).tz(moment.tz.guess()).format(FORMAT);
  return (
    <div className='row' style={{backgroundColor: lightBlue50, margin: '5px 0', padding: '5px 3px'}} >
      <div className='large-12 medium-12 small-12 columns'>
        <span style={{color: grey600, fontSize: '0.8em'}} >{sendAtDatestring}</span>
      </div>
      <div className='large-12 medium-12 small-12 columns'>
        <span style={{color: grey600, fontSize: '0.9em'}} >{from}</span>
      </div>
      <div className='large-12 medium-12 small-12 columns'>
        <span style={{color: grey600, fontSize: '0.9em'}} ><strong>To: </strong>{recepientString}</span>
      </div>
      <div className='large-12 medium-12 small-12 columns'>
        <a href={`https://tabulae.newsai.co/${listid}/${contactId}`} target='_blank'>
          <span style={{fontWeight: 'bold', fontSize: '0.9em'}} >{subject}</span>
        </a>
      </div>
      <div className='large-6 medium-6 small-6 columns'>
        <span>Opens: {opened} </span>
      </div>
      <div className='large-6 medium-6 small-6 columns'>
        <span>Clicks: {clicked} </span>
      </div>
    </div>
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
      emailIds: []
    };
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch() {
    const queryString = this.refs.searchValue.getValue();
    if (!queryString) return;

    return api.get(`/emails/search?q="${queryString}"`)
    .then(response => {
      const emailRes = normalize(response.data, emailListSchema);
      const listRes = normalize(response.included.filter(item => item.type === 'lists'), listListSchema);
      const contactRes = normalize(response.included.filter(item => item.type === 'contacts'), contactListSchema);
      console.log(emailRes);
      console.log(listRes);
      console.log(contactRes);
      this.setState(({contacts, contactIds, lists, listIds, emails, emailIds}) => ({
        emails: Object.assign({}, emails, emailRes.entities.emails),
        emailIds: [...emailIds, ...emailRes.result.filter(emailId => !emails[emailId])],
        lists: Object.assign({}, lists, listRes.entities.lists),
        listIds: [...listIds, ...listRes.result.filter(listId => !lists[listId])],
        contacts: Object.assign({}, contacts, contactRes.entities.contacts),
        contactIds: [...contactIds, ...contactRes.result.filter(contactId => !contacts[contactId])],
      }));
    })
    .catch(err => console.log(err));
  }

  render() {
    const {emailIds, emails, contacts} = this.state;
    return (
      <div style={this.props.style}>
        <div>
          <label>Search</label>
          <TextField ref='searchValue' />
          <IconButton iconClassName='fa fa-search' onClick={this.onSearch} />
        </div>
        <div>
        {emailIds.map(emailId => <EmailItem contact={contacts[emails[emailId].contactId]} {...emails[emailId]} />)}
        </div>
      </div>
    );
  }
}
