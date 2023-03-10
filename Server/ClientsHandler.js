//import required modules 
let singleton = require('./Singleton');
sizeOf = require('image-size'),
base64Img = require('base64-img');
var rand = require('random-int');

// Define function to convert an array of bytes to a string
function ArrString(array) {
    var encodeStr = String.fromCharCode.apply(null, array),
    decodeStr = decodeURIComponent(escape(encodeStr));
    return decodeStr;
    }
    // Export a module with a function to handle a client joining
    module.exports = {
    handleClientJoining: function(sock) {
        // Declare and initialize variables
        let ver = 3314
        var clientNum = rand(1,8000)
        let clientNm = 'Client: '+ clientNum
        console.log(clientNm + ' connected at timestamp: ' + singleton.getTimeStm() + '\n')
        // Set up event listener for incoming data
        sock.on('data',function(data){
            // Convert data to an array of bytes
            var pk = new Uint8Array(data)
            // Extract request type from packet
            var req = pk[3]
            // Extract query string from packet
            querystring = new Uint8Array(pk.length - 4)
            for (i = 0; i < pk.length; i++) {
                querystring[i] = pk[4+i]
            }
            var query = ArrString(querystring);
            if (req == '0') {
                // If request type is 0, prepare a response packet
                let packRes = new Array(6)
                packRes[0] = (ver)
                packRes[1] = (1)
                packRes[2] = (singleton.getSeqNum())
                packRes[3] = (singleton.getTimeStm())
                // Get dimensions of the requested image
                var sz = sizeOf(__dirname + '/images/' + query)
                // Calculate size of the requested image in pixels
                packRes[4] = (sz.height * sz.width)
                // Encode the requested image in base64 format
                var data = base64Img.base64Sync(__dirname+'/images/'+query)
                packRes[5] = data
                // Send the response packet back to the client
                sock.write(packRes.toString())
            }
            console.log('Client- '+ clientNum +' requests:\n--ITP version:' + ver + '\n--Resquest Type: ' + req + '\n--Image file name: ' + query + '\n')
        })
        //close the connection once client side is done
        sock.on('close',function() {
            console.log(clientNm + ' closed the connection\n')
        })
    }

}


//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Returns the integer value of the extracted bits fragment for a given packet
function parseBitPacket(packet, offset, length) {
    let number = "";
    for (var i = 0; i < length; i++) {
        // let us get the actual byte position of the offset
        let bytePosition = Math.floor((offset + i) / 8);
        let bitPosition = 7 - ((offset + i) % 8);
        let bit = (packet[bytePosition] >> bitPosition) % 2;
        number = (number << 1) | bit;
    }
    return number;
}

// Prints the entire packet in bits format
function printPacketBit(packet) {
    var bitString = "";

    for (var i = 0; i < packet.length; i++) {
        // To add leading zeros
        var b = "00000000" + packet[i].toString(2);
        // To print 4 bytes per line
        if (i > 0 && i % 4 == 0) bitString += "\n";
        bitString += " " + b.substr(b.length - 8);
    }
    console.log(bitString);
}

// Converts byte array to string
function bytesToString(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}