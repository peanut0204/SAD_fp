import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmOrder() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleSubmit = () => {
    alert('訂購完成!');
  };

  return (
    <div className="Vv" style={{ width: '100%', height: '100vh', position: 'relative', background: 'white', overflowX: 'hidden' }}>
      <div className="Frame2" style={{ height: 140, width: '100%', position: 'fixed', top: 0, left: 0, background: '#F1C010', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '0 20px', boxSizing: 'border-box' }}>
        <div className="ArrowLeft" style={{ width: 24, height: 24, cursor: 'pointer', position: 'absolute', left: 20, top: '105%', transform: 'translateY(-200%)' }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ color: 'black', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', paddingTop: 80 }} >揪團 GO</div>
      </div>
      <div style={{ marginTop: 146, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>確認訂購</div>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="heart">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div style={{ marginTop: 10 }}>
          <img src="data:image/jpeg;base64,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" alt="Product" style={{ width: '100%' }} />
          <div style={{ marginTop: 10, fontWeight: 'bold' }}>商品名稱: 左手第五指手指</div>
          <div style={{ fontWeight: 'bold' }}>價格: 5500000 元/份</div>
          <div style={{ marginBottom: 10, fontWeight: 'bold' }}>團購主姓名: larry lin</div>
        </div>
        <hr />
        <div>
          <div style={{ marginTop: 10, fontWeight: 'bold' }}>訂單收取人姓名:</div>
          <input placeholder='輸入訂購人姓名' style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none', marginTop: 10, marginBottom: 10 }} type="text" />
          <div style={{ marginBottom: 10, fontWeight: 'bold' }}>訂單收取人聯絡電話:</div>
          <input placeholder='輸入聯絡電話' style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="text" />
          <div style={{ marginTop: 10, marginBottom: 10 }}>團購配送地址: 固定地址顯示</div>
          <div style={{ marginBottom: 10, fontWeight: 'bold' }}>訂購數量:</div>
          <input placeholder='輸入訂購數量' style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="number" />
          <div style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }} >其他特殊需求:</div>
          <input placeholder='若有特殊需求請輸入' style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="text" />
        </div>
        <button style={{ marginTop: 20, width: '100%', padding: 15, backgroundColor: '#F1C010', color: 'black', border: 'none', borderRadius: 5, fontSize: 16, fontWeight: 'bold' }} onClick={handleSubmit}>確認並送出團購訂單</button>
      </div>
    </div >
  );
}

export default ConfirmOrder;
