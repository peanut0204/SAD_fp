import * as React from "react";

function SearchBar() {
  return (
    <div className="flex gap-5 items-start px-8 pt-20 pb-3.5 w-full text-3xl text-black whitespace-nowrap bg-yellow-400">
      <button>
        <a href="../SellerOffice/1">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0985f90a1c268de1453e96392357b86d4e1d1e025d9162ea01e8c89b45c6a4ff?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Search icon" className="shrink-0 gap-0 aspect-square w-[35px]" />
        </a>
      </button>
      <h1 className="flex-auto gap-0">搜尋社群</h1>
    </div>
  );
}

function SearchButton() {
  const Search = ({ search, setInput }) => {
    const inputHandler = (e) => {
      setInput(e.target.value);
    };
  }
  return (
    <div className="search">
      <input className="input" onChange={inputHandler} type="text" />
      {/* <button onClick={search}>Search</button> */}
      <button className="justify-center self-center px-4 py-3 text-base font-medium leading-6 whitespace-nowrap bg-white rounded-lg border-2 border-solid border-neutral-200 text-zinc-500">
        搜尋社群
      </button>
    </div>
  );
}

function CommunityCard({ image, title, location, members, lastUpdate }) {
  return (
    <article>
      <div className="flex overflow-hidden relative flex-col gap-0 justify-center self-center mt-5 ml-0 w-full rounded-lg aspect-[2.32]">
        <img loading="lazy" src={image.background} alt="" className="object-cover absolute inset-0 size-full" />
        <img loading="lazy" src={image.foreground} alt={title} className="gap-0 w-full aspect-[2.33]" />
      </div>
      <div className="gap-0 text-xl font-medium leading-8 text-black">
        {title}
        <br />
        <span className="text-base leading-6">{location}</span>
        <br />
        <span className="text-base leading-6">
          {members} members, last update : {lastUpdate}
        </span>
      </div>
    </article>
  );
}

function SellerSearchGroup() {
  const communities = [
    {
      image: {
        background: "https://cdn.builder.io/api/v1/image/assets/TEMP/9db8b4fbf44f95387613cc105adf9685967112ecffdeddeef8678a34b3f80d5f?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
        foreground: "https://cdn.builder.io/api/v1/image/assets/TEMP/ff59ae15c124d71eb15608143506e93e95b30ed14202a17c41c660c9e76ac8cf?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
      },
      title: "幸福社區團購團",
      location: "Taipei",
      members: 434,
      lastUpdate: "1 week ago",
    },
    {
      image: {
        background: "https://cdn.builder.io/api/v1/image/assets/TEMP/1600b62ad4d2c533195b7e64e5992c3fa18f06f3a9346300f41cdf2a8457dd39?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
        foreground: "https://cdn.builder.io/api/v1/image/assets/TEMP/209e69dd63ab7878afea38ea9c3222ee4bd57bdd9f6f9c4252a84de4fa85c973?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
      },
      title: "黑皮高中團購團",
      location: "Taipei", 
      members: 434,
      lastUpdate: "1 week ago",
    },
  ];

  return (
    <div style={{ backgroundColor: 'saddlebrown'}}>
      <main className="flex flex-col gap-5 pb-20 mx-auto w-full bg-white max-w-[480px]">
        <SearchBar />
        <section className="flex flex-col gap-0 px-6 mt-6 w-full">
          <SearchButton />
          <h2 className="gap-0 mt-6 text-xl text-black">搜尋社群結果</h2>
          {communities.map((community, index) => (
            <CommunityCard key={index} {...community} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default SellerSearchGroup;