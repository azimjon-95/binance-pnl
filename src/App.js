import React, { useEffect, useState } from 'react';
import './App.css';
import userInfo from './userInfo.json';

function App() {
  const storedUserId = localStorage.getItem('userId');
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(storedUserId || null); // Initialize with stored userId if available

  useEffect(() => {
    const pathId = window.location.pathname.split('/')[1];
    if (pathId !== storedUserId) {
      setUserId(pathId);
      localStorage.setItem('userId', pathId);
      setUserData(userInfo.filter(user => user.id === pathId));
    }
  }, [storedUserId, userInfo]);

  const handleClose = () => {
    window.Telegram.WebApp.close(); // Web App-ni yopish
  };

  const renderUserData = () => {
    // if (!userData?.length) return <p>Ma'lumotlarni yuklash...</p>;

    return userData.map((user, index) => {
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

  return (
    <div className="box">
      <h1>Telegram WebApp</h1>
      <p>User ID: {userId}</p> {/* Display the extracted user ID */}
      <div className="user-list">{renderUserData()}</div>
      <button onClick={handleClose} className="close-btn">Yopish</button>
    </div>
  );
}

export default App;

