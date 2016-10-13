const Botkit = require('botkit')
const {
  Wit,
  log
} = require('node-wit');


const slackToken = process.env.SLACK_TOKEN

const sessionId = 'my-user-session-42';
const context0 = {};

const client = new Wit({
  accessToken: process.env.WIT_TOKEN,
  actions: {
    send(request, response) {
      return new Promise(function(resolve, reject) {
        console.log("the stringified response is ", JSON.stringify(response));
        return resolve();
      });
    },
  },
  logger: new log.Logger(log.DEBUG)
});

var controller = Botkit.slackbot({
  debug: false,
});

var bot = controller.spawn({
  token: slackToken
}).startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error('Error connecting to slack: ', err)
  }
  console.log('Connected to slack');
});


controller.hears('.*', 'direct_message,direct_mention', function(bot, input) {
  client.converse(sessionId, input.text,{})
    .then((data) => {
      console.log("the data is ", data);
      bot.reply(input, data.msg);
    })
    .catch((reason) => {
      console.log("the reason for failing is ", reason);
      bot.reply(input, "Here I am, brain the size of a planet, and they ask me to talk to you.. ")
    })
});
