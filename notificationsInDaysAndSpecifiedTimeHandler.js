require('dotenv').config();
const schedule = require('node-schedule');
const axios = require('axios');
const { TELEGRAM_API } = require('./config');


const handleNotificationInGivenDaysAndSpecifiedTime = async (chatID, text) => {
    const regex = /.* za [1-9][0-9]* d(zień|ni){1} o [0-9]{2}:[0-9]{2}/gi;
    if(text.match(regex))
    {
        try{

            console.log("I have receied order to remind in specified days as specified time!");
            const timeRegex = /za [1-9][0-9]* d(zień|ni){1} o [0-9]{2}:[0-9]{2}/gi;
            timeMatches = text.match(timeRegex);
            console.log(timeMatches);

            //DayPart
            dayRegexp = /za [1-9][0-9]* d(zień|ni){1}/gi;
            const daysMatch = timeMatches[0].match(dayRegexp);

            const days = daysMatch[0].match(/\d+/)[0];
            console.log(days);

            //Hour part
            hourRegexp = /[0-9]{2}:[0-9]{2}/gi;
            const hourMatch = timeMatches[0].match(hourRegexp)[0];
            console.log(hourMatch);
            splittedHour = hourMatch.split(':');
            console.log("Time of remind: ");
            console.log(splittedHour);

            //Notification content
            //Remove regexp for specifying time of remind
            remindContent = text.replace(timeRegex, ''); 
            console.log("Notification content: ", remindContent);
            
            await remindInHowManyDaysAtHour(days, splittedHour[0], splittedHour[1], chatID, remindContent);
            return true;
        }
        catch(error){
            console.log(error);
        }
    }

    return false;
}

const remindInHowManyDaysAtHour = async (days,hour, minutes, chatID, text) =>
{
    if(days <= 0)
    {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatID,
            text: "Nie mozna ustawic powiadomienia w przeszlosci, wpisz poprawna ilosc dni." 
         });

         console.log("Message error has just been sent!");
         return;
    }

    currDate = new Date();
    console.log("Date of server: " + currDate);

    console.log("Add days: ", parseInt(days));
    currDate.setDate( currDate.getDate() + parseInt(days) );
    currDate.setHours( parseInt(hour) );
    currDate.setMinutes( parseInt(minutes) );
    currDate.setSeconds( 0 );
    
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

module.exports = handleNotificationInGivenDaysAndSpecifiedTime;