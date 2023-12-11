import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

function MyPage() {
  const { memberId } = useParams();
  return (
    <div>
      <Navbar memberId={memberId} />
      <h1 className="text-3xl font-bold mb-4">My Page</h1>
      
    </div>
  );
}

export default MyPage;