import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '@mui/material/Button'; //a prettier button


function SearchBook() {
	const { memberId } = useParams();
	return (
		<div>
			<Navbar memberId={memberId} />
			<h1 className="text-3xl font-bold mb-4">SearchBook Page</h1>
			<Link to={`/BookInfo/${memberId}`}>
				<Button variant="outlined">Go to book info</Button>
			</Link>
		
			
		</div>
	);
}

export default SearchBook;