import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function MyGroup() {
  //導引到社群內部頁面跟回到上一頁
  const navigate = useNavigate();

  const goToGroupRoom = (groupId) => {
    navigate(`/GroupRoom/${buyer_id}/${groupId}`); // 導航到每個社群的專頁
  };

  const goBack = () => {
    navigate(-1); // 返回上一頁
  };

  // 假設你已知的用戶 ID，或從某處獲取 

  // // 發送請求給後端的@app.route('/api/getJoinedGroups/<buyer_id>', methods=['GET'])
  // //const { buyer_id } = useParams();
  // // useEffect(() => {
  // //   fetch(`http://127.0.0.1:5000/api/getJoinedGroups/${buyer_id}`) // call API
  // //     .then(response => response.json()) // get result
  // //     .then(data => setCommunities(data))
  // //     .catch(error => console.error('Error fetching followings:', error));
  // // }, [buyer_id]);

  // useEffect(() => {
  //   fetchGroups();
  // }, []);

  // const fetchGroups = async () => {
  //   try {

  //     const response = await fetch('http://127.0.0.1:5000/api/getJoinedGroups?buyer_id=' + encodeURIComponent(buyer_id), {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     console.log(data); // Log the data to the console to check it
  //     setCommunities(data.map(community => ({
  //       id: community.group_id,
  //       name: community.group_name,
  //       location: community.group_location,
  //       picture: community.group_picture
  //     })));

  //   } catch (error) {
  //     console.error('Error fetching groups:', error);
  //   }
  // }

  // const { buyer_id } = useParams();
  const buyer_id = 'Buffet@gmail.com.tw';
  console.log(buyer_id);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/getJoinedGroups/${buyer_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setCommunities(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchData();
  }, [buyer_id]);
  //--------------------------------------------------------------------------------------------------------------
  // const [communities, setCommunities] = useState([]);
  // // const buyer_id = 'Buffet@gmail.com.tw';
  // const { buyer_id } = useParams();
  // console.log(buyer_id);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3000/api/getJoinedGroups/${buyer_id}`);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       console.log('Data fetched successfully:', data);
  //       setCommunities(data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [buyer_id]); // 注意，這裡的依賴數組為空，表示只在組件掛載時運行一次

  //--------------------------------------------------------------------------------------------------------------
  //測試後端有沒有收到前端的請求
  // fetch(`http://localhost:3000/api/getJoinedGroups/${buyer_id}`)
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.text()  // 先获取文本看看是什么
  //       .then(text => {
  //         try {
  //           return JSON.parse(text);  // 尝试解析 JSON
  //         } catch (error) {
  //           console.error("Failed to parse JSON:", text);
  //           throw error;
  //         }
  //       });
  //   })
  //   .then(data => {
  //     console.log('Data fetched successfully:', data);
  //   })
  //   .catch(error => {
  //     console.error('Error fetching data:', error);
  //   });


  //--------------------------------------------------------------------------------------------------------------
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white' }}>
      <div style={{ width: '100%', height: 186, paddingTop: 15, paddingLeft: 14, paddingRight: 14, position: 'fixed', top: 0, left: 0, background: '#F1C010', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 14, top: 130, width: 24, height: 25 }} onClick={goBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'black', fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center' }}>
            揪團 GO
          </div>
          <input type="text" placeholder="搜尋我的社群" style={{ marginTop: 10, width: '85%', padding: '10px', backgroundColor: '#F0F0F0', borderRadius: '15px', border: 'none' }} />
        </div>
      </div>
      <div style={{ marginTop: 200, padding: '0 14px' }}>
        <h2 style={{ marginBottom: 20, fontSize: 20 }}><b>我加入的社群</b></h2>
        {communities.map(community => (
          <div key={community.group_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
            <img src={community.group_picture} alt={community.group_name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: '10px' }} onClick={() => goToGroupRoom(community.group_id)} />
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontWeight: 'bold', marginTop: 10 }}>{community.group_name}</h3>
              <p>位置：{community.group_location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGroup;
// words and picture didn't show up
// I don't know why
// I tried to console.log the response.data
// it showed the data correctly
