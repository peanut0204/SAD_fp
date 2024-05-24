import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

const ImageWithAlt = ({ src, alt }) => (
  <img loading="lazy" src={src} alt={alt} className="shrink-0 w-6 aspect-square" />
);

const RoundedBorderDiv = ({ children }) => (
  <div className="justify-center self-center px-4 py-3 mt-4 text-base font-medium leading-6 rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500">
    {children}
  </div>
);

const AddProduct = () => {
  // const groupBuyItems = [
  //   { label: "團購商品名稱", placeholder: "輸入團購名稱..." },
  //   { label: "團購商品Tag", placeholder: "輸入商品類別..." },
  //   { label: "團購商品最低數量", placeholder: "輸入商品數量..." },
  //   { label: "團購商品單價", placeholder: "輸入商品單價..." },
  //   { label: "團購配送地點", placeholder: "輸入團購地點..." },
  //   { label: "團購商品描述", placeholder: "輸入商品細節..."}
  // ];

  const { memberId } = useParams();
  const [productInfo, setProductInfo] = useState({
    name: '',
    tag: '',
    amount: '',
    price: '',
    group_name: '',
    detail: '',
    cover: ''
  });
  const [submittedProductInfo, setSubmittedProductInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setSubmittedProductInfo(productInfo);


    try {
      // 发送书籍信息到后端
      const response = await fetch(`http://127.0.0.1:5000/api/addProduct/${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productInfo)
      });

      if (response.ok) {
        // 处理成功添加书籍的逻辑
        console.log('Product added successfully!');
      } else {
        // 处理添加书籍失败的逻辑
        console.error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }

  };



  return (
    <div style={{ backgroundColor: 'saddlebrown' }}>
      <div className="flex flex-col pb-20 mx-auto w-full text-black whitespace-nowrap bg-white max-w-[480px]">
        <header className="flex gap-5 items-start px-4 pt-20 pb-4 w-full text-3xl bg-yellow-400">
          <button>
            <a href={`../SellerOffice/${memberId}`}>
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0985f90a1c268de1453e96392357b86d4e1d1e025d9162ea01e8c89b45c6a4ff?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Search icon" className="shrink-0 gap-0 aspect-square w-[35px]" />
            </a>
          </button>
          <h1 className="flex-auto">新增團購商品</h1>
        </header>
        <main className="flex flex-col px-5 mt-5 w-full text-xl">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col px-5 mt-5 w-full">
              <div className="self-start ml-3 text-xl text-black">團購商品名稱</div>
              <input
                type="text"
                name="name" // Add name attribute
                value={productInfo.name}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入團購名稱..."
              />

              <div className="self-start mt-6 ml-3 text-xl text-black">
                團購商品 Tag
              </div>
              <input
                type="text"
                name="tag" // Add name attribute
                value={productInfo.tag}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入商品類別..."
              />
              <div className="mt-6 ml-3 text-xl text-black">團購商品最低數量</div>
              <input
                type="text"
                name="amount" // Add name attribute
                value={productInfo.amount}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入商品數量..."
              />
              <div className="mt-6 ml-3 text-xl text-black">團購商品單價</div>
              <input
                type="text"
                name="price" // Add name attribute
                value={productInfo.price}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入商品單價..."
              />
              <div className="mt-6 ml-3 text-xl text-black">團購群組名稱</div>
              <input
                type="text"
                name="group_name" // Add name attribute
                value={productInfo.group_name}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入團購群組名稱..."
              />
              <div className="mt-6 ml-3 text-xl text-black">團購商品描述</div>
              <input
                type="text"
                name="detail"
                value={productInfo.detail}
                onChange={handleChange}
                className="justify-center items-start self-center px-4 py-3 mt-4 max-w-full text-base font-medium leading-6 whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 w-[325px]"
                placeholder="輸入商品細節..."
              />
              <div className="self-start mt-7 ml-3 text-xl text-black">團購商品圖片</div>
              <label className="flex gap-2 self-center px-4 py-3 mt-4 text-base font-medium leading-6 text-center whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  name="cover"
                  value={productInfo.cover}
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
              <div className="shrink-0 mt-10 h-px bg-black border border-black border-solid" />
              <div className="z-10 shrink-0 h-px bg-black border border-black border-solid" />
              <button type="submit" className="justify-center self-center px-4 py-3 mt-10 text-base font-medium leading-6 text-center text-black whitespace-nowrap bg-yellow-400 rounded-lg border border-solid shadow-sm border-neutral-200">
                {/* <Link to="/SearchFood/1"> */}
                確認新增商品
                {/* </Link> */}
              </button>
            </div>
          </form>

          {/* 在页面上显示用户输入的书籍信息 */}
          {submittedProductInfo && (
            <div className="flex flex-col px-5 ml-5 mt-5 w-full">
              <h2 className="self-start text-xl text-black">Submitted Product Information:</h2>
              <p>Name: {submittedProductInfo.name}</p>
              <p>Tag: {submittedProductInfo.tag}</p>
              <p>Amount: {submittedProductInfo.amount}</p>
              <p>Unit Price: {submittedProductInfo.price}</p>
              <p>Location: {submittedProductInfo.location}</p>
              <p>Description: {submittedProductInfo.detail}</p>
              {/* <p>Photo: {submittedProductInfo.cover}</p> */}
            </div>
          )}

          {/* {groupBuyItems.map(({ label, placeholder }) => (
            <React.Fragment key={label}>
              <label htmlFor={label} className="self-start mt-7 ml-3.5">
                {label}
              </label>
              <RoundedBorderDiv>
                <input
                  type="text"
                  id={label}
                  placeholder={placeholder}
                  className="bg-transparent focus:outline-none w-full"
                />
              </RoundedBorderDiv>
            </React.Fragment>
          ))}
          <label htmlFor="groupBuyCover" className="self-start mt-7 ml-4">
            團購封面
          </label>
          <RoundedBorderDiv>
              <label className="flex gap-2 self-center px-4 py-1 text-base font-medium leading-6 text-center whitespace-nowrap rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
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
            
          </RoundedBorderDiv> */}
          {/* <div className="flex gap-5 justify-between self-center mt-10 w-full max-w-[200px]">
            <div className="my-auto">是否上架商品</div>
            <button>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e95eb4a42550566b10276c9c3271f8c417e8c4d9a59ed6f624a2555e0c4e003?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&"
                alt="Switch"
                className="shrink-0 w-16 aspect-[1.89]"
              />
            </button>
          </div>
          <hr className="shrink-0 mt-6 h-px bg-black border border-black border-solid" />
          <button className="justify-center self-center px-4 py-3 mt-9 text-base font-medium leading-6 text-center bg-yellow-400 rounded-lg border border-solid shadow-sm border-neutral-200">
            新增此團購資訊
          </button> */}
        </main>
      </div>
    </div>
  );
};

export default AddProduct;