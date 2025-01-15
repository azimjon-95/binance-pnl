import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import userInfo from './userInfo.json';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const initDataUnsafe = tg.initDataUnsafe || {};
    setUserData(initDataUnsafe.user || {});

    const pathId = window.location.pathname.split('/')[1];
    if (pathId) setUserId(pathId);

    setLoading(false);

    return () => {
      tg.close();
    };
  }, []);

  const handleClose = () => {
    window.Telegram.WebApp.close();
  };

  const filteredUserData = useMemo(() => {
    return userInfo.filter(user => user.id === userId);
  }, [userId]);

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/user/${userId}`);
      if (response.status === 200) {
        setUserId(null);
        alert('Foydalanuvchi muvaffaqiyatli o‘chirildi.');
      } else {
        alert('Foydalanuvchini o‘chirishda xatolik yuz berdi.');
      }
    } catch (error) {
      alert('Server bilan ulanishda xatolik.');
    }
  };

  const renderUserData = () => {
    if (loading) return <p>Ma'lumotlarni yuklash...</p>;
    if (!filteredUserData?.length) return <p>Foydalanuvchi topilmadi.</p>;

    return filteredUserData.map((user, index) => {
      const userInfoArray = [
        { label: 'Ism', value: `${user.firstName} ${user.lastName}` },
        { label: 'Foydalanuvchi nomi', value: user.username },
        { label: 'Telefon raqami', value: user.phoneNumber },
        {
          label: 'Profil rasm',
          value: (
            <img
              src={
                user.profilePhotoUrl === 'No photo'
                  ? 'https://cdn-icons-png.flaticon.com/128/3940/3940417.png'
                  : user.profilePhotoUrl
              }
              alt="Profile"
              width="100"
            />
          ),
        },
      ];

      return (
        <div key={index} className="user-card">
          {userInfoArray.map((item, idx) => (
            <p key={idx}>
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
      );
    });
  };

  if (!window.Telegram?.WebApp) {
    return (
      <div className="box">
        <h1>Telegram WebApp</h1>
        <p>Ushbu dastur faqat Telegram WebApp sifatida ishlaydi.</p>
        <a
          href="https://t.me/YOUR_TELEGRAM_BOT_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-btn"
        >
          Telegram botga o'tish
        </a>
      </div>
    );
  }

  return (
    <div className="box">
      <h1>Telegram WebApp</h1>
      {userId && <p>User ID: {userId}</p>}
      <div className="user-list">{renderUserData()}</div>
      <button onClick={handleLogout} className="close-btn">
        Logout
      </button>
      <button onClick={handleClose} className="close-btn">
        Botdan chiqish
      </button>
    </div>
  );
}

export default App;
