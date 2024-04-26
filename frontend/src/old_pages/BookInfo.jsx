import React from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; //a prettier button
import Book from '../components/BookInfo/Book';
import BookRating from '../components/BookInfo/BookRating';
import Favorite from '../components/BookInfo/Favorite';
import MyReview from '../components/BookInfo/MyReview';
import BookReview from '../components/BookInfo/BookReview';


function BookInfo() {
	const { memberId, ISBN } = useParams();
	const otherId =1; //to be changed to other user's id
	
  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
			<Navbar memberId={memberId} />
			<br /><br />
			<h1 className="text-5xl font-bold mb-4 text-center" style={{ color: 'white' }}>BookInfo Page</h1>

			<div>
				<Book />
			</div>
			<div>
				<BookRating />
			</div>
			<div>
				<Favorite />
			</div>
			<div>
				<MyReview />
			</div>
			<div>
				<BookReview />
			</div>

			<br /><br />
    </div>
  );
}

export default BookInfo;