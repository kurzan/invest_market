import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Main } from './pages/main';

import { useEffect, useState } from 'react';
import { getRequest, SHARES_MOEX_API, OFZ_MOEX_API } from './utils/api'
import { FavoriteInstrumentsContext } from './services/appContext';

function App() {
  const [marketDataShares, setMarketDataShares] = useState();
  const [marketDataOFz, setMarketDataOfz] = useState();
  const [favoriteInsruments, setFavoriteInstruments ] = useState([]);

  useEffect(() => {
    const fromLocalStorage = JSON.parse(window.localStorage.getItem('favorites'));
    setFavoriteInstruments(fromLocalStorage ? fromLocalStorage : []);
  }, []);

  useEffect(() => {
    getRequest(SHARES_MOEX_API, setMarketDataShares)
  }, []);

  useEffect(() => {
    getRequest(OFZ_MOEX_API, setMarketDataOfz)
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <FavoriteInstrumentsContext.Provider value={{ favoriteInsruments, setFavoriteInstruments }}>
            <Main shares={marketDataShares} ofz={marketDataOFz} />
          </FavoriteInstrumentsContext.Provider>
        } />
      </Routes>
    </Router>
  );
}

export default App;
