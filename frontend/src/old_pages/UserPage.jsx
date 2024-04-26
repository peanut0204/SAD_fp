import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import UserInfo from '../components/UserPage/UserInfo';
import Follow from '../components/UserPage/Follow';
import FavoriteBook from '../components/UserPage/FavoriteBook';
import Review from '../components/UserPage/Review';
import Following from '../components/UserPage/Following';

function UserPage() {
  const { memberId, otherId } = useParams();
  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
    <Navbar memberId={memberId} />
      <div>
        <UserInfo />
      </div>
      <div>
        <Follow />
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

export default UserPage;