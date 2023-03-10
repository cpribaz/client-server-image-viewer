// Require necessary modules
let net = require("net");
let fs = require("fs");
var create = require('fs');
var ITPpacket = require('./ITPRequest')
let open = require("open");

// Parse command line arguments
let saved = process.argv.indexOf('-s') + 1;
let query = process.argv.indexOf('-q') + 1;
let ver = process.argv.indexOf('-v') + 1;

// Extract server IP address and port number from "-s" argument value
let IPAdd = process.argv[saved].split(':')[0]
let portNum = process.argv[saved].split(':')[1]

// Generate ITP request packet using query and version number from command line
requestPacket = ITPpacket.getpacket(process.argv[query],process.argv[ver]);

//create TCP socket
const socket = net.Socket();

// Connect socket to server and send request packet
socket.connect(portNum, IPAdd, function(){
    console.log('Connected to ImageDB server on: ' + IPAdd +':'+ portNum)
    socket.write(requestPacket);

    // Set up listener for "data" event (response packet from server)
    socket.on('data', function(data) {
        // Convert response data from buffer to string and split on commas
        var vers = process.argv[ver];
        var res = data.toString().split(',')    
        var name = process.argv[query].split('.')[0]

         // Save image data as file on client machine
        create.writeFile(name + '.jpg', res[6], {encoding: 'base64'}, function(err) {
            (async () => {
                //open file default program
                open(name + '.jpg');
                //Disconnect socket from server and log message to console
                socket.end(function() {
                    console.log('Disconnet from the server --- Connection has been closed')
                })
            })();
        });

        //Log summary of response packet to console
        console.log('Server sent: \n\n --ITP version = ' + vers +' \n --Response Type = ' + res[1] + '\n --Sequence Number = ' + res[2] + '\n --Timestamp = ' + res[3] +'\n --Image Size = ' + res[4] + '\n' )
    })
})

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
