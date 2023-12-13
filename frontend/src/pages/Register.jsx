import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Register() {
	const [account, setAccount] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [nickname, setNickname] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [registerFailed, setRegisterFailed] = useState(false);
	const [register_err_msg, setRegister_err_msg] = useState('');

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Make API call to the backend (replace with your actual API endpoint)
		const response = await fetch('http://127.0.0.1:5000/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ account, password, name, nickname, gender, birthday }),
		});

		// Handle the response
		const data = await response.json();

		// Check if login is successful
		if (data.success) {
			console.log('Register successful');
			console.log('Login Automaticaly');
			console.log('Member ID:', data.memberId);;
			
			navigate(`/MyPage/${data.memberId}`); 				
		} 
		else {
			setRegisterFailed(true);
			console.log(data.message);
			setRegister_err_msg(data.message);		
		}
	};
	return (
		<div className="container mx-auto p-7">
		
			<h1 className="text-3xl font-bold mb-4">Register Page</h1>
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col">
					<label className="flex">
						<span className="w-20">Account:</span>
						<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px' }}
							type="text"
							value={account}
							onChange={(e) => setAccount(e.target.value)}
						/>
						
					</label>
					<label className="flex mt-2">
						<span className="w-20">Password:</span>
						<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px' }}
							type="text"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</label>
					<label className="flex mt-2">
						<span className="w-20">Name:</span>
						<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px' }}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>
					<label className="flex mt-2">
						<span className="w-20">Nickname:</span>
						<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px' }}
							type="text"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
						/>
					</label>
					<label className="flex mt-2">
						<span className="w-20">Gender:</span>
						<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px'}}
							type="text"
							value={gender}
							onChange={(e) => setGender(e.target.value)}
						/>
					</label>
					<label className="flex mt-2">
						<span className="w-20">Birthday:</span>
						<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px' }}
							type="text"
							value={birthday}
							onChange={(e) => setBirthday(e.target.value)}
						/>
					</label>
				</div>
				<Button variant="contained" type="submit" style={{ marginTop: '10px' }}>Register</Button>
			</form>
			{registerFailed && <p style={{ color: 'red' }}>{register_err_msg}</p>}

			<div style={{ display: 'flex', alignItems: 'center' }}>
				<p>Already has an account?</p>
				<Link to="/">
					<Button variant="outlined" style={{ marginTop: '10px', marginLeft: '10px' }}>Go to Login</Button>
				</Link>

			</div>
			
			
		</div>
	);
}

export default Register;