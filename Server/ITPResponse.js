module.exports = {
    init: function() { },
    //--------------------------
    //getlength: return the total length of the ITP packet
    //--------------------------
    getLength: function() { return '16 bytes'; }, // Placeholder return value
    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function() { return "response packet" } // Placeholder return value
};

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

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