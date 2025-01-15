import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import userInfo from './userInfo.json';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState(null); // Initialize with stored userId if available

  useEffect(() => {
    const pathId = window.location.pathname.split('/')[1];
    setUserId(pathId);
  }, []); // This runs only once when the component mounts

  console.log(window);

  // Use useMemo to optimize filtering
  const filteredUserData = useMemo(() => {
    return userInfo.filter(user => user.id == userId);
  }, [userId]); // Recalculate only when userId changes

  const renderUserData = () => {
    if (!filteredUserData?.length) return <p>Ma'lumotlarni yuklash...</p>;

    return filteredUserData.map((user, index) => {
      const userInfoArray = [
        { label: 'Ism', value: `${user.firstName} ${user.lastName}` },
        { label: 'Foydalanuvchi nomi', value: user.username },
        { label: 'Telefon raqami', value: user.phoneNumber },
        {
          label: 'Profil rasm',
          value: (
            <img
              src={user.profilePhotoUrl === "No photo" ? 'https://cdn-icons-png.flaticon.com/128/3940/3940417.png' : user.profilePhotoUrl}
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


  const handleLogout = async (id) => {
    try {
      // Foydalanuvchi ma'lumotlarini serverdan o'chirish uchun so'rov yuboriladi
      const response = await axios.delete(`http://localhost:5000/api/user/${id}`);

      if (response.status === 200) {
        // userId holatini tozalash
        setUserId(null);
      } else {
        alert('Foydalanuvchi ma’lumotlarini o‘chirishda xatolik yuz berdi');
      }
    } catch (error) {
      alert('Server bilan ulanishda xatolik');
    }
  };


  if (!userId) {
    // Agar userId mavjud bo'lmasa, foydalanuvchiga xato xabari ko'rsatiladi
    return (
      <div className="box">
        <h1>Telegram WebApp</h1>
        <p>Ushbu dastur faqat Telegram WebApp sifatida ishlaydi va browzer tomonidan qo'llab-quvvatlanmaydi. Iltimos, botga Telegram orqali kiring.</p>
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
      <p>User ID: {userId}</p> {/* Display the extracted user ID */}
      <div className="user-list">{renderUserData()}</div>
      <button onClick={handleLogout} className="close-btn">Logout</button>
    </div>
  );
}

export default App;

