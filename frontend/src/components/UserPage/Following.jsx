import React from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
import FollowingCard from '../MyPage/FollowingCard.jsx';
import { useParams } from 'react-router-dom'; // temp
import { useEffect, useState } from 'react';

function Following() {
  const { memberId, otherId } = useParams();

  // 需要後端的 @app.route('/api/followings/<member_id>', methods=['GET'])
  
  const [followings, setFollowings] = useState([]);
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/followings?memberId=${otherId}`)
      .then(response => response.json())
      .then(data => setFollowings(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [otherId]); 
  
  
  // 暫時先這樣搞
  /*
  const followings = [
      { id: 22, nickname: '暱稱1'}, 
      { id: 53, nickname: '暱稱2'}, 
      { id: 353, nickname: '暱稱3'}, 
      { id: 533, nickname: '暱稱4'}, 
      { id: 523, nickname: '暱稱5'}, 
      { id: 513, nickname: '暱稱6'}, 
  ];
*/
  return(
      <div style={content}>
         <h2 style={title}>追蹤清單</h2>
         <div style={divLine}/>
         <div>
           <FollowingCard followings={ followings } memberId={ memberId } />
         </div>
         
      </div>
  );
}
export default Following;
