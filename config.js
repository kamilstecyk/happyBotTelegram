require('dotenv').config();

const {TOKEN, SERVER_URL} = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

exports.TELEGRAM_API = TELEGRAM_API;
exports.WEBHOOK_URL = WEBHOOK_URL;
exports.URI = URI;