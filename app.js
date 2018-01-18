var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var msgProcessor = require('./messageProcessor.js');
var actionRunner = require('./actionRunner.js');

var token = process.env.BOT_ACCESS_TOKEN;
var rtm = new RtmClient(token);

var startBot = function() {
	var channels = [];
	let users;
	let self_id;

	// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
		users = rtmStartData.users;
		self_id = rtmStartData.self.id;

		for (const c of rtmStartData.channels) {
			if (c.is_member) { 
				channels.push(c.id); 
			}
		}
	});

	rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
		console.log("message received");
		console.log(message);
		msgProcessor.processMessage(message, users, self_id, function(err, action, response) {
			if(err) {
				console.log("ERROR: " + err);
				sendBotMessage(response);
			}
			else {
				sendBotMessage(response);
				if(action) {
					console.log("attempting action " + action.script);
					actionRunner.takeAction(action, function(err, response) {
						if(err) { console.log(err); }
						sendBotMessage(response);
					});
				}
			}
		});
	});


	rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
	  	console.log("Connected to slack");
	});

	rtm.start();
}

var sendBotMessage = function(response) {
	console.log("sending message");
	console.log(response);
	rtm.sendMessage(response.text, response.channel);
}


startBot();

/*
var IncomingWebhook = require('@slack/client').IncomingWebhook;
var url = process.env.SLACK_WEBHOOK_URL;

var webhook = new IncomingWebhook(url);

webhook.send('Hello there', function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});
*/