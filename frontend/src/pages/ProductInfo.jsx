import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

function ProductInfo() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const { memberId } = useParams();
  const { productId } = useParams();
  const [productInfo, setProductInfo] = useState({
    image: defaultImageUrl,
    product_name: '',
    price: '',
    seller_name: '',
    group_location: '',
    description: ''
  });

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const goToConfirmOrder = () => {
    navigate(`/ConfirmOrder/${memberId}/${productId}/${sellerId}`); // Navigate to the ConfirmOrder page
  };

  const goToAnotherPage = () => {
    navigate(`/AnotherPage/${memberId}/${productId}/${sellerId}`); // Navigate to another page (example)
  };

  const goToSellerChat = () => {
    navigate(`/ChatRoom/${memberId}/${sellerId}`); // Navigate to the SellerChat page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getProductInfo/${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          const product = data[0]; // 從陣列中提取第一個對象
          setProductInfo({
            image: product.image,  // 確保使用默認圖片作為後備
            product_name: product.product_name,
            price: product.price,  // 注意要使用數據中的正確屬性名
            seller_name: product.seller_name,
            group_location: product.group_location,
            description: product.description
          });
        }
        console.log(data);
        console.log(productInfo.image);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle any fallback or error state here
      }
    };

    fetchData();
  }, [productId]);


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
      a
      <div style={{ height: 211, left: 72, top: 190, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
        <div className="Image" style={{ width: 248, height: 211, background: 'linear-gradient(0deg, #F7F7F7 0%, #F7F7F7 100%)', borderRadius: 8, overflow: 'hidden' }}>
          <img src={productInfo.image ? `data:image/jpeg;base64,${productInfo.image}` : defaultImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '4px solid black' }} alt="image" />
        </div>
      </div>
      <div style={{ left: 20, top: 144, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>商品基本資訊</div>
      {/* <div className="MessageCircle" style={{ width: 24, height: 24, right: 30, top: 144, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer' }} onClick={goToConfirmOrder}>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div> */}
      <div className="product_name" style={{ left: 70, top: 421, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>品項名稱 : {productInfo.product_name} </div>
      <div style={{ left: 70, top: 451, position: 'absolute', textAlign: 'center', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>
        團購主姓名：
        <span
          style={{ cursor: 'pointer', color: '#007BFF' }} // 添加样式以示可点击
          onClick={() => navigate(`/sellerInfo/${memberId}/${sellerId}`)}
        >
          {productInfo.seller_name}
        </span>
      </div>
      <div className="price" style={{ left: 70, top: 481, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>價格 : {productInfo.price}</div>
      <div className="description" style={{ left: 125, top: 521, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word' }}>▶️商品敘述</div>
      <div className="description" style={{ left: 48, top: 561, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold', wordWrap: 'break-word', maxWidth: '300px' }}>{productInfo.description}</div>

      <div style={{ width: '55%', position: 'absolute', left: 80, top: 700, display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <Button variant="contained" color="primary" onClick={goToConfirmOrder}>訂購</Button>
        <Button variant="contained" color="primary" onClick={goToSellerChat}>詢問買家</Button>
      </div>
    </div>
  );
}

export default ProductInfo;
