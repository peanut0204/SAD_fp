import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImageUrl from '../images/cover.png';
import '../css/box_style.css';
import Button from '@mui/material/Button';

function GroupRoom() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [products, setProducts] = useState([]); // Stores all products
  const [displayedProducts, setDisplayedProducts] = useState([]); // Communities to be displayed
  const [searchQuery, setSearchQuery] = useState('');
  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };


  // const product = [
  //   {
  //     group_id: 123456,
  //     group_name: "Group 1",
  //     image: defaultImageUrl,
  //     product_name: "香蕉",
  //     product_id: 1,
  //     price: 10,
  //     tag: "水果",
  //     seller_id: 1,
  //     seller_name: "Seller 1"
  //   },
  //   {
  //     group_id: 654321,
  //     group_name: "Group 2",
  //     image: defaultImageUrl,
  //     product_name: "手機",
  //     product_id: 2,
  //     price: 20,
  //     tag: "3C",
  //     seller_id: 2,
  //     seller_name: "Seller 2"
  //   }
  // ];

  // const [products, setProducts] = useState(product);

  // const [setProducts] = useState(); // Stores all products

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getGroupProduct/${groupId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
        setDisplayedProducts(data);  // Display all communities by default
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchData();
  }, [groupId]);

  const handleSearch = () => {
    if (!searchQuery) {
      setDisplayedProducts(products); // If search query is empty, show all communities
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filteredData = products.filter(product =>
        product.product_name.toLowerCase().includes(lowercasedQuery) ||
        product.tag.toLowerCase().includes(lowercasedQuery)
      );
      setDisplayedProducts(filteredData);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };


  return (
    <div className="Vv" style={{ width: '100%', height: '100%', position: 'relative', background: 'white' }}>
      <div className="Frame2" style={{ width: '100%', height: 186, paddingTop: 15, paddingLeft: 14, paddingRight: 14, position: 'fixed', top: 0, left: 0, background: '#F1C010', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="ArrowLeft" style={{ position: 'absolute', left: 14, top: 130, width: 24, height: 25, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'black', fontSize: 28, fontFamily: '"Microsoft JhengHei", "Segoe UI", sans-serif', fontWeight: 'bold', textAlign: 'center' }}>
            揪團 GO
          </div>
          <div style={{ display: 'flex', width: '85%', marginTop: 10 }}>
            <input
              type="text"
              placeholder="以名稱或標籤搜尋商品"
              style={{
                flexGrow: 1,
                padding: '10px',
                backgroundColor: '#F0F0F0',
                borderRadius: '15px 15px 15px 15px',  // Rounded corners on the left side of the input
                border: 'none',
                marginRight: '5px'  // Creates a gap between the input and the button
              }}
              value={searchQuery}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              style={{
                borderRadius: '15px 15px 15px 15px',  // Rounded corners on the right side of the button
                height: '50px',
                fontSize: '15px',
                boxShadow: 'none',  // Optionally remove box-shadow if desired
                backgroundColor: '#000000', // Sets the button color to black
                color: '#FFFFFF', // Sets the text color to white for better readability
              }}
              onClick={handleSearch}
            >
              搜尋
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 200, padding: '0 14px' }}>
        {products.length > 0 && (
          <h2 style={{ marginBottom: 20, fontSize: 20 }} >
            <b>{products[0].group_name}的商品</b>
          </h2>
        )}
        {displayedProducts.map(product => (
          <div className='box' key={product.product_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
            <img src={product.image || defaultImageUrl} alt={product.product_name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: '10px' }} />
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontWeight: 'bold', marginTop: 10 }}>{product.product_name}</h3>
              <p>團購主：{product.seller_name}</p>
              <p>價格：{product.price}</p>
              <p>產品標籤：{product.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupRoom;
