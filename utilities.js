var fs = require('fs');

var exports = module.exports = {};

exports.getMessageUserFirstName = function(users, message, callback) {
	for(const u of users) {
		if(u.id === message.user) {
			callback(null, u.profile.first_name);
			return;
		}
	}
	callback("User not found");
}


exports.readFile = function(filename, callback) {
    var buffer = fs.readFileSync(filename);

    if(buffer == null) {
        callback("File " + filename + " was not read");
    }

    callback(null, buffer.toString());
}
