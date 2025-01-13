import React, { useEffect, useState } from 'react';
import './App.css';
import userInfo from './userInfo.json'; // JSON faylini import qilish

function App() {
  const [userData] = useState(userInfo);

  const handleClose = () => {
    window.Telegram.WebApp.close(); // Web App-ni yopish
  };

  return (
    <div className="box">
      <h1>Telegram WebApp</h1>
      {userData ? (
        <div>
          {userData.map((value, inx) => {
            return (
              <div key={inx}>
                <p >{value.id}</p>
                <p >{value.firstName}</p>
                <p >{value.lastName}</p>
                <p >{value.username}</p>
                <p >{value.phoneNumber}</p>
                <p >{value.profilePhotoUrl}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p>Ma'lumotlarni yuklash...</p>
      )}
      <button onClick={handleClose} className="close-btn">Yopish</button>
    </div>
  );
}

export default App;
