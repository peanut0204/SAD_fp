import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import FavoriteBook from '../components/UserPage/FavoriteBook';
import Review from '../components/UserPage/Review';
import Following from '../components/UserPage/Following';

function UsePage() {
  const { memberId, otherId } = useParams();
  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
    <Navbar memberId={memberId} />
      <h1 className="text-3xl font-bold mb-4">User Page</h1>

      <h1 className="text-3xl font-bold mb-4">check Member_id={memberId}, Following_Mid={otherId}</h1>
      <div>
        <FavoriteBook />
      </div>
      <div>
        <Review />
      </div>
      <div>
        <Following />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">User Page end</h1>
      
    </div>
  );
}

export default UsePage;