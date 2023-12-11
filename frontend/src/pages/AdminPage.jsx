import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; //a prettier button


function AdminPage() {
	const { memberId } = useParams();
	console.log(memberId);
  return (
	<div>
	
	  <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
		<Link to={`/SearchBook/${memberId}`}>
			<Button variant="outlined" style={{ marginTop: '10px' }}>Go to Search Book</Button>
		</Link>
	  
	</div>
  );
}

export default AdminPage;