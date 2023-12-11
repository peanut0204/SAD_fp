// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SearchBook from './pages/SearchBook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} /> 
        <Route path="/SearchBook" element={<SearchBook />} />
      </Routes>
    </Router>
  );
}

export default App;