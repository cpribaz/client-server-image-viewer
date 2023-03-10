// You may need to add some delectation here

module.exports = {
  //convert these strings to arrays 
  StringToArray: function(string) {
      var string = unescape(encodeURIComponent(string)),
      characterList = string.split(''),
      uintArray = [];
    //loop to push values into the array created above 
    for (var x = 0; x < characterList.length; x++) {
        uintArray.push(characterList[x].charCodeAt(0));
    }
    //return the created array 
  return new Uint8Array(uintArray);
  },

  //Method to create an ITP request packet
  getpacket: function(query, ver) {
      var query1 = this.StringToArray(query);
      var req = new Uint8Array(4 + query1.length);
      //initialize array values accordinly 
      req[0] = 200 
      req[1] = 16 
      req[2] = 114 
      req[3] = 0 
      for (x = 0; x < query1.length; x++) {
          req[4+x] = query1[x]
        }

    return req;
  }
};


//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Convert a given string to byte array
function stringToBytes(str) {
  var ch,
    st,
    re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

// Store integer value into specific bit poistion the packet
function storeBitPacket(packet, value, offset, length) {
  // let us get the actual byte position of the offset
  let lastBitPosition = offset + length - 1;
  let number = value.toString(2);
  let j = number.length - 1;
  for (var i = 0; i < number.length; i++) {
    let bytePosition = Math.floor(lastBitPosition / 8);
    let bitPosition = 7 - (lastBitPosition % 8);
    if (number.charAt(j--) == "0") {
      packet[bytePosition] &= ~(1 << bitPosition);
    } else {
      packet[bytePosition] |= 1 << bitPosition;
    }
    lastBitPosition--;
  }
}
