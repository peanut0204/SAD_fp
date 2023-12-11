
import React, { useState } from 'react';
import NumberInputForm from '../components/NumberInputForm';
import { Link } from 'react-router-dom';

function Login() {
	const [dataframe, setDataframe] = useState([]);

	const handleFormSubmit = async (formData) => {
	  const response = await fetch('http://127.0.0.1:5000/api/generate_dataframe', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	  });
  
	  const result = await response.json();
	  setDataframe(result);
	};
  
	return (
	  <div className="container mx-auto p-7">
		<h1 className="text-3xl font-bold mb-4">Login Page</h1>
		<NumberInputForm onSubmit={handleFormSubmit} />
		{/* Display the DataFrame in the frontend */}
		<pre className="mt-4">{JSON.stringify(dataframe, null, 2)}</pre>
		<Link to="/SearchBook">
      <button>Go to Search Book</button>
    </Link>
		
		
	  </div>
	);
}

export default Login;