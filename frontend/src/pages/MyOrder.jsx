import * as React from "react";

function SearchBar() {
  return (
    <div className="justify-center self-start px-4 py-3 mt-3.5 text-base font-medium leading-6 bg-white rounded-lg border border-solid shadow-sm border-neutral-200 text-zinc-500">
      <input label="我的訂單" placeholder="搜尋我的訂單"/>
    </div>
  );
}

function OrderItem({ item }) {
  return (
    <div className="flex flex-col gap-1.5 px-3.5 py-2.5 w-full text-base font-medium rounded-xl bg-neutral-200 max-w-[363px]">
      <div className="flex gap-5 justify-between leading-6 text-black">
        <div className="flex flex-col gap-2 whitespace-nowrap">
          <div className="gap-0">
            訂購社群：{item.community}
            <br />
            訂單編號：{item.orderNumber}
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
      <button className="justify-center self-center px-2 py-1.5 text-center text-white whitespace-nowrap bg-black rounded-lg border border-solid shadow-sm border-neutral-200 leading-[150%]">
        安排出貨
      </button>
    </div>
  );
}

function MyOrder() {
  const orderItems = [
    {
      community: "幸福社區",
      orderNumber: "20020204",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/51be6b88a8b318311a21326cff4c59ffd9f49322796d0384ecddec765edf56c1?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
      imageAlt: "Order item image",
      quantity: 8,
      price: 87,
      total: 900,
    },
  ];

  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
      <div className="flex flex-col gap-5 items-center pb-20 mx-auto w-full bg-white max-w-[480px]">
        <header className="flex flex-col gap-3.5 self-stretch px-8 pt-20 pb-6 w-full whitespace-nowrap bg-yellow-400">
          <div className="flex gap-5 text-3xl text-black">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0985f90a1c268de1453e96392357b86d4e1d1e025d9162ea01e8c89b45c6a4ff?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Icon" className="shrink-0 gap-0 aspect-square w-[35px]" />
            <h1 className="flex-auto gap-0 my-auto">我的訂單</h1>
          </div>
          <SearchBar />
        </header>
        <nav className="flex gap-5 justify-between px-5 text-xl text-center whitespace-nowrap">
          <a href="#" className="gap-0 text-black">
            待出貨
          </a>
          <a href="#" className="gap-0 text-zinc-500">
            已到貨
          </a>
        </nav>
        <main>
          {orderItems.map((item, index) => (
            <OrderItem key={index} item={item} />
          ))}
        </main>
      </div>
    </div>
  );
}

export default MyOrder;