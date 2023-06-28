import React from 'react';
import '../styles/search-bar.css';


function SearchBar({ onSearch }) {
  const handleSearchChange = (event) => {
    const input = document.querySelector('#search')
    const searchTerm = input?.value;
    onSearch(searchTerm);
  };

  const handleEmptySearch = (event) => {
    if(event.target.value == ""){
      onSearch("");
    }
  }

  return (
      <div className='search-form' role="search">
        <label htmlFor="search">Search for stuff</label>
        <input id="search" type="search" onChange={handleEmptySearch} placeholder="Search..." autoFocus/>
        <button onClick={handleSearchChange}>Go</button>
      </div>
  );
}

export default SearchBar;