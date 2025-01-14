const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const TOKEN = '7680624239:AAEdvqBjVtFCSAU53Sg_Bh1YFJYLVQJ3pNE';
const bot = new TelegramBot(TOKEN, { polling: true });

const baseWebAppUrl = 'https://web-two-nu-45.vercel.app/';
const userInfoPath = path.join(__dirname, 'src', 'userInfo.json');

// /start komandasi uchun ishlovchi
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id; // Foydalanuvchi ID

    if (isUserExists(userId)) {
        // Foydalanuvchi mavjud bo'lsa
        const webAppUrlWithId = `${baseWebAppUrl}/${userId}`;
        bot.sendMessage(chatId, `Salom, ${msg.from.first_name}! Siz allaqachon ro'yxatdan o'tgansiz.`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'WebApp-ga o‘tish',
                            web_app: { url: webAppUrlWithId },
                        },
                    ],
                ],
            },
        });
    } else {
        // Foydalanuvchi mavjud bo'lmasa
        bot.sendMessage(chatId, 'Salom! WebApp ilovangizga kirish uchun telefon raqamingizni yuboring:', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: '📱Telefon raqamni yuborish',
                            request_contact: true,
                        },
                    ],
                ],
                one_time_keyboard: true,
            },
        });
    }
});

bot.on('contact', async (msg) => {
    const chatId = msg.chat.id;

    // Telefon raqam yuborilganini aniq tekshirish
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

            // Profil rasmni olish
            const profilePhotos = await bot.getUserProfilePhotos(chatId, { limit: 1 });

            if (profilePhotos.total_count > 0) {
                const photoId = profilePhotos.photos[0][0].file_id;
                const file = await bot.getFile(photoId);
                const filePath = file.file_path;

                // URL manzilini yaratish
                const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
                userInfo.profilePhotoUrl = fileUrl;
            } else {
                userInfo.profilePhotoUrl = 'https://via.placeholder.com/150/CCCCCC/000000?text=Avatar';
            }

            // Foydalanuvchi ma'lumotlarini saqlash
            saveDataToLocal(userInfo);

            await sendMessage(chatId, `Rahmat, ${first_name}! Telefon raqamingiz qabul qilindi: ${phoneNumber}`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'WebApp-ga o‘tish',
                                web_app: { url: `${webAppUrl}${id}` },
                            },
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

// Foydalanuvchi boshqa xabar yuborsa
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (!msg.contact && msg.text !== '/start') {
        bot.sendMessage(chatId, 'Iltimos, telefon raqamingizni yuborish uchun /start buyrug‘ini yuboring.');
    }
});

// JSON fayldan foydalanuvchilarni o'qish
function getUsersFromFile() {
    if (fs.existsSync(userInfoPath)) {
        const fileData = fs.readFileSync(userInfoPath, 'utf8');
        return JSON.parse(fileData);
    }
    return [];
}

// Foydalanuvchi mavjudligini tekshirish
function isUserExists(userId) {
    const users = getUsersFromFile();
    return users.some(user => user.id === userId);
}

// Foydalanuvchi ma'lumotlarini JSON faylga saqlash
function saveDataToLocal(newUser) {
    const users = getUsersFromFile();

    // Foydalanuvchining mavjudligini tekshirish
    const isUserExists = users.some(user => user.id === newUser.id);

    if (!isUserExists) {
        users.push(newUser);
        fs.writeFileSync(userInfoPath, JSON.stringify(users, null, 2), 'utf8');
        console.log("Foydalanuvchi qo'shildi:", newUser);
    } else {
        console.log("Foydalanuvchi allaqachon mavjud:", newUser);
    }
}



// const TelegramBot = require('node-telegram-bot-api');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

// const TOKEN = '7680624239:AAEdvqBjVtFCSAU53Sg_Bh1YFJYLVQJ3pNE';
// const bot = new TelegramBot(TOKEN, { polling: true });

// const usersData = {};

// // /start komandasi uchun ishlovchi
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;

//     bot.sendMessage(chatId, 'Salom! WebApp ilovangizga kirish uchun telefon raqamingizni yuboring:', {
//         reply_markup: {
//             keyboard: [
//                 [
//                     {
//                         text: '📱Telefon raqamni yuborish',
//                         request_contact: true,
//                     },
//                 ],
//             ],
//             one_time_keyboard: true,
//         },
//     });
// });

// // Foydalanuvchi telefon raqamini yuborganini ishlovchi
// bot.on('contact', async (msg) => {
//     const chatId = msg.chat.id;

//     if (msg.contact && msg.contact.phone_number) {
//         const { first_name, last_name, username, id } = msg.from;
//         const phoneNumber = msg.contact.phone_number;

//         const userInfo = {
//             id,
//             firstName: first_name,
//             lastName: last_name || 'No familya',
//             username: username || 'No username',
//             phoneNumber,
//         };

//         // Profil rasmni olish
//         const profilePhotos = await bot.getUserProfilePhotos(chatId, { limit: 1 });

//         if (profilePhotos.total_count > 0) {
//             const photoId = profilePhotos.photos[0][0].file_id;
//             const file = await bot.getFile(photoId);
//             const filePath = file.file_path;

//             // URL manzilini yaratish
//             const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;

//             // Foydalanuvchi ma'lumotlarini yangilash
//             userInfo.profilePhotoUrl = fileUrl;
//             console.log(userInfo);

//         } else {
//             userInfo.profilePhotoUrl = 'No photo';
//         }

//         // Ma'lumotlarni saqlash
//         saveDataToLocal(userInfo);

//         const webAppUrl = 'https://web-two-nu-45.vercel.app/';
//         bot.sendMessage(chatId, `Rahmat, ${first_name}! Telefon raqamingiz qabul qilindi: ${phoneNumber}`, {
//             reply_markup: {
//                 inline_keyboard: [
//                     [
//                         {
//                             text: 'WebApp-ga o‘tish',
//                             web_app: { url: webAppUrl },
//                         },
//                     ],
//                 ],
//             },
//         });
//     } else {
//         bot.sendMessage(chatId, 'Telefon raqamingizni yuborishda xatolik yuz berdi. Qaytadan urinib ko‘ring.');
//     }
// });

// // Foydalanuvchi boshqa xabar yuborsa
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     if (!usersData[chatId] && msg.text !== '/start') {
//         bot.sendMessage(chatId, 'Iltimos, telefon raqamingizni yuborish uchun /start buyrug‘ini yuboring.');
//     }
// });


// function saveDataToLocal(newUser) {
//     const filePath = path.join(__dirname, 'src', 'userInfo.json');

//     // Agar fayl mavjud bo'lsa, uni o'qing, aks holda yangi array yaratamiz
//     let users = [];
//     if (fs.existsSync(filePath)) {
//         const fileData = fs.readFileSync(filePath, 'utf8');
//         users = JSON.parse(fileData);
//     }

//     // Foydalanuvchining mavjudligini tekshirish
//     const isUserExists = users.some(user => user.id === newUser.id);

//     // Agar foydalanuvchi mavjud bo'lmasa, uni qo'shamiz
//     if (!isUserExists) {
//         users.push(newUser);
//         fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
//         console.log("Foydalanuvchi qo'shildi:", newUser);
//     } else {
//         console.log("Foydalanuvchi allaqachon mavjud:", newUser);
//     }
// }