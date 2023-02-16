require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const schedule = require('node-schedule');

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

    if(await handleNotificationInGivenMinutes(chatID, text))
    {
        return res.send();
    }

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: "Nie rozumiem o co Ci chodzi.." 
     });
     console.log("Not found command!");

    console.log("Return response");
    return res.send();
})

app.listen(process.env.PORT || 5000, async()=>{
    console.log('App running on port ', process.env.PORT || 5000);
    await init();
});

const handleNotificationInGivenMinutes = async (chatID, text) => {
    const regex = /.* za [1-9][0-9]* minut[eęy]?/g;
    if(text.match(regex))
    {
        console.log("I have receied order to remind in specified minutes!");
    
        const minutes = text.match(/\d+/)[0] // "3"
        console.log(minutes);

        //Notification
        const remindContent = text.split('za')[0];
        console.log("Notification content: ", remindContent);
        
        await remindInHowManyMinutes(minutes, chatID, remindContent);
        return true;
    }

    return false;
}

const remindInHowManyMinutes = async (minutes, chatID, text) =>
{
    if(minutes <= 0)
    {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatID,
            text: "Nie mozna ustawic powiadomienia w przeszlosci, wpisz poprawna ilosc minut." 
         });

         console.log("Message error has just been sent!");
         return res.send();
    }

    currDate = new Date();
    console.log("Date of server: " + currDate);

    currDate.setMinutes ( currDate.getMinutes() + 2 );
    
    console.log("Date of remind: ", currDate);

    const job = schedule.scheduleJob(currDate, async function(){
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatID,
            text: text 
         });

        console.log("Remind has just been sent!");
    });

    console.log("Added cron job");
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: "Dodano przypomnienie!" 
     });
};



