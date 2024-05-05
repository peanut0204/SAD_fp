import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const notifications = {
    arrival: [
      { id: 1, message: "你的包裹已到達", time: "2024-05-01 09:00" },
      { id: 2, message: "新貨已上架", time: "2024-05-02 10:00" },
      { id: 3, message: "限時特賣開始了", time: "2024-05-02 12:00" }
    ],
    social: [
      { id: 1, message: "你有新的朋友請求", time: "2024-05-03 11:00" },
      { id: 2, message: "你被標記在一張照片上", time: "2024-05-04 12:00" },
      { id: 3, message: "活動邀請通知", time: "2024-05-04 15:00" }
    ],
    system: [
      { id: 1, message: "系統維護通知", time: "2024-05-05 13:00" },
      { id: 2, message: "隱私政策更新", time: "2024-05-06 14:00" },
      { id: 3, message: "新功能上線", time: "2024-05-07 16:00" }
    ]
  };

  const [showDropdown, setShowDropdown] = useState({
    arrival: false,
    social: false,
    system: false,
  });

  const toggleDropdown = (category) => {
    setShowDropdown(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const NotificationItem = ({ message, time }) => (
    <div style={{
      borderBottom: '1px solid #ddd',
      padding: '10px 20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      margin: '10px 0', // 左右邊距為0，上下邊距為10px
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <p>{message}</p>
      <small>{time}</small>
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
        <div style={{ color: 'black', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold' }}>你的通知</div>
      </div>
      <div style={{ paddingTop: 100, paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}>
        {['arrival', 'social', 'system'].map(category => (
          <div key={category} style={{ borderTop: '1px solid #ddd', backgroundColor: 'white', marginTop: 10, marginLeft: 0, marginRight: 0 }}>
            <h2 onClick={() => toggleDropdown(category)} style={{
              padding: '10px 20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold'
            }}>
              {category === 'arrival' ? '到貨通知' : category === 'social' ? '社群通知' : '系統通知'}
              <span>{showDropdown[category] ? '↑' : '↓'}</span>
            </h2>
            {(showDropdown[category] ? notifications[category] : notifications[category].slice(0, 2)).map(notification => (
              <NotificationItem key={notification.id} {...notification} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
