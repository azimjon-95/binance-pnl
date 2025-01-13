const TelegramBot = require('node-telegram-bot-api');

// Bot tokenini bu yerga joylashtiring
const TOKEN = '7680624239:AAEdvqBjVtFCSAU53Sg_Bh1YFJYLVQJ3pNE';

// Botni yaratish
const bot = new TelegramBot(TOKEN, { polling: true });

// /start komandasi uchun ishlovchi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // WebApp URL
    const webAppUrl = 'https://web-two-nu-45.vercel.app/';

    // WebApp tugmasini yuborish
    bot.sendMessage(chatId, 'Salom! WebApp ilovangizga kirish uchun quyidagi tugmani bosing:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'WebApp-ga o‘tish',
                        web_app: { url: webAppUrl },
                    },
                ],
            ],
        },
    });
});

// Foydalanuvchi bilan yozishmalarni ishlovchi
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text !== '/start') {
        bot.sendMessage(chatId, 'Ilovadan foydalanish uchun /start buyrug‘ini yuboring.');
    }
});

console.log('Bot ishga tushdi!');
