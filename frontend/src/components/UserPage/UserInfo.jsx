import React, {useState, useEffect} from 'react';
import {title, content, divLine} from '../../css/MyPage.js';
import { useParams } from 'react-router-dom';


function UserInfo() {
  const { memberId, otherId } = useParams();

  // 需要後端的 @app.route('/api/userInfo/<other_id>', methods=['GET'])
  
  const [userInfo, setUserInfo] = useState({nickname: '測試用帳號'});
  
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/userInfo/${otherId}`) // call API
      .then(response => response.json()) // get result
      .then(data => setUserInfo(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [otherId]);

  return(
    <div>
      <br /><br />
      <h1 className="text-5xl font-bold mb-4 text-center" style={{color: 'white'}}>{userInfo.nickname}'s Page</h1>
    </div>
  );
}
export default UserInfo;
