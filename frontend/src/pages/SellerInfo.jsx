import React from 'react';
import { useNavigate } from 'react-router-dom';

function SellerInfo() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const goToChats = () => {
    navigate('/SellerChats/1'); // Navigate to the SellerChats page
  };

  return (
    <div className="Vv" style={{ width: 393, height: 850, position: 'relative', background: 'white' }}>
      <div className="Frame2" style={{ height: 186, paddingTop: 135, paddingBottom: 15, paddingLeft: 14, paddingRight: 140, left: 0, top: -64, position: 'absolute', background: '#F1C010', justifyContent: 'flex-start', alignItems: 'center', gap: 101, display: 'flex' }}>
        <div className="ArrowLeft" style={{ width: 24, height: 24, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div className="Go" style={{ color: 'black', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }} >揪團 GO</div>
      </div>
      <div style={{ height: 211, left: 72, top: 190, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
        <div className="Image" style={{ width: 248, background: 'linear-gradient(0deg, #F7F7F7 0%, #F7F7F7 100%)', borderRadius: 8, overflow: 'hidden', backgroundImage: 'url(https://via.placeholder.com/248x211)', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          <img className="Images1" style={{ width: 249, height: 249 }} src="https://via.placeholder.com/249x249" alt="Seller Profile" />
        </div>
      </div>
      <div style={{ left: 20, top: 144, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>團購主基本資訊</div>
      <div className="MessageCircle" style={{ width: 24, height: 24, right: 30, top: 144, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer' }} onClick={goToChats}>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div className="Oliver" style={{ left: 34, top: 431, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>名稱 : Oliver </div>
      <div className="0912345678" style={{ left: 34, top: 467, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>連絡電話 : 0912345678</div>
    </div>
  );
}

export default SellerInfo;
