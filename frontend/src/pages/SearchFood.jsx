import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
// import LeftSideBar from '../components/Sidebar';
import Button from '@mui/material/Button'; //a prettier button
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HiMenu } from "react-icons/hi";

const theme = createTheme({
	palette: {
		primary: {
			main: '#F1C010', //yellow
		},
		secondary: {
			main: '#000000', //black
		},

	},
});

function SearchFood() {
	const { memberId } = useParams();
	// const [searchTerm, setSearchTerm] = useState('');
	const [searchGood, setSearchGood] = useState('');
	const [searchPlace, setSearchPlace] = useState('');
	// const [searchType, setSearchType] = useState('all');
	// const [searchResults, setSearchResults] = useState([]);
	const [setSearchGoodResults] = useState([]);
	const [setSearchPlaceResults] = useState([]);
	const [isSearchGoodClicked, setIsSearchGoodClicked] = useState(false);
	const [isSearchPlaceClicked, setIsSearchPlaceClicked] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};
	const sidebarRef = useRef();

	useEffect(() => {
		function handleClickOutside(event) {
			if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				toggleSidebar();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
		document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [sidebarOpen, toggleSidebar]);
	
	const handleSearchGood = async (e) => {
		const response = await fetch('http://127.0.0.1:5000/api/searchfood', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ setSearchGood }),
		});

		const data = await response.json();
		setIsSearchGoodClicked(true);
		setIsSearchPlaceClicked(false);
		console.log(data);
		setSearchGoodResults(data);

	};

	const handleSearchPlace = async (e) => {
		const response = await fetch('http://127.0.0.1:5000/api/searchplace', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ searchPlace }),
		});

		const data = await response.json();
		setIsSearchPlaceClicked(true);
		setIsSearchGoodClicked(false);
		console.log(data);
		setSearchPlaceResults(data);

	};
	

	return (
		<div style={{ margin: 0, padding: 0 }}>
			{/* <Navbar memberId={memberId} /> */}
			

			{/* <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}> */}
				<ThemeProvider theme={theme}>
					
					<div style={{ backgroundColor: theme.palette.primary.main, width: '100%', left: 0, marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '30px' }}>
							<button onClick={toggleSidebar} style={{ position: 'absolute', left: '10px' }}>
								<HiMenu  size={30} />
							</button>
							<h1 className="text-3xl font-bold mb-4" style={{ margin: '0 auto' }}>揪團 GO</h1>
						</div>
						{sidebarOpen && (
							<div ref={sidebarRef} id="navbar" style={{ position: 'fixed', left: 0, width: '200px', height: '100vh'}}>
								<Navbar memberId={memberId} />
							</div>
						)}
					

						<div className="flex mb-4 mt-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
							
							<input
								type="text"
								style={{ height: '40px', borderRadius: '5px', padding: '5px', marginLeft: '7px', marginRight: '20px' }}
								value={searchGood}
								onChange={e => setSearchGood(e.target.value)}
								placeholder="以團購物品搜尋"
							/>
							<Button variant="contained" color="secondary" style={{ height: '40px', fontSize: '15px' }} onClick={handleSearchGood} >搜尋</Button>
							
						</div>
						<div className="flex mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
							
							<input
								type="text"
								style={{ height: '40px', borderRadius: '5px', padding: '5px', marginLeft: '7px', marginRight: '20px' }}
								value={searchPlace}
								onChange={e => setSearchPlace(e.target.value)}
								placeholder="以地點搜尋"
							/>
							<Button variant="contained" color="secondary" style={{ height: '40px', fontSize: '15px' }} onClick={handleSearchPlace} >搜尋</Button>
							
						</div>

						


						{/* list found food or gorups and list advertisements when no search */}
						{isSearchGoodClicked ? (
							<>
								<p>{searchGood.length} goods found</p>
								{searchGood.map((good, index) => (
								<div key={index} className="p-6 m-2 border rounded" style={{ width: '80%' }} >
									{good.image && <img src={`data:image/jpeg;base64,${good.image}`} alt={good.id} />}
									<Link to={`/GoodInfo/${memberId}/${good.id}`}>
									
									<h2 className="text-xl font-bold mb-1">{good.title}</h2>
									
									</Link>
									<p>{good.group}</p>
									<p>{good.groupAddress}</p>
								</div>
								))}
							</>
							) : isSearchPlaceClicked ? (
							<>
								<p>{searchPlace.length} groups found</p>
								{searchPlace.map((group, index) => (
								<div key={index} className="p-6 m-2 border rounded" style={{ width: '80%' }} >
									
									<h2 className="text-xl font-bold mb-1">{group.title}</h2>
									<p>{group.address}</p>
									<p>{group.memberAmount}</p>
									
								</div>
								))}
							</>
							) : (
							// Render ads
							<>
								<p>advertisements</p>
								{ads.map((ad, index) => (
								<div key={index} className="p-6 m-2 border rounded" style={{ width: '80%' }} >
									<Link to={`/AdInfo/${memberId}/${ad.isbn}`}>
									<h2 className="text-xl font-bold mb-1">{ad.title}</h2>
									</Link>
									<p>{ad.author}</p>
								</div>
								))}
							</>
							)}

					</div>


				</ThemeProvider>
			{/* </div> */}
		</div>
	);
}

export default SearchFood;