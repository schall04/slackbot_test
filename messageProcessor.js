var utilities = require('./utilities.js');

var exports = module.exports = {};

exports.processMessage = function(message, users, self_id, callback) {
    console.log("processing message....");
    if(message.user === self_id) {
        return;
    }
    if(!message.text.includes('<@' + self_id + '>')) {
        /*
        suiteMention(message, false, function(err, response) {
            if(err) {
                callback(null, null, err);
            }
            else {
                callback(null, null, response);
            }
        });
        */
    }
    else if(message.text.toUpperCase().includes('SUITES')) {
		suites(message, users, function(err, response) {
            if(err) {
                callback(err, null, error(message.channel));
                return;
            }
            else {
                callback(null, null, response);
            }
        });
    }
    else if(message.text.toUpperCase().includes('RUN') || 
        message.text.toUpperCase().includes('EXECUTE') ||
        message.text.toUpperCase().includes('START')) {
        
        runSuite(message, function(err, action, response) {
            if(err) {
                callback(err, null, error(message.channel));
                return;
            }
            else {
                callback(null, action, response);
            }
        });
    }
    else if(message.text.toUpperCase().includes('HI')) {
        welcome(message, function(err, response) {
            callback(null, null, response);
        });
    }
    else if(message.text.toUpperCase().includes('HELP')) {
        help(message, function(err, response) {
            callback(null, null, response);
        });
    }
    else {
        suiteMention(message, true, function(err, response) {
            if(err) {
                callback(null, null, err);
            }
            else {
                callback(null, null, response);
            }
        });
    }
}

var suites = function(message, users, callback) {
    console.log("suites request detected");
    var response = {};

    utilities.getMessageUserFirstName(users, message, function(err, user) {
        if(err) {
            callback(err);
            return;
        }
        else {
            response.text = "Hi " + user + ", these are the suites that are available to run: \n";

            utilities.readFile('properties.json', function(err, data) {
                var json = JSON.parse(data);
        
                for (const s of json.suites) {
                    response.text = response.text + "\n" + s.name;
                }
            
                response.text = response.text + 
                    "\n\nYou can ask me to run a suite by mentioning my name and saying \"run <suite>\""; 
                response.channel = message.channel;
                callback(null, response);
            });
        }
    });
}

var welcome = function(message, callback) {
    var response = {};

    utilities.readFile('properties.json', function(err, data) {
        var json = JSON.parse(data);

        response.text = json.welcometext;
        response.channel = message.channel;
        callback(null, response);
    });
}

var help = function(message, callback) {
    var response = {};

    utilities.readFile('properties.json', function(err, data) {
        var json = JSON.parse(data);

        response.text = json.helptext;
        response.channel = message.channel;
        callback(null, response);
    });
}

var runSuite = function(message, callback) {
    var response = {};
    var action = {};

    utilities.readFile('properties.json', function(err, data) {
        var json = JSON.parse(data);

        for (const s of json.suites) {
            if(message.text.toUpperCase().includes(s.name.toString().toUpperCase())) {
                response.text = "Ok, let me try to get " + s.name + " started for you....";
                response.channel = message.channel;
                action.name = s.name;
                action.script = s.script;
                action.channel = message.channel;
                callback(null, action, response);
                break;
            }
        }
    });
}

var suiteMention = function(message, calledName, callback) {
    var response = {};

    utilities.readFile('properties.json', function(err, data) {
        var json = JSON.parse(data);
        var found = false;
        for (const s of json.suites) {
            if(message.text.toUpperCase().includes(s.name.toString().toUpperCase())) {
                if(calledName) {
                    response.text = "Alright, what would you like to do with that suite? " +
                    "\nExample: @Payments Automation Bot run " + s.name;
                    }   
                else {
                    response.text = "Please repeat your command and include my name:" +
                        "\nExample: @Payments Automation Bot run " + s.name;
                }
                response.channel = message.channel;
                callback(null, response);
                found = true;
                break;
            }
        }
        if(!found) {
            callback(error(message.channel));
        }
        else {
            found = false;
        }
    });
}

var error = function(channel) {
    var response = {};
    response.text = "Hey! I'm sorry, I wasn't able to figure out what you asked." + 
    "  Please try asking something different?" +
    "  Otherwise, talk to Sam Hall if you think I am broken :((";
    response.channel = channel;
    return response;
}