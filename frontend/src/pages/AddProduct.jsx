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

  const { memberId } = useParams();
  const [productInfo, setProductInfo] = useState({
    name: '',
    tag: '',
    amount: '',
    price: '',
    group_name: '',
    detail: '',
    cover: null,
  });
  const [submittedProductInfo, setSubmittedProductInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover') {
      setProductInfo({
        ...productInfo,
        [name]: files[0] // Save file object directly
      });
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        const imgElement = document.getElementById('previewImage');
        imgElement.src = imageUrl;
      };
      reader.readAsDataURL(file);
    } else {
      setProductInfo({
        ...productInfo,
        [name]: value
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setSubmittedProductInfo(productInfo);

    const formData = new FormData();
    for (const key in productInfo) {
      formData.append(key, productInfo[key]);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/addProduct/${memberId}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Product added successfully!');
      } else {
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
                  onChange={handleChange}
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
              <p>Product Name: {submittedProductInfo.name}</p>
              <p>Tag: {submittedProductInfo.tag}</p>
              <p>Amount: {submittedProductInfo.amount}</p>
              <p>Unit Price: {submittedProductInfo.price}</p>
              <p>Group Name: {submittedProductInfo.group_name}</p>
              <p>Description: {submittedProductInfo.detail}</p>
              {/* <p>Photo: {submittedProductInfo.cover}</p> */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddProduct;