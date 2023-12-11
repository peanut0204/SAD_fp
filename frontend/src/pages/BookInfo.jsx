import React from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; //a prettier button


function BookInfo() {
	const { memberId } = useParams();
	const otherId =1; //to be changed to other user's id
	
  return (
    <div>
			<Navbar memberId={memberId} /> 
			<h1 className="text-3xl font-bold mb-4">BookInfo Page</h1>
			<Link to={`/UserPage/${memberId}/${otherId}`}>
				<Button variant="outlined">Go to other user's page</Button>
			</Link>

      
    </div>
  );
}

export default BookInfo;