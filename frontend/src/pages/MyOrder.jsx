import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; //a prettier button

function SearchBar({}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [orders, setOrders] = useState([]);
  const {memberId} = useParams();
  // const {goodsId} = useParams();
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("searchTerm", searchTerm);

    const response = await fetch(`http://localhost:5000/api/myOrder/${memberId}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    setIsSearchClicked(true);
    console.log(data);
    setOrders(data);
  };

  const handleLogistic = async (goodsId) => {
		const response = await fetch(`http://localhost:5000/api/updateMyOrder`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
      body: JSON.stringify({ goodsId }),
		});

    const data = await response.json();
		console.log(data);
    if (data.success) {
			console.log('Logistic successful');
			setMessage(data.message);
		}
		else {
			console.log('Logistic failed');
			setMessage(data.message);
		}
		
		// Join successful, clear message after a delay
		// setTimeout(() => {
		// 	console.log('setMessage called')
		// 	setMessage('');
		// }, 3000); // Clear message after 3 seconds
	};

  return (
    <div className="">
      <form onSubmit={handleSearch}>
        <input 
          className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[230px]" 
          // onChange={handleChange} 
          onChange={e => setSearchTerm(e.target.value)}
          type="text" 
          // name="SearchGroup"
          value={searchTerm}
          placeholder="以群組或產品名稱搜尋..."
        />
        <button type="submit" className="px-4 py-3 text-base font-medium leading-6 whitespace-nowrap bg-white rounded-lg border-2 border-solid border-neutral-200 text-zinc-500">
          搜尋🔍
        </button>
      </form>
      {isSearchClicked && <p> 已找到 {orders.length} 筆我的待出貨訂單： </p>}
      {orders.map((order, index) => (
						<div key={index} className="p-6 m-2 border rounded" style={{width: '100%'}} >
							<p>群組名稱：{order.group_name}</p>
							<p>團購地址：{order.group_location}</p>
              <p>團購品項：{order.goods_name}</p>
              {/* <p>品項類別：{order.tag}</p> */}
              {/* <p>商品單價：{order.unite_price}</p> */}
              {/* <p>最小數量：{order.min_quantity}</p> */}
              <p>物流狀態：{order.logistic_status}</p>
              <p>通知狀態：{order.notification_status}</p>
              <br />
              <Button variant="contained" color="primary" style={{ height: '40px', fontSize: '15px' }} onClick={() => handleLogistic(order.goods_id)} >安排出貨🚛</Button>
              <p>商品 ID：{order.goods_id}</p>
              {message && <p color='primary'>{message}</p>}
						</div>
			))}

    </div>
  );
}

function OrderItem({ item }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-3.5 w-full text-base font-medium rounded-xl bg-neutral-200 max-w-[363px]" style={{margin: '10px'}}>
      <div className="flex gap-5 justify-between leading-6 text-black">
        <div className="flex flex-col gap-2 whitespace-nowrap">
          <div className="gap-0">
            訂購社群：{item.community}
            <br />
            商品編號：{item.orderNumber}
            <br />
          </div>
          <img src={item.image} alt={item.imageAlt} className="gap-0 mt-2 w-full aspect-[0.91]" />
        </div>
        <div className="gap-0 self-end mt-16 text-right">
          x {item.quantity}
          <br />${item.price}
          <br />
          Total：${item.total}
        </div>
      </div>
      <div className="shrink-0 gap-0 mt-3.5 h-px bg-black border border-black border-solid" />
      {/* <button className="justify-center self-center px-2 py-1.5 text-center text-white whitespace-nowrap bg-black rounded-lg border border-solid shadow-sm border-neutral-200 leading-[150%]">
        安排出貨🚛
      </button> */}
      <Button variant="contained" color="primary" style={{ height: '40px', fontSize: '15px' }}  >安排出貨🚛</Button>
    </div>
  );
}

function MyOrder() {
  const { memberId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getJoinedGroups/${memberId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // setCommunities(data);
        // setDisplayedCommunities(data);  // Display all communities by default
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchData();
  }, [memberId]);

  const orderItems = [
    {
      community: "美食烹飪團隊",
      orderNumber: "2040520204",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/51be6b88a8b318311a21326cff4c59ffd9f49322796d0384ecddec765edf56c1?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
      imageAlt: "Order item image",
      quantity: 4,
      price: 50,
      total: 200,
    },
  ];

  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
      <div className="flex flex-col gap-5 items-center pb-20 mx-auto w-full bg-white max-w-[480px]">
        <header className="flex flex-col gap-3.5 self-stretch px-8 pt-20 pb-6 w-full whitespace-nowrap bg-yellow-400">
          <div className="flex gap-5 text-3xl text-black">
          <button>
            <a href={`../SellerOffice/${memberId}`}>
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0985f90a1c268de1453e96392357b86d4e1d1e025d9162ea01e8c89b45c6a4ff?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Search icon" className="shrink-0 gap-0 aspect-square w-[35px]" />
            </a>
          </button>
            <h1 className="flex-auto gap-0 my-auto">我的訂單</h1>
          </div>
        </header>
        
        <nav className="flex gap-5 justify-between px-5 text-xl text-center whitespace-nowrap">
          <a href={`/MyOrder/${memberId}`} className="gap-0 text-black">
            待出貨
          </a>
          <a href={`/OrderState/${memberId}`} className="gap-0 text-zinc-500">
            已到貨
          </a>
        </nav>

        <div className="flex">
          <SearchBar />
        </div>

        <main>
          <p className='px-5'>所有待出貨品項：</p>
          {orderItems.map((item, index) => (
            <OrderItem key={index} item={item} />
          ))}

          {orderItems.map((item, index) => (
            <OrderItem key={index} item={item} />
          ))}
        </main>
      </div>
    </div>
  );
}

export default MyOrder;