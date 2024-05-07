import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmOrder() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="Vv" style={{ width: 393, height: 850, position: 'relative', background: 'white' }}>
      <div className="Frame2" style={{ height: 186, width: '100%', position: 'fixed', top: 0, left: 0, background: '#F1C010', padding: '20px 14px', boxSizing: 'border-box', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 1000 }}>
        <div className="ArrowLeft" style={{ width: 24, height: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ marginLeft: 10, color: 'black', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', flexGrow: 1 }} >揪團 GO</div>
      </div>
      <div style={{ marginTop: 186, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>確認訂購</div>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="heart">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div style={{ marginTop: 10 }}>
          <img src="/path/to/product/image" alt="Product" style={{ width: '100%' }} />
          <div style={{ fontWeight: 'bold' }}>商品名稱: A5和牛</div>
          <div>價格: 550元/份</div>
          <div>團購主姓名: 張三</div>
        </div>
        <hr />
        <div>
          <div>訂單收取人姓名:</div>
          <input style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="text" />
          <div>訂單收取人聯絡電話:</div>
          <input style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="text" />
          <div>團購配送地址: 固定地址顯示</div>
          <div>訂購數量:</div>
          <input style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="number" />
          <div>其他特殊需求:</div>
          <input style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }} type="text" />
        </div>
        <button style={{ width: '100%', padding: 15, backgroundColor: '#F1C010', color: 'white', border: 'none', borderRadius: 5, fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>確認並送出團購訂單</button>
      </div>
    </div>
  );
}

export default ConfirmOrder;
