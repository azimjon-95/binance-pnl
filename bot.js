const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Asosiy o'zgaruvchilar
const PORT = 5000;
const TOKEN = '7680624239:AAEdvqBjVtFCSAU53Sg_Bh1YFJYLVQJ3pNE';
const baseWebAppUrl = 'https://web-two-nu-45.vercel.app/';
const userInfoPath = path.join(__dirname, 'src', 'userInfo.json');

// Express ilovasini sozlash
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Telegram bot sozlamalari
const bot = new TelegramBot(TOKEN, { polling: true });

// --- Telegram bot ishlov berishlari ---
// /start komandasi uchun ishlov beruvchi
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (isUserExists(userId)) {
        const webAppUrlWithId = `${baseWebAppUrl}/${userId}`;
        bot.sendMessage(chatId, `Salom, ${msg.from.first_name}! Siz allaqachon ro'yxatdan o'tgansiz.`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'WebApp-ga o‘tish', web_app: { url: webAppUrlWithId } },
                    ],
                ],
            },
        });
    } else {
        bot.sendMessage(chatId, 'Salom! WebApp ilovangizga kirish uchun telefon raqamingizni yuboring:', {
            reply_markup: {
                keyboard: [
                    [
                        { text: '📱Telefon raqamni yuborish', request_contact: true },
                    ],
                ],
                one_time_keyboard: true,
            },
        });
    }
});

// Telefon raqam yuborilganda ishlov beruvchi
bot.on('contact', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.contact && msg.contact.user_id === msg.from.id) {
        try {
            const { first_name, last_name, username, id } = msg.from;
            const phoneNumber = msg.contact.phone_number;

            const userInfo = {
                id,
                firstName: first_name,
                lastName: last_name || 'No familya',
                username: username || 'No username',
                phoneNumber,
            };

            const profilePhotos = await bot.getUserProfilePhotos(chatId, { limit: 1 });

            if (profilePhotos.total_count > 0) {
                const photoId = profilePhotos.photos[0][0].file_id;
                const file = await bot.getFile(photoId);
                userInfo.profilePhotoUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
            } else {
                userInfo.profilePhotoUrl = 'https://via.placeholder.com/150/CCCCCC/000000?text=Avatar';
            }

            saveDataToLocal(userInfo);

            bot.sendMessage(chatId, `Rahmat, ${first_name}! Telefon raqamingiz qabul qilindi: ${phoneNumber}`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'WebApp-ga o‘tish', web_app: { url: `${baseWebAppUrl}${id}` } },
                        ],
                    ],
                },
            });
        } catch (error) {
            console.error('Xato yuz berdi:', error.message);
            bot.sendMessage(chatId, 'Xatolik yuz berdi, iltimos qayta urinib ko‘ring.');
        }
    } else {
        bot.sendMessage(chatId, 'Telefon raqamingizni yuborishda xatolik yuz berdi. Qaytadan urinib ko‘ring.');
    }
});

// Boshqa xabarlarni qayta ishlash
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (!msg.contact && msg.text !== '/start') {
        bot.sendMessage(chatId, 'Iltimos, telefon raqamingizni yuborish uchun /start buyrug‘ini yuboring.');
    }
});

// --- Yordamchi funksiyalar ---
function getUsersFromFile() {
    if (fs.existsSync(userInfoPath)) {
        const fileData = fs.readFileSync(userInfoPath, 'utf8');
        return JSON.parse(fileData);
    }
    return [];
}

function isUserExists(userId) {
    const users = getUsersFromFile();
    return users.some(user => user.id === userId);
}

function saveDataToLocal(newUser) {
    const users = getUsersFromFile();

    if (!users.some(user => user.id === newUser.id)) {
        users.push(newUser);
        fs.writeFileSync(userInfoPath, JSON.stringify(users, null, 2), 'utf8');
        console.log("Foydalanuvchi qo'shildi:", newUser);
    } else {
        console.log("Foydalanuvchi allaqachon mavjud:", newUser);
    }
}

// --- API yo'llari ---
// Foydalanuvchini o'chirish
app.delete('/api/users/:id', (req, res) => {
    const userId = req.body;

    fs.readFile(userInfoPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read user data' });
        }

        const users = JSON.parse(data);
        const updatedUsers = users.filter(user => user.id !== userId);

        fs.writeFile(userInfoPath, JSON.stringify(updatedUsers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update user data' });
            }

            res.status(200).json({ message: 'User deleted successfully' });
        });
    });
});

// --- Serverni ishga tushirish ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
