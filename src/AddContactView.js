import React, { Component } from 'react';
import Select from 'react-select';
import TextField from 'material-ui/TextField';
import {normalize, schema} from 'normalizr';
import 'react-select/dist/react-select.css';
import * as api from './api';
import AddContactForm from './AddContactForm';
import AddListForm from './AddListForm';
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
    setTimeout(_ => this.setState({alert: undefined}), 3000);
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
        onFinish={this.onFetchAllLists}
        /> :
        <span
        className='right pointer'
        style={{fontSize: '0.7em'}}
        onClick={_ => this.setState({showNewListView: true})}
        >+ ADD NEW LIST</span>
      }
      {alert &&
        <div style={{display: 'fixed', zIndex: 100, width: '100%', height: 100, backgroundColor: 'lightgray'}} >
          <span style={{fontSize: '2em'}}>{alert}</span>
        </div>
      }
        <div style={{marginTop: 15}} >
      {
        fieldsmap && showListForm &&
          <AddContactForm
          lists={lists}
          selectedListId={selectedListId}
          fieldsmap={fieldsmap}
          onUpdateLists={list => this.setState({lists: Object.assign({}, this.state.lists, {[list.id]: list})})}
          onRefresh={this.onAfterContactSubmit}
          onAlert={this.onAlert}
          />
      }
        </div>
      </div>
    );
  }
}
