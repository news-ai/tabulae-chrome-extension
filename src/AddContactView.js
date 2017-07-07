/*global chrome*/
import React, { Component } from 'react';
import Select from 'react-select';
import Snackbar from 'material-ui/Snackbar';
import {normalize, schema} from 'normalizr';
import 'react-select/dist/react-select.css';
import * as api from './api';
import AddContactForm from './AddContactForm';
import AddListForm from './AddListForm';
import {grey600} from 'material-ui/styles/colors';

const listSchema = new schema.Entity('lists');
const listListSchema = [listSchema];

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listIds: [],
      lists: {},
      selectedListId: undefined,
      fieldsmap: undefined,
      showListForm: true,
      alert: undefined,
      showNewListView: false,
      cacheExist: false
    };
    this.onListChange = this.onListChange.bind(this);
    this.onAfterContactSubmit = this.onAfterContactSubmit.bind(this);
    this.onUpdateLists = this.onUpdateLists.bind(this);
    this.onAlert = this.onAlert.bind(this);
    this.onFetchAllLists = this.onFetchAllLists.bind(this);
    this.resumeCacheForm = this.resumeCacheForm.bind(this);
    this.clearCache = this.clearCache.bind(this);
  }

  componentWillMount() {
    this.onFetchAllLists();
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.sync.get('tabulaeChromeExtension', ({tabulaeChromeExtension}) => {
        if (tabulaeChromeExtension) this.setState({cacheExist: true});
      });
    }
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
    chrome.storage.sync.set({tabulaeChromeExtension: {
      listId: this.state.selectedListId,
      text: {}
    }});
    setTimeout(_ => this.setState({showListForm: true}), 10);
  }

  onAlert(message) {
    this.setState({alert: message});
  }

  resumeCacheForm() {
    chrome.storage.sync.get('tabulaeChromeExtension', generalStore => {
      const store = generalStore.tabulaeChromeExtension;
      if (store) {
        this.onListChange(this.state.lists[store.listId]);
      }
    });
  }

  clearCache() {
    chrome.storage.sync.clear();
    this.onListChange(undefined);
    this.setState({cacheExist: false});
  }

  render() {
    const {showNewListView, lists, listIds, selectedListId, fieldsmap, showListForm, alert, cacheExist} = this.state;
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
      {cacheExist &&
        <span
        className='left pointer'
        style={{fontSize: '0.9em', color: grey600, margin: 5}}
        onClick={selectedListId ? this.clearCache : this.resumeCacheForm}
        >{selectedListId ? 'Clear Cache' : 'Resume Last Form'}</span>}
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
        style={{fontSize: '0.9em', color: grey600, margin: 5}}
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
