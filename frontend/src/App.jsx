
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SearchFood from './pages/SearchFood';
import Notifications from './pages/Notifications';
import MyGroup from './pages/MyGroup';
import BuildGroup from './pages/BuildGroup';
import SellerOffice from './pages/SellerOffice';
import ProductInfo from './pages/ProductInfo';
import SellerInfo from './pages/SellerInfo';
import ChatRoom from './pages/ChatRoom';
import ConfirmOrder from './pages/ConfirmOrder';
import GroupRoom from './pages/GroupRoom';
import AddProduct from './pages/AddProduct';
import SellerSearchGroup from './pages/SellerSearchGroup';
import MyOrder from './pages/MyOrder';
import SellerChats from './pages/SellerChats';
import OrderState from './pages/OrderState';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} /> 
        <Route path="/SearchFood/:memberId" element={<SearchFood />} />
        <Route path="/Notifications/:memberId" element={<Notifications />} />
        <Route path="/MyGroup/:memberId" element={<MyGroup />} />
        <Route path="/BuildGroup/:memberId" element={<BuildGroup />} />
        <Route path="/SellerOffice/:memberId" element={<SellerOffice />} />
        <Route path="/ProductInfo/:memberId/:productId" element={<ProductInfo />} />
        <Route path="/SellerInfo/:memberId/:otherId" element={<SellerInfo />} />
        <Route path="/ChatRoom/:memberId/:otherId" element={<ChatRoom />} />
        <Route path="/ConfirmOrder/:memberId" element={<ConfirmOrder />} />
        <Route path="/GroupRoom/:memberId/:groupId" element={<GroupRoom />} />
        <Route path="/AddProduct/:memberId" element={<AddProduct />} />
        <Route path="/SellerSearchGroup/:memberId" element={<SellerSearchGroup />} />
        <Route path="/MyOrder/:memberId" element={<MyOrder />} />
        <Route path="/SellerChats/:memberId" element={<SellerChats />} />
        <Route path="/OrderState/:memberId" element={<OrderState />} />
        
        

        {/* <Route path="/BookInfo/:memberId/:ISBN" element={<BookInfo />} />
        <Route path="/AddBook/:memberId" element={<AddBook />} />
        <Route path="/UserPage/:memberId/:otherId" element={<UserPage />} />
        <Route path="/MyPage/:memberId" element={<MyPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AdminPage/:memberId" element={<AdminPage />} /> */}




      </Routes>
    </Router>
  );
}

export default App;