import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shares } from './pages/shares';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shares />} />
      </Routes>
    </Router>
  );
}

export default App;
