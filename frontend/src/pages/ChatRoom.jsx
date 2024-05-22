import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';

function SellerChats() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [sellerInfo, setSellerInfo] = useState([{
    seller_name: '',
    seller_phone: '',
    image: defaultImageUrl,
    star_rating: '',
    comment: '',
    order_time: ''
  }]);
  const [messages, setMessages] = useState([
    { id: 1, text: "你好，有什麼可以幫忙的嗎?", sender: "Seller", time: "2:30 PM" }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getSellerInfo/${sellerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSellerInfo(data);
      } catch (error) {
        console.error('Error fetching seller info:', error);
        setSellerInfo(null);
      }
    };

    fetchData();
  }, [sellerId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const goBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div className="flex flex-col h-screen">
      <header style={{ backgroundColor: '#F1BF0F', color: 'black', padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
        <div className="ArrowLeft" style={{ width: 24, height: 24, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div className="flex items-center ml-4">
          <img src={sellerInfo[0].image ? `data:image/jpeg;base64,${sellerInfo[0].image}` : defaultImageUrl} alt={sellerInfo[0].seller_name} style={{ left: 10, width: 50, height: 50, borderRadius: '50%' }} className="mr-3" />
          <div className="font-medium">{sellerInfo[0].seller_name}</div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#f0f0f0' }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end ${message.sender === "You" ? "justify-end" : ""}`}>
            {message.sender !== "You" && (
              <img src={sellerInfo[0].image ? `data:image/jpeg;base64,${sellerInfo[0].image}` : defaultImageUrl} alt={message.sender} style={{ width: 40, height: 40, borderRadius: '50%' }} className="mr-2" />
            )}
            <div className={`rounded-lg p-3 max-w-[70%] text-sm ${message.sender === "You" ? "bg-black text-white" : "bg-gray-200"}`}>
              <p>{message.text}</p>
              <div className="text-xs mt-1" style={{ color: '#888' }}>{message.time}</div>
            </div>
            {message.sender === "You"
              // && (
              //   <img src={defaultImageUrl} alt={message.sender} style={{ width: 40, height: 40, borderRadius: '50%' }} className="ml-2" />
              // )
            }
          </div>
        ))}
      </div>
      <div className="bg-gray-100 p-4 flex items-center" style={{ minHeight: '10vh' }}>
        <input
          className="flex-1 mr-4 bg-white border-none focus:ring-0 p-2"
          placeholder="輸入文字..."
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          style={{ borderRadius: '20px' }}
        />
        <button
          onClick={handleSendMessage}
          style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#007BFF', color: 'white' }}>
          傳送
        </button>
      </div>
    </div>
  );
}

export default SellerChats;
