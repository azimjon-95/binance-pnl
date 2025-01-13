const TelegramBot = require('node-telegram-bot-api');

// Bot tokenini bu yerga joylashtiring
const TOKEN = 'YOUR_BOT_API_TOKEN';

// Botni yaratish
const bot = new TelegramBot(TOKEN, { polling: true });

// /start komandasi uchun ishlovchi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Havola yaratish
    const webAppUrl = 'https://your-webapp-url.com';
    const message = `
        Salom, ushbu tugmani bosib WebApp-ga o'ting:
        [Ochilishi uchun bosing](${webAppUrl})
    `;

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Foydalanuvchi bilan yozishmalarni ishlovchi
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text !== '/start') {
        bot.sendMessage(chatId, 'Ilovadan foydalanish uchun /start buyrug\'ini yuboring.');
    }
});

console.log('Bot ishga tushdi!');
