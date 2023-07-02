import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { keycloak, initialized } = useKeycloak();
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/Search/${searchQuery}`);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (initialized) {
      keycloak.loadUserProfile().then((profile) => {
        setName(profile.username);
      });
    }
  }, [initialized]);

  return (
    <div className="nav">
      <h1 className='navi-logo'>Rybki forum</h1>
      <div className="search-bar">
        <input
          className='search-input'
          type="text"
          placeholder="Wyszukaj posty..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className='search-button' onClick={handleSearch}>Szukaj</button>
      </div>
      <button className='header-button' onClick={() => keycloak.logout()}>Wyloguj</button>
      <button className="header-button">
        <Link className='link-account-details' to="/AccountDetails">{name}</Link>
      </button>
    </div>
  );
}
