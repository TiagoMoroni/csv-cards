import React from 'react';
import '../styles/styles.css';
import { FaBuilding, FaGlobe, FaFutbol } from 'react-icons/fa';

interface User {
  name: string;
  city: string;
  country: string;
  favoriteSport: string;
}

function Card({ data }: { data: User }) {
  const { name, city, country, favoriteSport } = data;

  return (
    <div className="card">
      <div className='card-title'>
        <p className="card-text">{name}</p>
      </div>
      <div className="card-content">
        <div className='icon-text-card'>
          <div className="icon">
            <FaBuilding />
          </div>
          <p className="card-text">{city}</p>
        </div>
        <div className='icon-text-card'>
          <div className="icon">
            <FaGlobe />
          </div>
          <p className="card-text">{country}</p>
        </div>
        <div className='icon-text-card'>
          <div className="icon">
            <FaFutbol />
          </div>
          <p className="card-text">{favoriteSport}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
