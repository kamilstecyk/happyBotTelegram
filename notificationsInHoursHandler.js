require('dotenv').config();
const schedule = require('node-schedule');
const axios = require('axios');
const { TELEGRAM_API } = require('./config');


const handleNotificationInGivenHours = async (chatID, text) => {
    const regex = /.* za [1-9][0-9]* godzin[eęy]?/gi;
    if(text.match(regex))
    {
        try{

            console.log("I have receied order to remind in specified hours!");
            const timeRegex = /za [1-9][0-9]* godzin[eęy]?/gi;
            timeMatches = text.match(timeRegex);
            console.log(timeMatches);
            const hours = timeMatches[0].match(/\d+/)[0];
            console.log(hours);

            //Notification content
            //Remove regexp for specifying time of remind
            remindContent = text.replace(timeRegex, ''); 
            console.log("Notification content: ", remindContent);
            
            await remindInHowManyHours(hours, chatID, remindContent);
            return true;
        }
        catch(error){
            console.log(error);
        }
    }

    return false;
}

const remindInHowManyHours = async (hours, chatID, text) =>
{
    if(hours <= 0)
    {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatID,
            text: "Nie mozna ustawic powiadomienia w przeszlosci, wpisz poprawna ilosc godzin." 
         });

         console.log("Message error has just been sent!");
         return;
    }

    currDate = new Date();
    console.log("Date of server: " + currDate);

    console.log("Add hours: ", parseInt(hours));
    currDate.setHours( currDate.getHours() + parseInt(hours) );
    
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

module.exports = handleNotificationInGivenHours;