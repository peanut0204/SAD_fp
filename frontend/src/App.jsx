
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SearchBook from './pages/SearchBook';
import BookInfo from './pages/BookInfo';
import AddBook from './pages/AddBook';
import UserPage from './pages/UserPage';
import MyPage from './pages/MyPage';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} /> 
        <Route path="/SearchBook/:memberId" element={<SearchBook />} />
        <Route path="/BookInfo/:memberId" element={<BookInfo />} />
        <Route path="/AddBook/:memberId" element={<AddBook />} />
        <Route path="/UserPage/:memberId/:otherId" element={<UserPage />} />
        <Route path="/MyPage/:memberId" element={<MyPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AdminPage/:memberId" element={<AdminPage />} />


      </Routes>
    </Router>
  );
}

export default App;