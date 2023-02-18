const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://official-joke-api.appspot.com/random_joke',
  params: {
  },
  headers: {
    "Content-type": "application/json",
  }
};

const getJoke = async () =>  {
    let data;
    await axios.request(options).then(function (response) {
	    // console.log(response.data);
        data = response.data;
    }).catch(function (error) {
        console.error(error);
    });
    return { question: data.setup, answer: data.punchline };
}

module.exports = getJoke;