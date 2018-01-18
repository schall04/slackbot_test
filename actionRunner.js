const { spawn } = require('child_process');

var exports = module.exports = {};

var actionRunning = false;

exports.takeAction = function(action, callback) {
    var response = {};

    if(action.script) {
        runScript(action.script, function(err, start) {
            if(err) {
                callback(err);
                //On error, this block is called
            }
            else if(start) {
                response.text = action.name + " is running!  I'll let you know when it is finished";
                response.channel = action.channel;
                callback(null, response);
            }
            else if(!start) {
                //Once finished this block is called
            }
        });
    }
}

exports.isActionRunning = actionRunning;

var runScript = function(script, callback) {
    var bat = spawn('cmd.exe', ['/c', script]);
    
    bat.stdout.on('data', (data) => {
        console.log(data.toString());
        if(!actionRunning) {
            callback(null, true);
        }
        actionRunning = true;
    });
        
    bat.stderr.on('data', (data) => {
        console.log("ERROR: " + data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        if(actionRunning) {
            callback(null, false);
        }
        actionRunning = false;
    });
}