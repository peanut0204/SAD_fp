import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

function Notifications() {
  const navigate = useNavigate();
  const { memberId } = useParams();

  const [notifications, setNotifications] = useState([]);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getLogisticInfo/${memberId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // 打印返回的数据，检查数据结构
        console.log("API Response Data:", data);

        // // 只保留 logistic_status 为 "已通知" 的通知
        // const filteredNotifications = data.filter(item => {
        //   console.log("Item logistic_status:", item.logistic_status); // 打印每个item的logistic_status
        //   return item.logistic_status === '已通知';
        // });

        setNotifications(data);
        console.log("Filtered Notifications:", notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchData();
  }, [memberId]);

  const NotificationItem = ({ goods_name, group_name }) => (
    <div style={{
      borderBottom: '1px solid #ddd',
      padding: '10px 20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      margin: '10px 0', // 左右边距为0，上下边距为10px
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <small>您在 <b>{group_name}</b> 購買的</small>
      <p><b>{goods_name}</b> 已送達指定團購地點🚚</p>
    </div>
  );

  return (
    <div className="notifications-container" style={{ width: '100%', maxWidth: 393, height: 850, position: 'relative', background: 'white' }}>
      <div className="header" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 100, background: '#F1C010', padding: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
        <div onClick={goBack} style={{ position: 'absolute', left: 20, bottom: 20 }}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ color: 'black', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', left: 40 }}>📢你的通知</div>
      </div>
      <div style={{ paddingTop: 100, paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}>
        {notifications.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
            color: 'grey',
            fontSize: '18px'
          }}>
            目前沒有通知
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem key={notification.id} {...notification} />
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
