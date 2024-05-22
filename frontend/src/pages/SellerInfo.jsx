import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

function SellerInfo() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const { memberId } = useParams();
  const [sellerInfo, setSellerInfo] = useState([{
    seller_name: '',
    seller_phone: '',
    image: defaultImageUrl,
    star_rating: '',
    comment: '',
    order_time: ''
  }]);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const goToChats = () => {
    navigate(`/ChatRoom/${memberId}/${sellerId}`); // Navigate to the SellerChats page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getSellerInfo/${sellerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setSellerInfo(data);  // 确保这里是按预期设定状态
        console.log(sellerInfo);
      } catch (error) {
        console.error('Error fetching seller info:', error);
        setSellerInfo(null);  // 在错误情况下也设置为null或默认值
      }
    };

    fetchData();
  }, [sellerId]);

  return (
    <div className="Vv" style={{ width: 393, height: 850, position: 'relative', background: 'white' }}>
      <div className="Frame2" style={{ height: 186, paddingTop: 135, paddingBottom: 15, paddingLeft: 14, paddingRight: 140, left: 0, top: -64, position: 'absolute', background: '#F1C010', justifyContent: 'flex-start', alignItems: 'center', gap: 101, display: 'flex' }}>
        <div className="ArrowLeft" style={{ width: 24, height: 24, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div className="Go" style={{ color: 'black', fontSize: 28, fontFamily: '"Microsoft JhengHei", "Segoe UI", sans-serif', fontWeight: 'bold', wordWrap: 'break-word' }} >揪團 GO</div>
      </div>
      <div style={{ height: 211, left: 72, top: 190, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
        <div className="Image" style={{ width: 248, height: 211, background: 'linear-gradient(0deg, #F7F7F7 0%, #F7F7F7 100%)', borderRadius: 8, overflow: 'hidden' }}>
          <img src={sellerInfo[0].image ? `data:image/jpeg;base64,${sellerInfo[0].image}` : defaultImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '4px solid black' }} alt="Seller Profile" />
        </div>
      </div>
      <div style={{ left: 20, top: 144, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>團購主基本資訊</div>
      <div className="MessageCircle" style={{ width: 24, height: 24, right: 30, top: 144, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer' }} onClick={goToChats}>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div className="seller_name" style={{ left: 90, top: 421, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>賣家暱稱 : {sellerInfo[0].seller_name} </div>
      <div className="seller_phone" style={{ left: 90, top: 457, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>連絡電話 : {sellerInfo[0].seller_phone}</div>
      {/* <hr className="Line" style={{ width: 393, height: 1, left: 0, top: 504, position: 'absolute', background: '#000000' }} /> */}
      {/* <div className="seller_name" style={{ left: 20, top: 510, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>評論 </div> */}
      <div className="reviews" style={{ marginTop: 480 }}>
        {sellerInfo.map((item, index) => (
          <div key={index} className="review-container">
            <div className="review-header">
              <span className="star-rating">⭐{item.star_rating}</span>
              <span>{item.order_time}</span>
            </div>
            <div className="review-body">{item.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerInfo;
