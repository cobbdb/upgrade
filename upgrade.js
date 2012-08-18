/**
 * UpgradeJS
 * A native NodeJS WebSocket Library
 * 
 * @author Dan Cobb
 * @version 0.1.2
 */

/**
 * @description Imported
 */
var crypto = require("crypto");


/**
 * @description Write upgrade handshake header to socket.
 * @param {ServerRequest} req ServerRequest from HTTPServer.
 * @param {Socket} socket Socket from upgrade event.
 * @since v0.1
 */
exports.writeHead = function (req, socket) {
    var key = req.headers["sec-websocket-key"];
    var hash = crypto.createHash("sha1");
    var $CRAZY = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    hash.update(key + $CRAZY, "utf8");
    key = hash.digest("base64");
    
    socket.write(
        "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
        "Upgrade: WebSocket\r\n" +
        "Connection: Upgrade\r\n" +
        "Sec-WebSocket-Accept: " + key + "\r\n" +
        "\r\n"
    );
};


/**
 * @description Removes mask from incoming frame.
 * @param {Buffer} buffer Buffer object from data event of WebSocket.
 * @returns {String} Unmasked data.
 * @see http://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side
 * @since v0.1
 */
exports.getData = function (buffer) {
    var datalength = buffer[1] & 127;
    var indexFirstMask = 2;
    if(datalength == 126) {
        indexFirstMask = 4;
    } else if(datalength == 127) {
        indexFirstMask = 10;
    }
    
    var masks = buffer.slice(indexFirstMask, indexFirstMask + 4);
    var i = indexFirstMask + 4;
    var j = 0;
    var output = "";
    while(i < buffer.length) {
        var charCode = buffer[i] ^ masks[j % 4];
        output += String.fromCharCode(charCode);
        i += 1;
        j += 1;
    }
    return output;
};
