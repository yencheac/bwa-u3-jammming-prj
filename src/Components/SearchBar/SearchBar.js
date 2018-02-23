import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super (props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  render() {
    return(
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
              onChange={this.handleTermChange}/>
        <a>SEARCH</a>
      </div>
)}

  search(term) {
    this.props.onSearch(term);
  }

  handleTermChange(event) {
    this.search(event.target.value)
  }
}

export default SearchBar;
