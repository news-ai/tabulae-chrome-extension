import React, { Component } from 'react';
import Select from 'react-select';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import {normalize, schema} from 'normalizr';
import 'react-select/dist/react-select.css';
import * as api from './api';
import AddContactForm from './AddContactForm';
import AddListForm from './AddListForm';
import {grey600} from 'material-ui/styles/colors';
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
      isSubmitting: false,
      showListForm: true,
      alert: undefined,
      showNewListView: false
    };
    this.onListChange = this.onListChange.bind(this);
    this.onAfterContactSubmit = this.onAfterContactSubmit.bind(this);
    this.onUpdateLists = this.onUpdateLists.bind(this);
    this.onAlert = this.onAlert.bind(this);
    this.onFetchAllLists = this.onFetchAllLists.bind(this);
  }

  componentWillMount() {
    this.onFetchAllLists();
  }

  onFetchAllLists() {
    api.get(`/lists?limit=50&offset=0&order=-Created`)
    .then(response => {
      const res = normalize(response.data, listListSchema);
      this.setState(({lists, listIds}) => ({
        lists: Object.assign({}, lists, res.entities.lists),
        listIds: [...listIds, ...res.result.filter(listId => !lists[listId])]
      }));
    });
  }

  onUpdateLists(list) {
    this.setState({
      lists: Object.assign({}, this.state.lists, {[list.id]: list}),
      listIds: [list.id, ...this.state.listIds.filter(id => id !== list.id)]
    });
  }

  onListChange(list) {
    this.setState({
      selectedListId: list ? list.id : undefined,
      fieldsmap: list ? list.fieldsmap.filter(field => !field.readonly) : undefined
    });
  }

  onAfterContactSubmit() {
    this.setState({showListForm: false});
    setTimeout(_ => this.setState({showListForm: true}), 10);
  }

  onAlert(message) {
    this.setState({alert: message});
  }

  render() {
    const {showNewListView, lists, listIds, selectedListId, fieldsmap, isSubmitting, showListForm, alert} = this.state;
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
      {showNewListView ?
        <AddListForm
        style={{marginTop: 10}}
        onClose={_ => this.setState({showNewListView: false})}
        onFinish={list => {
          this.onUpdateLists(list);
          this.onAlert(`List: "${list.name}" created.`);
        }}
        /> :
        <span
        className='right pointer'
        style={{fontSize: '0.7em', color: grey600, margin: 5}}
        onClick={_ => this.setState({showNewListView: true})}
        >+ ADD NEW LIST</span>
      }
        <Snackbar
        open={alert}
        message={alert}
        autoHideDuration={4000}
        onRequestClose={_ => this.setState({alert: undefined})}
        />
        <div style={{marginTop: 15}} >
      {
        fieldsmap && showListForm &&
          <AddContactForm
          lists={lists}
          selectedListId={selectedListId}
          fieldsmap={fieldsmap}
          onUpdateLists={this.onUpdateLists}
          onRefresh={this.onAfterContactSubmit}
          onAlert={this.onAlert}
          />
      }
        </div>
      </div>
    );
  }
}
