import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';
import {title, content, divLine} from '../../css/MyPage.js';
//import { useParams } from 'react-router-dom'; // temp
import { useParams } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

function FavoriteBook() {
  const { memberId, ISBN } = useParams();  
  
  const [favorite, setFavorite] = useState();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 呼叫API
        const response = await fetch(`http://127.0.0.1:5000/api/favorite/${memberId}/${ISBN}`);
        const data = await response.json();

        // 根據API的回應設定favorite狀態
        setFavorite(data.found ? true : false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [memberId, ISBN]);

  const handleFavoriteClick = async () => {
    try {
      if (favorite) {
        // 如果 favorite 存在，則呼叫 API 刪除 favorite 資料
        const response = await fetch(`http://127.0.0.1:5000/api/favorite/${memberId}/${ISBN}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // 更新前端的 favorite 狀態
          setFavorite(false);
        } else {
          console.error('Failed to delete favorite:', response.statusText);
        }
      } else {
        // 如果 favorite 不存在，則呼叫 API 新增 favorite 資料
        const response = await fetch(`http://127.0.0.1:5000/api/favorite/${memberId}/${ISBN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memberId, ISBN }),
        });
  
        if (response.ok) {
          // 更新前端的favorite狀態
          setFavorite(true);
        } else {
          console.error('Failed to add favorite:', response.statusText);
        }    
      }
    } catch (error) {
      console.error('Error handling favorite click:', error);
    }
  };
  
  return(
    <div style={content}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={title}>我的最愛</h2>
        <div style={divLine}/>
        
        <IconButton onClick={handleFavoriteClick} color={favorite ? 'error' : 'default'}>
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {favorite ? '已加入我的最愛' : '加入我的最愛'}
        </Typography>
        
      </div>
    </div>
  );
}
export default FavoriteBook;
