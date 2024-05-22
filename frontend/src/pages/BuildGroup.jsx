import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useParams } from 'react-router-dom';

function BuildGroup() {
  const { memberId } = useParams();
  const [groupInfo, setGroupInfo] = useState({
      name: '',
      cover: '',
      location: '',
      member_limit: '',
      rules: ''
  });
  const [submittedGroupInfo, setSubmittedGroupInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupInfo(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setSubmittedGroupInfo(groupInfo);

    // const formData = new FormData(event.target); // Get form data

    // // Extract user input values from form fields
    // const groupName = formData.get('groupName');
    // const groupCover = formData.get('groupCover');
    // const groupLocation = formData.get('groupLocation');
    // const groupMemberLimit = formData.get('groupMemberLimit');
    // const groupRules = formData.get('groupRules');

    // // Prepare data to be sent to the backend
    // const data = {
    //   groupName,
    //   groupCover,
    //   groupLocation,
    //   groupMemberLimit,
    //   groupRules,
    // };

    try {
        // 发送书籍信息到后端
        // const response = await fetch(`http://127.0.0.1:5000/api/buildGroup/${memberId}`, {
        const response = await fetch(`http://127.0.0.1:5000/api/buildGroup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupInfo)
        });

        if (response.ok) {
            // 处理成功添加书籍的逻辑
            console.log('Group added successfully!');
        } else {
            // 处理添加书籍失败的逻辑
            console.error('Failed to add group.');
        }
    } catch (error) {
        console.error('Error adding group:', error);
    }

    // // Send data to the backend using Fetch API (or Axios)
    // fetch('/api/buildGroup', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     // Handle successful response from the backend
    //     console.log('Group created successfully:', responseData);
    //   })
    //   .catch((error) => {
    //     console.error('Error creating group:', error);
    //   });
    
  };
	
  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
      <div className="flex flex-col pb-16 mx-auto w-full bg-white max-w-[480px]">
        <div className="flex gap-5 items-start px-3.5 pt-20 pb-5 w-full text-3xl text-black whitespace-nowrap bg-yellow-400">
          <button>
            <Link to="/SearchFood/1"> 
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/24edf058b578a35dd93bf699fe724d82806d3188532ec241304c9738697f137a?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&"
                className="shrink-0 w-6 aspect-square"
              />
            </Link>
          </button>
          <div className="flex-auto text-center" style={{ marginRight: '30px' }}>建立社群</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col px-5 mt-5 w-full">
            <div className="self-start ml-3 text-xl text-black">社群名稱</div>
              <input
                type="text"
                name="name" // Add name attribute
                value={groupInfo.name}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入團購名稱..."
              />
            
            <div className="self-start mt-7 ml-3 text-xl text-black">社群封面</div>
            <label className="flex gap-2 self-center px-4 py-3 mt-4 text-base font-medium leading-6 text-center whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                name="cover"
                value={groupInfo.cover}
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  
                  reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    // 將預覽的圖片顯示在<img>元素中
                    const imgElement = document.getElementById("previewImage");
                    imgElement.src = imageUrl;
                  };
                  
                  reader.readAsDataURL(file);
                }}
              />
              <img
                id="previewImage"
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/40b025eb622579bbffa84f6c997d90da6968594b2e92e6bf885df4d378254fd3?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&"
                className="shrink-0 w-6 aspect-square"
                alt="預覽圖片"
              />
              <div>匯入圖片...</div>
            </label>

            <div className="self-start mt-6 ml-3 text-xl text-black">
              所在地理位置
            </div>
            <input
              type="text"
              name="location" // Add name attribute
              value={groupInfo.location}
              onChange={handleChange}
              className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
              placeholder="輸入地區..."
            />
            <div className="mt-6 ml-3 text-xl text-black">社群人數上限</div>
            <input
              type="text"
              name="member_limit" // Add name attribute
              value={groupInfo.member_limit}
              onChange={handleChange}
              className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
              placeholder="輸入人數上限..."
            />
            <div className="mt-6 ml-3 text-xl text-black">社群規則資訊說明</div>
            <input
              type="text"
              name="rules"
              value={groupInfo.rules}
              onChange={handleChange}
              className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
              placeholder="輸入說明與規則..."
            />
            <div className="shrink-0 mt-10 h-px bg-black border border-black border-solid" />
            <div className="z-10 shrink-0 h-px bg-black border border-black border-solid" />
            <button type="submit" className="justify-center self-center px-4 py-3 mt-10 text-base font-medium leading-6 text-center text-black whitespace-nowrap bg-yellow-400 rounded-lg border border-solid shadow-sm border-neutral-200">
              {/* <Link to="/SearchFood/1"> */}
                完成建立社群
              {/* </Link> */}
            </button>
          </div>
        </form>

        {/* 在页面上显示用户输入的书籍信息 */}
        {submittedGroupInfo && (
          <div className="flex flex-col px-5 ml-5 mt-5 w-full">
              <h2 className="self-start text-xl text-black">Submitted Group Information</h2>
              <p>Name: {submittedGroupInfo.name}</p>
              {/* <p>Cover: {submittedGroupInfo.cover}</p> */}
              <p>Location: {submittedGroupInfo.location}</p>
              <p>Member Limit: {submittedGroupInfo.member_limit}</p>
              <p>Rules: {submittedGroupInfo.rules}</p>
          </div>
        )}
      </div>
    </div>
  );
}
  
export default BuildGroup;