import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  // Telegram WebApp ma'lumotlarini olish
  useEffect(() => {
    const tg = window.Telegram?.WebApp; // Telegram WebApp API
    if (tg) {
      tg.ready(); // WebApp tayyorlash
      const initDataUnsafe = tg.initDataUnsafe || {};
      const user = initDataUnsafe.user || {};
      console.log("Telegram user data:", user); // Ma'lumotlarni konsolga chiqarish
      setUserData(user);
    } else {
      console.error("Telegram WebApp API ishlamayapti!");
    }
  }, []);

  const handleClose = () => {
    window.Telegram.WebApp.close(); // Web App-ni yopish
  };

  return (
    <div className="box">
      <h1>Telegram WebApp</h1>
      {userData ? (
        <div>
          <p><strong>Ism:</strong> {userData.first_name} {userData.last_name}</p>
          <p><strong>Foydalanuvchi nomi:</strong> {userData.username}</p>
        </div>
      ) : (
        <p>Telegram ma'lumotlarini yuklash...</p>
      )}
      <button onClick={handleClose} className="close-btn">Yopish</button>
    </div>
  );
}

export default App;
