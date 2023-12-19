import React, {useState, useEffect} from 'react';
import {title, content, divLine} from '../../css/MyPage.js';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';


function MyInfo() {
  const { memberId } = useParams();

  // 需要後端的 @app.route('/api/myInfo/<member_id>', methods=['GET'])
  
  const [myInfo, setMyInfo] = useState({
    account: '測試用帳號', name: '名字', nickname: '暱稱', gender: '性別', birthday: '生日', role:'User', 
  });
  
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/myInfo/${memberId}`) // call API
      .then(response => response.json()) // get result
      .then(data => setMyInfo(data))
      .catch(error => console.error('Error fetching followings:', error));
  }, [memberId]);

  const isAdmin = myInfo.role === 'Admin';

  return(
    <div style={content}>
      <h2 style={title}>「{myInfo.nickname}」的個人資訊</h2>
      <div style={divLine}/>
      <div style={{ textAlign: 'center' }}>
        <p><b>帳號｜</b>{myInfo.account}</p>
        <p><b>姓名｜</b>{myInfo.name}</p>
        <p><b>性別｜</b>{myInfo.gender}</p>
        <p><b>生日｜</b>{myInfo.birthday}</p>
        {isAdmin && (
          <div>
            <br />
            <b>我是管理員｜</b>
            <Link to={`/AdminPage/${memberId}`}>
              <Button size="small" variant="contained">通往管理員頁面</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default MyInfo;
