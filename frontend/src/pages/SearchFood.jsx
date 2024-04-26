import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/Sidebar';
import Button from '@mui/material/Button'; //a prettier button
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e3f26',
    },

  },
});

function SearchFood() {
	const { memberId } = useParams();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchType, setSearchType] = useState('all');
	const [books, setBooks] = useState([]);
	const [isSearchClicked, setIsSearchClicked] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};
	const handleSearch =  async (e) => {
    const response = await fetch('http://127.0.0.1:5000/api/searchfood', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ searchType, searchTerm }),
		});
		
		const data = await response.json();
		setIsSearchClicked(true);
		console.log(data);
		setBooks(data);
		
  };

	return (
		<div >
			{/* <Navbar memberId={memberId} /> */}
			<button onClick={toggleSidebar}>Toggle Sidebar</button>
			{sidebarOpen && (
			<div style={{ position: 'fixed', ledt: 0, width: '200px', height: '100vh', backgroundColor: '#333' }}>
				<Navbar memberId={memberId} />
			</div>
			)}
			<div classname="p-10" style={{ backgroundColor: 'saddlebrown', minHeight: '100vh' , display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#5e3f26' }}>
			<ThemeProvider theme={theme}>   
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '50px', width: '90%', marginTop: '50px', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h1 className="text-5xl font-bold mb-4">Search Book Page</h1>

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

				
				{isSearchClicked && <p>{books.length} books found</p>}
					{books.map((book, index) => (
						<div key={index} className="p-6 m-2 border rounded" style={{width: '80%'}} >
							<Link to={`/BookInfo/${memberId}/${book.isbn}`}>
								<h2 className="text-xl font-bold mb-1">{book.title}</h2>
							</Link>
							<p>{book.author}</p>
							
						</div>
					))}
				
			</div>
			
			   
    	</ThemeProvider>			
			</div> 
		</div>
	);
}

export default SearchFood;