import * as React from "react";
import { Link } from "react-router-dom";

function Avatar({ src, alt }) {
    return (
        <img
            loading="lazy"
            src={src}
            alt={alt}
            className="shrink-0 gap-0 w-9 aspect-square"
        />
    );
}
function MessagePreview({ name, message, time, isRead }) {
    return (
        <div style={{ backgroundColor: 'saddlebrown' }}>
            <div className="flex flex-col gap-2.5 pb-3 w-full bg-white">
                {" "}
                <div className="flex gap-5 justify-between mt-2.5">
                    {" "}
                    <div className="flex gap-2 text-base">
                        {" "}
                        <Avatar
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/15a68839383ae7b4bb12a4fe224a6e61eaf5e67a0178d79ab8295c260f69cfec?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&"
                            alt={`${name}'s profile picture`}
                        />{" "}
                        <div
                            className={`flex flex-col ${isRead ? "gap-2.5" : "gap-1.5"} self-start`}
                        >
                            {" "}
                            <div className="gap-0 font-bold text-slate-700">{name}</div>{" "}
                            <div
                                className={`gap-0 ${isRead ? "mt-2.5" : "mt-1.5"} ${isRead ? "text-slate-700" : "text-gray-400"}`}
                            >
                                {" "}
                                {message}{" "}
                            </div>{" "}
                        </div>{" "}
                    </div>{" "}
                    <div className="gap-0 my-auto text-xs font-medium text-right text-slate-400">
                        {" "}
                        {time}{" "}
                    </div>{" "}
                </div>{" "}
            </div>
        </div>
    );
}
const messages = [
    {
        id: 1,
        name: "Willie Tanner",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: true,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/15a68839383ae7b4bb12a4fe224a6e61eaf5e67a0178d79ab8295c260f69cfec?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 2,
        name: "Lynn Tanner",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: false,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/e321998b8c5e5dd76ddde844f0ab874a4275dc7f972e52a2e148081c2404870b?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 3,
        name: "Col. Roderick Decker",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: true,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/1eb2ef5c4147d55f2e80308864a8860c0e75883fd9387519516c5ea374ef346f?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 4,
        name: "Dr. Bonnie Barstow",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: false,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/864a01dedd316bc00840f5104e98646ca047a6be610c2d15cf08bbfbf8939208?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 5,
        name: "Murdock",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: false,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/f329958ed077536655f800af907fa1a6fbf55e18dc03994a30a69a6ed5f0d27d?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 6,
        name: "Capt. Trunk",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: false,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/6950f68c28551ce683272d58eb1952a204f90d5e2b860d56c548b1c8885bf5f7?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 7,
        name: "Tony Danza",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: false,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/bd65c4ac269f2b6c22537e90795774e442c7d94a425e8332d18f7bdf528096cf?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 8,
        name: "Jonathan Higgins",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: true,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/92a790a982e16d4d7da2ca85e325c0b41e4ed579b74519a902309522f4d5e036?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 9,
        name: "Devon Miles",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: true,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/a2c31f5d0631132245c446a8cb469c671ff90b63ac21f7b42e83f284b42ac17d?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 10,
        name: "Devon Miles",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: false,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/a3a3d5feb02fdd64305ed081372e223db4501b663741d7670da2ec9f6e3778f4?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
    {
        id: 11,
        name: "Michael Knight",
        message: "The message goes here.....",
        time: "04:00 PM",
        isRead: true,
        avatarSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/ceff63e104f6c397603ebb550c4390542de8d38e2d11b09180f5a2919a18f559?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&",
    },
];
function SellerChats() {
    return (
        <div className="flex flex-col gap-0 pb-20 mx-auto w-full bg-white max-w-[480px]">
            {" "}
            <header className="flex gap-5 items-start px-4 pt-20 pb-4 w-full text-3xl bg-yellow-400">
                <button>
                    <a href="../SellerOffice/1">
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0985f90a1c268de1453e96392357b86d4e1d1e025d9162ea01e8c89b45c6a4ff?apiKey=96372eeb149147dbb6ed64bcf7ffb73b&" alt="Search icon" className="shrink-0 gap-0 aspect-square w-[35px]" />
                    </a>
                </button>
                <h1 className="flex-auto">與買家聊聊</h1>
            </header>
            <main className="flex z-10 flex-col gap-0 justify-end pt-6 pr-6 pl-2.5 -mt-5 w-full">
                {" "}
                {messages.map((message) => (
                    <MessagePreview
                        key={message.id}
                        name={message.name}
                        message={message.message}
                        time={message.time}
                        isRead={message.isRead}
                    />
                ))}{" "}
            </main>{" "}
        </div>
    );
}

export default SellerChats;
