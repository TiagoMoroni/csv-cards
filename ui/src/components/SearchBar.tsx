import React from 'react';
import '../styles/styles.css';


function SearchBar({ onSearch }) {
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar">
      <input type="text" onChange={handleSearchChange} placeholder="Search..." />
    </div>
  );
}

export default SearchBar;