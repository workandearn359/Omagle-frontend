import React, { useState } from 'react';
import Home from './components/Home';
import ChatApp from './components/ChatApp';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <div className="App">
      {userInfo ? (
        <ChatApp mood={userInfo.mood} interests={userInfo.interests} />
      ) : (
        <Home onSubmit={setUserInfo} />
      )}
    </div>
  );
}

export default App;
