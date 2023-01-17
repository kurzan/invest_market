import React from 'react';
import './App.css';

import { useEffect, useState } from 'react';
import { getRequest, SHARES_MOEX_API } from './utils/api';

import { Instruments } from './components/instruments/instruments';


function App() {
  const [marketData, setMarketData] = useState();

  useEffect(() => {
    getRequest(SHARES_MOEX_API, setMarketData)
  }, []);


  return (
    <div className="App">
      { marketData && <Instruments data={marketData} />} 
    </div>
  );
}

export default App;
