require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const handleNotificationInGivenMinutes = require('./notificationsInMinutesHandler');
const handleNotificationInGivenHours = require('./notificationsInHoursHandler');
const handleNotificationInGivenDays = require('./notificationsInDaysHandler');
const handleNotificationInGivenDaysAndSpecifiedTime = require('./notificationsInDaysAndSpecifiedTimeHandler');
const handleNotificationTodayAtSpecifiedTime = require('./notificationsTodayAtSpecifiedTimeHandler');
const getJoke = require('./jokesHandler');
const { TELEGRAM_API, WEBHOOK_URL, URI } = require('./config');

const app = express();

app.use(bodyParser.json());

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log("WebHook: ", WEBHOOK_URL);
    console.log(res.data);
};

//TODO 
// setting reminders at exact time
// setting reminders at exact date

app.post(URI, async (req,res) => {

    const chatID = req.body.message.chat.id;
    const text = req.body.message.text;
    console.log("Received message: ", text);

    if(text.toLowerCase()  === "pomoc"){
        const messageContent = `Polecenia, które na razie rozumiem :)) 
            - Przypomnienie za daną ilość minut
            - Przypomnienie za daną ilość godzin
            - Przypomnienie za daną ilość dni
            - Przypomnienie za daną ilość dni o danej godzinie
            - Przypomnienie w obecnym dniu o danej godzinie
            - Odpowiedź na tajemnicze pytanie kim jest Maksiu?
            - Opowiedz dowcip/żart ( po angielsku )

        Śmiało zadawaj mi polecenia, w miarę możliwości postaram się je wykonać. Jeśli mi się uda to będę happy :))
        `;

        sendMessageToTelegramUser(chatID, messageContent);
        return res.send();
    }

    else if(text.toLowerCase() === ( "opowiedz dowcip" || "opowiedz żart" )){
        const data = await getJoke();
            
        console.log(data.question);
        console.log(data.answer);

        const jokeContent = data.question + "\n" + "- " + data.answer;
        sendMessageToTelegramUser(chatID, jokeContent);
        return res.send();
    }

    else if(text.toLowerCase() === "kim jest maksiu?"){
        sendMessageToTelegramUser(chatID, "Jest stópkarzem :o");
        return res.send();
    }

    else if(await handleNotificationInGivenMinutes(chatID, text)){
        return res.send();
    }

    else if(await handleNotificationInGivenHours(chatID, text)){
        return res.send();
    }

    else if(await handleNotificationInGivenDaysAndSpecifiedTime(chatID, text)){
        return res.send();
    }

    else if(await handleNotificationInGivenDays(chatID, text)){
        return res.send();
    }

    else if(await handleNotificationTodayAtSpecifiedTime(chatID, text)){
        return res.send();
    }

    sendMessageToTelegramUser(chatID, "Nie rozumiem o co Ci chodzi...");
    console.log("Not found command!");

    console.log("Return response");
    return res.send();
})

app.listen(process.env.PORT || 5000, async()=>{
    console.log('App running on port ', process.env.PORT || 5000);
    await init();
});

const sendMessageToTelegramUser = async (chatID, content) => {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: content 
     });
     console.log("Send message to user!");
}




