import React, { useState, useEffect, useRef, useCallback } from 'react';
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
	const [searchGoodResults, setSearchGoodResults] = useState([]);
	const [searchPlaceResults, setSearchPlaceResults] = useState([]);
	const [isSearchGoodClicked, setIsSearchGoodClicked] = useState(false);
	const [isSearchPlaceClicked, setIsSearchPlaceClicked] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [ads, setAds] = useState([]);
	const [message, setMessage] = useState('');

	const toggleSidebar = useCallback(() => {
		setSidebarOpen(!sidebarOpen);
	}, [sidebarOpen]);
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
		const response = await fetch('http://127.0.0.1:5000/api/searchGood', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ searchGood }),
		});

		const data = await response.json();
		setIsSearchGoodClicked(true);
		setIsSearchPlaceClicked(false);
		console.log(data);
		setSearchGoodResults(data);

	};

	const handleSearchPlace = async (e) => {
		const response = await fetch('http://127.0.0.1:5000/api/searchGroup', {
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

	useEffect(() => {
		const fetchAds = async () => {
			try {
				const response = await fetch('http://127.0.0.1:5000/api/getAllAds', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setAds(data);
			} catch (error) {
				console.error('Failed to fetch ads:', error);
				// Handle the error as appropriate for your application
			}
		};

		fetchAds();
	}, []);
	const handleJoinGroup = async (groupId) => {
		const response = await fetch('http://127.0.0.1:5000/api/joinGroup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ memberId, groupId }),
		});

		const data = await response.json();
		console.log(data);
		if (data.success) {
			console.log('Login successful');
			setMessage(data.message);

		}
		else {
			console.log('Login failed');
			setMessage(data.message);

		}
		//////////chen_new
		// Join successful, clear message after a delay
		setTimeout(() => {
			console.log('setMessage called')
			setMessage('');
		}, 2000); // Clear message after 2 seconds
	};


	return (
		<div style={{ margin: 0, padding: 0 }}>
			{/* <Navbar memberId={memberId} /> */}


			{/* <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}> */}
			<ThemeProvider theme={theme}>

				<div style={{ backgroundColor: theme.palette.primary.main, width: '100%', left: 0, marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
					<div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '30px' }}>
						<button onClick={toggleSidebar} style={{ position: 'absolute', left: '10px' }}>
							<HiMenu size={30} />
						</button>
						<h1 className="text-3xl font-bold mb-4" style={{ margin: '0 auto' }}>揪團 GO</h1>
					</div>
					{sidebarOpen && (
						<div ref={sidebarRef} id="navbar" style={{ position: 'fixed', left: 0, width: '200px', height: '100vh' }}>
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

				</div>
				<div>
					{/* list found food or gorups and list advertisements when no search */}
					{isSearchGoodClicked ? (
						<>
							<p>{searchGoodResults.length} goods found</p>
							{searchGoodResults.map((good, index) => (
								<div key={index} className="p-6 m-2 border rounded" style={{ width: '80%' }} >
									{good.image && <img src={`data:image/jpeg;base64,${good.image}`} alt={good.id} />}
									<Link to={`/ProductInfo/${memberId}/${good.id}`}>

										<h2 className="text-xl font-bold mb-1">{good.title}</h2>

									</Link>
									<p>{good.group}</p>
									<p>{good.groupAddress}</p>

								</div>
							))}
						</>
					) : isSearchPlaceClicked ? (
						<>
							<p>{searchPlaceResults.length} groups found</p>
							{searchPlaceResults.map((group, index) => (
								<div key={index} className="p-6 m-2 border rounded" style={{ width: '80%' }} >
									{group.image && <img src={`data:image/jpeg;base64,${group.image}`} alt={group.id} />}
									<h2 className="text-xl font-bold mb-1">{group.title}</h2>
									<p>{group.address}</p>
									<p>{group.memberAmount}</p>
									<Button variant="contained" color="secondary" style={{ height: '40px', fontSize: '15px' }} onClick={() => handleJoinGroup(group.id)} >加入</Button>
									{message && <p color='primary'>{message}</p>}

								</div>
							))}
						</>
					) : (
						// Render ads
						<>
							<p>advertisements</p>
							{ads && ads.map((ad, index) => (
								<div key={index} className="p-6 m-2 border rounded" style={{ width: '80%' }} >
									{ad.image && <img src={`data:image/jpeg;base64,${ad.image}`} alt={ad.id} />}
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