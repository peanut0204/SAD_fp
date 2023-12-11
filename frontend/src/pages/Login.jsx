import Button from '@mui/material/Button'; //a prettier button
import React, { useState } from 'react';
// import NumberInputForm from '../components/NumberInputForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Login() {
	// // This is a example for example API
	// const [dataframe, setDataframe] = useState([]);
	// const handleFormSubmit = async (formData) => {
	//   const response = await fetch('http://127.0.0.1:5000/api/generate_dataframe', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify(formData),
	//   });
  
	//   const result = await response.json();
	//   setDataframe(result);
	const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Make API call to the backend (replace with your actual API endpoint)
		const response = await fetch('http://127.0.0.1:5000/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ account, password }),
		});

		// Handle the response
		const data = await response.json();

		// Check if login is successful
		if (data.success) {
			console.log('Login successful');
			console.log('Member ID:', data.memberId);
			console.log('Identity:', data.identity);
			if (data.identity === 'Admin') {
				navigate(`/AdminPage/${data.memberId}`); 
			} else {
				navigate(`/MyPage/${data.memberId}`); 	
			}
		} 
		else {
			console.log('Login failed');
			// Handle unsuccessful login (show error message, etc.)
		}

      
  };

	
  
	return (
	  <div className="container mx-auto p-7">
			
			<h1 className="text-3xl font-bold mb-4">Login Page</h1>
			{/* <NumberInputForm onSubmit={handleFormSubmit} /> */}
			{/* <pre className="mt-4">{JSON.stringify(dataframe, null, 2)}</pre> */}
			<form onSubmit={handleSubmit}>
				<label>
					Account:
					<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px', marginLeft:'5px' }}
						type="text"
						value={account}
						onChange={(e) => setAccount(e.target.value)}
					/>
					
				</label>
				<br />
				<label >
					Password:
					<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px', marginLeft:'5px', marginTop: '10px' }}
						type="text"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<br />
				<Button variant="contained" type="submit" style={{ marginTop: '10px' }}>Submit</Button>
			</form>

			<Link to={`/SearchBook/1`}> {/* for test use */}
				<Button variant="outlined" style={{ marginTop: '10px' }}>Go to Search Book</Button>
			</Link>
			<p>No account?</p>
			<Link to="/Register">
				<Button variant="contained" style={{ marginTop: '10px' }}>Register</Button>
			</Link>
			
		
	  </div>
	);
}

export default Login;