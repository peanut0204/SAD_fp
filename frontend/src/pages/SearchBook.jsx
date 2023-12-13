import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '@mui/material/Button'; //a prettier button


function SearchBook() {
	const { memberId } = useParams();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchType, setSearchType] = useState('all');
	const [books, setBooks] = useState([]);

	const handleSearch =  async (e) => {
    const response = await fetch('http://127.0.0.1:5000/api/searchbook', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ searchType, searchTerm }),
		});
		
		const data = await response.json();
		console.log(data);
		setBooks(data);
		
  };
	return (
		<div >
			<Navbar memberId={memberId} />
			<div className="container mx-auto p-4" >
				<h1 className="text-3xl font-bold mb-4">SearchBook Page</h1>

				<div className="flex mb-4 mt-6" style={{display: 'flex', alignItems: 'center'}}>
					<select class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
						value={searchType} 
						onChange={e => setSearchType(e.target.value)}
						style={{height: '40px'}}
					>
						<option value="all">All</option>
						<option value="title">Title</option>
						<option value="author">Author</option>
					</select>
					<input
						type="text"
						style={{ height: '40px', border: '1px solid black', borderRadius: '4px', padding: '5px', marginLeft:'7px', marginRight:'20px' }}
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder="Search for a book"
					/>
					<Button variant="contained" style={{ height: '40px' }} onClick={handleSearch} >Search</Button>
				</div>

				<div>
					{books.map((book, index) => (
						<div key={index} className="p-4 m-2 border rounded">
							<Link to={`/BookInfo/${memberId}/${book.isbn}`}>
								<h2 className="text-xl font-bold mb-1">{book.title}</h2>
							</Link>
							<p>{book.author}</p>
							
						</div>
					))}
				</div>
			</div>
		
			
		</div>
	);
}

export default SearchBook;