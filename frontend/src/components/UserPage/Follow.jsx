import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
//import { useParams } from 'react-router-dom'; // temp
import { useParams } from 'react-router-dom';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

function Follow() {
  const { memberId, otherId } = useParams();  

  const [follow, setFollow] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 呼叫API
        const response = await fetch(`http://127.0.0.1:5000/api/follow/${memberId}/${otherId}`);
        const data = await response.json();

        // 根據API的回應設定follow狀態
        setFollow(data.found ? true : false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [memberId, otherId]);

  const handleFollowClick = async () => {
    try {
      if (follow) {
        // 如果 follow 存在，則呼叫 API 刪除 follow 資料
        const response = await fetch(`http://127.0.0.1:5000/api/follow/${memberId}/${otherId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // 更新前端的 follow 狀態
          setFollow(false);
        } else {
          console.error('Failed to delete follow:', response.statusText);
        }
      } else {
        // 如果 follow 不存在，則呼叫 API 新增 follow 資料
        const response = await fetch(`http://127.0.0.1:5000/api/follow/${memberId}/${otherId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memberId, otherId }),
        });
  
        if (response.ok) {
          // 更新前端的follow狀態
          setFollow(true);
        } else {
          console.error('Failed to add follow:', response.statusText);
        }    
      }
    } catch (error) {
      console.error('Error handling follow click:', error);
    }
  };
  
  return(
    <div style={content}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={title}>追蹤狀態</h2>
        <div style={divLine}/>
        
        <IconButton onClick={handleFollowClick} color={follow ? 'error' : 'default'}>
          {follow ? <PersonAddAlt1Icon /> : <PersonAddAltIcon />}
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {follow ? '已追蹤' : '加入追蹤'}
        </Typography>
        
      </div>
    </div>
  );
}
export default Follow;
