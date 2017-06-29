import React, { Component } from 'react';
import Select from 'react-select';
import {normalize, schema} from 'normalizr';
import 'react-select/dist/react-select.css';
import {listObj} from './data';

const listSchema = new schema.Entity('lists');
const listListSchema = [listSchema];
const mockLists = _ => Promise.resolve(listObj);

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listIds: [],
      lists: {},
      selectedListId: undefined,
      fieldsmap: undefined
    };
    this.onListChange = this.onListChange.bind(this);
  }

  componentWillMount() {
    mockLists()
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
      selectedListId: list.id,
      fieldsmap: list.fieldsmap.filter(field => !field.readonly)
    });
  }

  render() {
    const {lists, listIds, selectedListId, fieldsmap} = this.state;
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
      {
        fieldsmap && fieldsmap.filter(field => !field.hidden).map(field =>
          <div>
            <label>{field.name}</label>
            <input ref={field.value} type='text' />
          </div>
          )
      }

      </div>
    );
  }
}
