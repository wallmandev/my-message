import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import App from './App'; // Din komponent som visar meddelandelistan
import './index.css'; // Din CSS-fil

// Skapar en root med React 18 API
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
