import Button from '@mui/material/Button'; //a prettier button
import React, { useState } from 'react';
// import NumberInputForm from '../components/NumberInputForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e3f26',
    },

  },
});

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
  const [message, setMessage] = useState('');

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
      setMessage(data.message);

    }


  };



  return (

    <div style={{ backgroundColor: '#F1C010', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#5e3f26' }}>
      <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '50px', width: '60%', marginTop: '50px', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="text-5xl font-bold mb-20"  >Login Page</h1>
          {/* <NumberInputForm onSubmit={handleFormSubmit} /> */}
          {/* <pre className="mt-4">{JSON.stringify(dataframe, null, 2)}</pre> */}
          <form onSubmit={handleSubmit}  >
            <div className="flex flex-col items-center gap-4">
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

              <Button variant="contained" type="submit" style={{ marginTop: '30px', width: '120px' }}>Login</Button>
            </div>
          </form>
          {message && <p style={{ color: 'red' }}>{message}</p>}

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
            <p>No account?</p>
            <Link to="/Register">
              <Button variant="outlined" style={{ marginTop: '10px', marginLeft: '10px' }}>Go to Register</Button>
            </Link>
          </div>


        </div>
        {/* for test use */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', backgroundColor: 'white', padding: '20px' }}>
          <p>(For test use)</p>
          <Link to={`/SearchFood/1`}>
            <Button variant="outlined" >Go to Home Page</Button>
          </Link>
        </div>

      </ThemeProvider>
    </div>

  );
}

export default Login;