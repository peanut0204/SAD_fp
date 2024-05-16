import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';
import Button from '@mui/material/Button';

function MyGroup() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [communities, setCommunities] = useState([]); // Stores all communities
  const [displayedCommunities, setDisplayedCommunities] = useState([]); // Communities to be displayed
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getJoinedGroups/${memberId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCommunities(data);
        setDisplayedCommunities(data);  // Display all communities by default
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchData();
  }, [memberId]);

  const handleSearch = () => {
    if (!searchQuery) {
      setDisplayedCommunities(communities); // If search query is empty, show all communities
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filteredData = communities.filter(community =>
        community.title.toLowerCase().includes(lowercasedQuery) ||
        community.group_location.toLowerCase().includes(lowercasedQuery)
      );
      setDisplayedCommunities(filteredData);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const goToGroupRoom = (groupId) => {
    navigate(`/GroupRoom/${memberId}/${groupId}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white' }}>
      <div style={{ width: '100%', height: 186, paddingTop: 15, paddingLeft: 14, paddingRight: 14, position: 'fixed', top: 0, left: 0, background: '#F1C010', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 14, top: 130, width: 24, height: 25 }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'black', fontSize: 28, fontFamily: '"Microsoft JhengHei", "Segoe UI", sans-serif', fontWeight: 'bold', textAlign: 'center' }}>
            揪團 GO
          </div>
          <div style={{ display: 'flex', width: '85%', marginTop: 10 }}>
            <input
              type="text"
              placeholder="以名稱或地址搜尋社群"
              style={{
                flexGrow: 1,
                padding: '10px',
                backgroundColor: '#F0F0F0',
                borderRadius: '15px 15px 15px 15px',  // Rounded corners on the left side of the input
                border: 'none',
                marginRight: '5px'  // Creates a gap between the input and the button
              }}
              value={searchQuery}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              style={{
                borderRadius: '15px 15px 15px 15px',  // Rounded corners on the right side of the button
                height: '50px',
                fontSize: '15px',
                boxShadow: 'none',  // Optionally remove box-shadow if desired
                backgroundColor: '#000000', // Sets the button color to black
                color: '#FFFFFF', // Sets the text color to white for better readability
              }}
              onClick={handleSearch}
            >
              搜尋
            </Button>
          </div>
        </div>

      </div>
      <div style={{ marginTop: 200, padding: '0 14px' }}>
        <h2 style={{ marginBottom: 20, fontSize: 20 }}><b>我加入的社群</b></h2>
        {displayedCommunities.map(community => (
          <div className='box' key={community.group_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
            <img src={community.image || defaultImageUrl} alt={community.title} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: '10px', objectPosition: 'center top' }} onClick={() => goToGroupRoom(community.group_id)} />
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontWeight: 'bold', marginTop: 10 }}>{community.title}</h3>
              <p>位置：{community.group_location}</p>
              <p>人數：{community.memberAmount}人</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyGroup;
