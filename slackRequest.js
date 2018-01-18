var request = require('request');
var WebClient = require('@slack/client').WebClient;

var exports = module.exports = {};

exports.postMessageWithAttachments = function(token, channel, message, attachments, callback) {
	console.log("Sending request");
	var path_to_call = 'https://slack.com/api/chat.postMessage?token=' + token 
							+ '&channel=' + channel 
							+ '&text=' + message
							+ '&as-user=false'
							+ '&attachments=' + attachments;
	console.log(path_to_call);
	request(path_to_call, function(err, response, body) {
		if(err)
			callback(err);
		else
			callback(null, body);
	});
}

exports.getUserId = function(token, name, callback) {
	var userId;
	web = new WebClient(token);

	web.users.list(function(err, res) {
		for(var i in res.members) {
			if(res.members[i].name === name) { userId = res.members[i].id}
		}
		callback(userId);
	});
}

exports.getDMID = function(token, userId, callback) {
	var userChannel;
	web = new WebClient(token);

	web.im.open(userId, function(err, res) {
		userChannel = res.channel.id;

		callback(userChannel);
	});
}