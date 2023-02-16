require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const {TOKEN, SERVER_URL} = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();

app.use(bodyParser.json());

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log("WebHook: ", WEBHOOK_URL);
    console.log(res.data);
};

app.post(URI, async (req,res) => {

    const chatID = req.body.message.chat.id;
    const text = req.body.message.text;
    console.log(text);

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
       chat_id: chatID,
       text: text 
    });

    console.log("Message has just been sent!");

    return res.send();
})

app.listen(process.env.PORT || 5000, async()=>{
    console.log('App running on port ', process.env.PORT || 5000);
    await init();
});





