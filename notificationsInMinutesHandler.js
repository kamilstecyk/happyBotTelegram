require('dotenv').config();
const schedule = require('node-schedule');
const axios = require('axios');
const { TELEGRAM_API } = require('./config');


const handleNotificationInGivenMinutes = async (chatID, text) => {
    const regex = /.* za [1-9][0-9]* minut[eęy]?/gi;
    if(text.match(regex))
    {
        try{

            console.log("I have receied order to remind in specified minutes!");
            const timeRegex = /za [1-9][0-9]* minut[eęy]?/gi;
            timeMatches = text.match(timeRegex);
            console.log(timeMatches);
            const minutes = timeMatches[0].match(/\d+/)[0];
            console.log(minutes);

            //Notification content
            //Remove regexp for specifying time of remind
            remindContent = text.replace(timeRegex, ''); 
            console.log("Notification content: ", remindContent);
            
            await remindInHowManyMinutes(minutes, chatID, remindContent);
            return true;
        }
        catch(error){
            console.log(error);
        }
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
         return;
    }

    currDate = new Date();
    console.log("Date of server: " + currDate);

    currDate.setMinutes ( currDate.getMinutes() + parseInt(minutes) );
    
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

module.exports = handleNotificationInGivenMinutes;