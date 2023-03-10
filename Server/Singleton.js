var rand = require('random-int'); // Importing random integer generator module

// Initializing time and sequence variables
var time = 0;
var seq = 0;

module.exports = {
    initialize: function() {
        // Initialize time and sequence with random integers between 1 to 999
        time = rand(1,999);
        seq = rand(1,999);
    },
    // Return sequence number and increment it by 1
    getSeqNum: function() {
        return  seq++;
    },
    // Return timestamp and increment it by 1 if it hasn't reached end (2^32), else reset to 0
    getTimeStm: function() {
        //increment if hasnt reached end, else reset to 0 
        if (time != Math.pow(2,32))
        {
            time +=1;
        }else{
        time = 0;
        }
        return time; 
    },
};