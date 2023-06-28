import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './styles/styles.css';
import './styles/loading.css';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import SearchBar from './components/SearchBar';

interface User {
  name: string;
  city: string;
  country: string;
  favoriteSport: string;
}

interface SearchResponse {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

function App() {
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCSVUpload = (data: any) => {
    setLoading(data.loading);
    handleSearch("")
  };

  const sendErrorMessage = (error: string) => {
    setErrorMessage(error)
    setTimeout(() =>
      setErrorMessage(null)
      , 5000)
  }

  const handleSearch = (searchTerm: string) => {
    setLoading(true);
    setErrorMessage(null);
    axios.get<SearchResponse[]>('http://localhost:3000/api/users', { params: { q: searchTerm } })
      .then((response) => {
        setLoading(false);
        setFilteredData(response.data.map((el: SearchResponse) => {
          return {
            name: el.name,
            city: el.city,
            country: el.country,
            favoriteSport: el.favorite_sport,
          }
        }));
      })
      .catch((error) => {
        setLoading(false);
        sendErrorMessage(error);
      });
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="App">
      {loading &&
        <>
          <div className="loading"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
        </>
      }
      <div className={`error-message ${errorMessage ? '' : 'hidden'}`}>
        {errorMessage}
      </div>
      <div className='main-container'>
        <header className='header-container'>
          <div className='title'>CSV Loader 📁</div>
          <div className="header-second-lane">
            <SearchBar onSearch={handleSearch} />
            <FileUploader onUpload={handleCSVUpload} onError={sendErrorMessage} />
          </div>
        </header>
        <div className="card-container">
          {filteredData.length > 0 ? (
            filteredData.map((rowData, index) => (
              <Card key={index} data={rowData} />
            ))
          ) : (
            <div className='no-data-div'>
              No data found or no file loaded ❌
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;