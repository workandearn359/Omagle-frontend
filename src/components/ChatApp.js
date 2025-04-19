import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import BounceLoader from "react-spinners/BounceLoader";

const socket = io(process.env.REACT_APP_BACKEND_URL);

function ChatApp({ mood, interests }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [partnerId, setPartnerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.emit("find_partner", { mood, interests });

    socket.on("waiting", () => setIsLoading(true));
    socket.on("match", ({ partnerId }) => {
      setPartnerId(partnerId);
      setIsLoading(false);
      setMessages([]);
    });

    socket.on("chat_message", ({ from, message }) => {
      setMessages(prev => [...prev, { from, text: message }]);
    });

    socket.on("stranger_disconnected", () => {
      setPartnerId(null);
      setIsLoading(true);
      socket.emit("find_partner", { mood, interests });
    });

    return () => {
      socket.off("waiting");
      socket.off("match");
      socket.off("chat_message");
      socket.off("stranger_disconnected");
    };
  }, [mood, interests]);

  const sendMessage = () => {
    if (input && partnerId) {
      socket.emit("chat_message", { to: partnerId, message: input });
      setMessages(prev => [...prev, { from: "me", text: input }]);
      setInput('');
    }
  };

  const nextPartner = () => {
    socket.emit("next");
    setIsLoading(true);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      {isLoading ? (
        <BounceLoader color="#36D7B7" />
      ) : (
        <>
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.from === "me" ? "my-msg" : "their-msg"}>
                {msg.text}
              </div>
            ))}
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} />
          <div className="buttons">
            <button onClick={sendMessage}>Send</button>
            <button onClick={nextPartner}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatApp;
