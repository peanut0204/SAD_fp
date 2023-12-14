import React from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; //a prettier button
import Book from '../components/BookInfo/Book';
import MyReview from '../components/BookInfo/MyReview';
import BookReview from '../components/BookInfo/BookReview';


function BookInfo() {
	const { memberId, ISBN } = useParams();
	const otherId =1; //to be changed to other user's id
	
  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
			<Navbar memberId={memberId} /> 
			<h1 className="text-3xl font-bold mb-4">BookInfo Page</h1>
			<Link to={`/UserPage/${memberId}/${otherId}`}>
				<Button variant="outlined">Go to other user's page</Button>
			</Link>

			<h1 className="text-3xl font-bold mb-4">check Member_id = {memberId}, ISBN = {ISBN} </h1>

			<div>
				<Book />
			</div>
			<div>
				<MyReview />
			</div>
			<div>
				<BookReview />
			</div>


			<h1 className="text-3xl font-bold mb-4">BookInfo Page End</h1>

      
    </div>
  );
}

export default BookInfo;