import * as React from "react";

const ImageWithAlt = ({ src, alt }) => (
  <img loading="lazy" src={src} alt={alt} className="shrink-0 w-6 aspect-square" />
);

const RoundedBorderDiv = ({ children }) => (
  <div className="justify-center self-center px-4 py-3 mt-4 text-base font-medium leading-6 rounded-lg border border-solid shadow-sm bg-neutral-200 border-neutral-200 text-zinc-500">
    {children}
  </div>
);

const AddProduct = () => {
  const groupBuyItems = [
    { label: "團購商品名稱", placeholder: "輸入團購名稱..." },
    { label: "團購商品數量", placeholder: "輸入商品數量..." },
    { label: "團購地點", placeholder: "輸入團購地點..." },
  ];

  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
      <div className="flex flex-col pb-20 mx-auto w-full text-black whitespace-nowrap bg-white max-w-[480px]">
        <header className="flex gap-5 items-start px-4 pt-20 pb-4 w-full text-3xl bg-yellow-400">
          <ImageWithAlt src="https://cdn.builder.io/api/v1/image/assets/TEMP/24edf058b578a35dd93bf699fe724d82806d3188532ec241304c9738697f137a?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Icon" />
          <h1 className="flex-auto">新增團購</h1>
        </header>
        <main className="flex flex-col px-5 mt-10 w-full text-xl">
          {groupBuyItems.map(({ label, placeholder }) => (
            <React.Fragment key={label}>
              <label htmlFor={label} className="self-start ml-3.5">
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
            <div className="flex gap-2">
              <ImageWithAlt src="https://cdn.builder.io/api/v1/image/assets/TEMP/40b025eb622579bbffa84f6c997d90da6968594b2e92e6bf885df4d378254fd3?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Import icon" />
              <span>匯入圖片...</span>
            </div>
          </RoundedBorderDiv>
          <label htmlFor="groupBuyInfo" className="self-start mt-7 ml-3.5">
            團購商品資訊規則說明
          </label>
          <RoundedBorderDiv>
            <div className="flex gap-2 w-full max-w-[327px]">
              <ImageWithAlt src="https://cdn.builder.io/api/v1/image/assets/TEMP/40b025eb622579bbffa84f6c997d90da6968594b2e92e6bf885df4d378254fd3?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Info icon" />
              <span>輸入說明與規則...</span>
            </div>
          </RoundedBorderDiv>
          <div className="flex gap-5 justify-between self-center mt-5 w-full max-w-[327px]">
            <div className="my-auto">上架商品</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e95eb4a42550566b10276c9c3271f8c417e8c4d9a59ed6f624a2555e0c4e003?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&"
              alt="Switch"
              className="shrink-0 w-16 aspect-[1.89]"
            />
          </div>
          <hr className="shrink-0 mt-6 h-px bg-black border border-black border-solid" />
          <button className="justify-center self-center px-4 py-3 mt-9 text-base font-medium leading-6 text-center bg-yellow-400 rounded-lg border border-solid shadow-sm border-neutral-200">
            傳送至社群
          </button>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;