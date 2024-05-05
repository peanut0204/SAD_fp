import React from 'react';

function SellerChats() {
  // Placeholder for navigation and state handling
  const contactor = {
    name: "John Doe",
    imageUrl: "https://via.placeholder.com/50"
  };

  // Example messages
  const messages = [
    { id: 1, text: "Hi there! How are you doing today?", sender: "John Doe", time: "2:30 PM" },
    { id: 2, text: "I'm doing great, thanks for asking!", sender: "You", time: "2:31 PM" },
    { id: 3, text: "That's great to hear! I have a question for you...", sender: "John Doe", time: "2:32 PM" },
    { id: 4, text: "Sure, what's your question?", sender: "You", time: "2:33 PM" },
    { id: 5, text: "Can you help me with my project?", sender: "John Doe", time: "2:34 PM" },
    { id: 6, text: "Of course! I'd be happy to help.", sender: "You", time: "2:35 PM" },
    { id: 7, text: "Hi there! How are you doing today?", sender: "John Doe", time: "2:30 PM" },
    { id: 8, text: "I'm doing great, thanks for asking!", sender: "You", time: "2:31 PM" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header style={{ backgroundColor: '#F1BF0F', color: 'black', padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
        <div className="flex items-center">
          <img src={contactor.imageUrl} alt={contactor.name} style={{ width: 50, height: 50, borderRadius: '50%' }} className="mr-3" />
          <div className="font-medium">{contactor.name}</div>
        </div>
      </header>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#f0f0f0' }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end ${message.sender === "You" ? "justify-end" : ""}`}>
            {message.sender !== "You" && (
              <img src={contactor.imageUrl} alt={message.sender} style={{ width: 40, height: 40, borderRadius: '50%' }} className="mr-2" />
            )}
            <div className={`rounded-lg p-3 max-w-[70%] text-sm ${message.sender === "You" ? "bg-black text-white" : "bg-gray-200"}`}>
              <p>{message.text}</p>
              <div className="text-xs mt-1" style={{ color: '#888' }}>{message.time}</div>
            </div>
            {message.sender === "You" && (
              <img src="https://via.placeholder.com/40" alt={message.sender} style={{ width: 40, height: 40, borderRadius: '50%' }} className="ml-2" />
            )}
          </div>
        ))}
      </div>
      {/* Input Area */}
      <div className="bg-gray-100 p-4 flex items-center" style={{ minHeight: '10vh' }}>
        <input
          className="flex-1 mr-4 bg-white border-none focus:ring-0 p-2"
          placeholder="Type your message..."
          type="text"
          style={{ borderRadius: '20px' }}
        />
        <button style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#007BFF', color: 'white' }}>
          Send
        </button>
      </div>
    </div>
  );

}

export default SellerChats;
