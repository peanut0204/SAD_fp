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
		<div>
			<Navbar memberId={memberId} />

			<h1 className="text-3xl font-bold mb-4">SearchBook Page</h1>

			<div className="flex mb-4">
				<select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
					value={searchType} 
					onChange={e => setSearchType(e.target.value)}
				>
					<option value="all">All</option>
					<option value="title">Title</option>
					<option value="author">Author</option>
				</select>
				<input
					type="text"
					style={{ border: '1px solid black', borderRadius: '4px', padding: '5px', marginLeft:'5px', marginRight:'10px', marginTop: '10px' }}
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder="Search for a book"
				/>
				<Button variant="contained" onClick={handleSearch}>Search</Button>
			</div>

			<Link to={`/BookInfo/${memberId}`}>
				<Button variant="outlined">Go to book info</Button>
			</Link>
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
	);
}

export default SearchBook;