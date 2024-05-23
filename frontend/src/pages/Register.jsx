import Button from '@mui/material/Button'; //a prettier button
import React, { useState } from 'react';
// import NumberInputForm from '../components/NumberInputForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import coverImg from '../images/cover.png';

const theme = createTheme({
	palette: {
		primary: {
			main: '#5e3f26',
		},

	},
});

function Register() {
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
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [photo, setPhoto] = useState('');
	const [registerFailed, setRegisterFailed] = useState(false);
	const [register_err_msg, setRegister_err_msg] = useState('');
	const navigate = useNavigate();
//   const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Make API call to the backend (replace with your actual API endpoint)
		const response = await fetch('http://127.0.0.1:5000/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ account, password, name, phone}),
		});

		// Handle the response
		const data = await response.json();

		// Check if login is successful
		if (data.success) {
				console.log('Register successful');
				console.log('Login Automaticaly');
				console.log('Member ID:', data.memberId);;
				
				navigate(`/SearchFood/${data.memberId}`); 				
		} 
		else {
				setRegisterFailed(true);
				console.log(data.message);
				setRegister_err_msg(data.message);		
		}
	};

	return (

		<div style={{ backgroundColor: '#F1C010', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#5e3f26' }}>
			<ThemeProvider theme={theme}>
				{/* <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '50px', width: '60%', marginTop: '50px', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
					{/* <h1 className="text-5xl font-bold mb-20"  >Login Page</h1> */}
					{/* <NumberInputForm onSubmit={handleFormSubmit} /> */}
					{/* <pre className="mt-4">{JSON.stringify(dataframe, null, 2)}</pre> */}
					<img src={coverImg} alt="Cover" />
					<form onSubmit={handleSubmit}  >
						<div className="flex flex-col items-center gap-4">
							<h1 className="text-4xl font-bold mb-5" >Register</h1>
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
								<span className="w-20">Phone:</span>
								<input style={{ border: '1px solid black', borderRadius: '4px', padding: '5px' }}
									type="text"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</label>
							<label className="flex gap-2 self-center px-4 py-3 mt-4 text-base font-medium leading-6 text-center whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 cursor-pointer">
								
								<input
									type="file"
									className="hidden"
									accept="image/*"
									name="photo"
									value={photo}
									onChange={(e) => {
									const file = e.target.files[0];
									const reader = new FileReader();
									
									reader.onload = (event) => {
										const imageUrl = event.target.result;
										// 將預覽的圖片顯示在<img>元素中
										const imgElement = document.getElementById("previewImage");
										imgElement.src = imageUrl;
									};
									
									reader.readAsDataURL(file);
									}}
								/>
								<img
									id="previewImage"
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/40b025eb622579bbffa84f6c997d90da6968594b2e92e6bf885df4d378254fd3?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&"
									className="shrink-0 w-6 aspect-square"
									alt="預覽圖片"
								/>
								<div>匯入大頭照...</div>
							</label>

							<Button variant="contained" type="submit" style={{ marginTop: '30px', width: '120px' }}>Register</Button>
						</div>
					</form>
					{registerFailed && <p style={{ color: 'red' }}>{register_err_msg}</p>}

					<div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
						<p>Already has an account?</p>
						<Link to="/">
							<Button variant="outlined" style={{  marginLeft: '10px' }}>Go to Login</Button>
						</Link>

					</div>	


				{/* </div> */}
				{/* for test use */}
				

			</ThemeProvider>
		</div>

	);
}

export default Register;