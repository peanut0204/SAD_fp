import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import MyInfo from '../components/MyPage/MyInfo';
import FavoriteBook from '../components/MyPage/FavoriteBook';
import Review from '../components/MyPage/Review';
import Following from '../components/MyPage/Following';
//import { title, content } from "../css/MyPage.js";
//import {content} from '../css/MyPage.js';
function MyPage() {
  const { memberId } = useParams();
  return (
    <div style={{ backgroundColor: 'saddlebrown' }}>
      <Navbar memberId={memberId} />
      <br /><br />
      <h1 className="text-5xl font-bold mb-4 text-center" style={{ color: 'white' }}>My Page</h1>

      <div>
        <MyInfo />
      </div>
      <div>
        <FavoriteBook />
      </div>
      <div>
        <Review />
      </div>
      <div>
        <Following />
      </div>

      <br /><br />
    </div>
  );
}

export default MyPage;