import React, { Component } from 'react';
import Select from 'react-select';
import {normalize, schema} from 'normalizr';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import 'react-select/dist/react-select.css';
import * as api from './api';
// import {listObj} from './data';

const listSchema = new schema.Entity('lists');
const listListSchema = [listSchema];
// const mockLists = _ => Promise.resolve(listObj);

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listIds: [],
      lists: {},
      selectedListId: undefined,
      fieldsmap: undefined,
      isSubmitting: false
    };
    this.onListChange = this.onListChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    api.get(`/lists?limit=50&offset=0&order=-Created`)
    .then(response => {
      const res = normalize(response.data, listListSchema);
      this.setState(({lists, listIds}) => ({
        lists: Object.assign({}, lists, res.entities.lists),
        listIds: [...listIds, ...res.result]
      }));
    });
  }

  onListChange(list) {
    this.setState({
      selectedListId: list ? list.id : undefined,
      fieldsmap: list ? list.fieldsmap.filter(field => !field.readonly) : undefined
    });
  }

  onSubmit() {
    let contactBody = {};
    let customfields = [];
    this.state.fieldsmap.filter(field => !field.hidden && !field.internal)
    .map(field => {
      const textvalue = this.refs[field.value].getValue();
      if (field.customfield) {
        customfields = [...customfields, {value: textvalue, name: field.name}];
      } else {
        contactBody[field.value] = textvalue;
      }
    })
    contactBody.listid = this.state.selectedListId;

    const list = this.state.lists[this.state.selectedListId];
    this.setState({isSubmitting: true});

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
      this.setState({isSubmitting: false, lists: Object.assign({}, this.state.lists, {[list.id]: list})});
      this.props.onRefresh();
    });
  }

  render() {
    const {lists, listIds, selectedListId, fieldsmap, isSubmitting} = this.state;
    const options = listIds.map(id => lists[id]);

    return (
      <div style={this.props.style}>
        <Select
        labelKey='name'
        valueKey='id'
        maxHeight={100}
        options={options}
        placeholder='Select List to Create Contact'
        onChange={this.onListChange}
        value={selectedListId}
        />
        <span className='right pointer' style={{fontSize: '0.7em'}}>+ ADD NEW LIST</span>
        <div style={{marginTop: 15}} >
      {
        fieldsmap &&
        <div>
        {
          fieldsmap.filter(field => !field.hidden && !field.internal).map(field =>
            <div>
              <label style={{color: 'gray', fontSize: '0.9em'}}>{field.name}</label>
              <TextField floatingLabelFixed fullWidth ref={field.value} />
            </div>
            )
        }
          <div style={{margin: '10px 0'}} className='horizontal-center'>
            <RaisedButton
            primary
            label='Submit'
            icon={<FontIcon className={isSubmitting ? 'fa fa-spinner fa-spin' : 'fa fa-arrow-up'} />}
            onClick={this.onSubmit}
            />
          </div>
        </div>
      }
        </div>
      </div>
    );
  }
}
