import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

function AddBook() {
  const { memberId } = useParams();
  return (
    <div>
      <Navbar memberId={memberId} />
      <h1 className="text-3xl font-bold mb-4">Add Book Page</h1>
      
    </div>
  );
}

export default AddBook;