import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import SellerInfo from './SellerInfo';

function ConfirmOrder() {
  const navigate = useNavigate();
  const { productId, memberId, sellerId } = useParams();
  const [productInfo, setProductInfo] = useState({
    image: defaultImageUrl,
    product_name: '',
    price: '',
    seller_name: '',
    group_location: '',
    description: ''
  });
  const [quantity, setQuantity] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [showModal, setShowModal] = useState(false);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
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
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle any fallback or error state here
      }
    };

    fetchData();
  }, [productId]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單提交後頁面重新加載
    try {
      const response = await fetch('http://localhost:5000/api/confirmOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          memberId,
          quantity,
          rating,
          comment,
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  }

  return (
    <div className="Vv" style={{ width: '100%', height: '100vh', position: 'relative', background: 'white', overflowX: 'hidden' }}>
      <div className="Frame2" style={{ height: 120, width: '100%', position: 'fixed', top: 0, left: 0, background: '#F1C010', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '0 20px', boxSizing: 'border-box' }}>
        <div className="ArrowLeft" style={{ position: 'absolute', left: 10, top: 75, width: 24, height: 25, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }} onClick={goBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ height: 150, color: 'black', fontSize: 28, fontWeight: 'bold', textAlign: 'center', paddingTop: 80, fontFamily: '"Microsoft JhengHei", "Segoe UI", sans-serif' }} >揪團 GO</div>
      </div>
      <div style={{ marginTop: 100, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>確認訂購</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <img src={productInfo.image ? `data:image/jpeg;base64,${productInfo.image}` : defaultImageUrl} style={{ width: 280, height: 211, objectFit: 'cover', border: '3.5px solid black', overflow: 'hidden', borderRadius: '15px' }} alt="Product picture" />
          <div style={{ marginTop: 10, fontWeight: 'bold' }}>商品名稱：{productInfo.product_name}</div>
          <div style={{ fontWeight: 'bold' }}>價格：{productInfo.price} 元/份</div>
          <div style={{ fontWeight: 'bold' }}>團購主姓名：
            <span
              style={{ cursor: 'pointer', color: '#007BFF' }}  // 添加样式以示可点击
              onClick={() => navigate(`/sellerInfo/${memberId}/${sellerId}`)}
            >
              {productInfo.seller_name}
            </span></div>
          <div style={{ fontWeight: 'bold', marginBottom: 10 }}>配送地址：{productInfo.group_location}</div>
          <hr />
        </div>
        <div>
          <div style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>訂購數量</div>
          <input
            placeholder='輸入訂購數量'
            style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }} >其他特殊需求或評論</div>
          <input
            placeholder='若有特殊需求或評論請輸入'
            style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }}
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 10, fontWeight: 'bold', marginTop: 10 }}>評分</div>
        <input
          placeholder='請為這次的消費體驗給分數(1-5)'
          style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5, border: 'none' }}
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button
          style={{ marginTop: 20, width: '100%', padding: 15, backgroundColor: '#F1C010', color: 'black', border: 'none', borderRadius: 5, fontSize: 16, fontWeight: 'bold' }}
          onClick={handleSubmit}
        >
          確認並送出團購訂單
        </button>
      </div>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="dialogContentText">
            訂購完成！
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="primary" autoFocus>
            確認
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default ConfirmOrder;
