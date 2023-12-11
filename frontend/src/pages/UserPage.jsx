import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

function UsePage() {
  const { memberId } = useParams();
  return (
    <div>
    <Navbar memberId={memberId} />
      <h1 className="text-3xl font-bold mb-4">User Page</h1>
      
    </div>
  );
}

export default UsePage;