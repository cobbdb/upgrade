# UpgradeJS
A simple NodeJS websocket library to handle http upgrades.

### Usage
```javascript
var http = require("http");
var upgrade = require("upgrade");

var server = http.createServer();

server.on("upgrade", function (req, socket) {
    // Write header for upgrade request
    upgrade.writeHead(req, socket);

    socket.on("data", function (buff) {
        var data = upgrade.getData(buff);
        console.log(">" + data);
    });
});
server.listen(8000);
```


## writeHead(req, socket)
Write upgrade handshake header to socket.

### Usage
```javascript
...
server.on("upgrade", function (req, socket) {
    upgrade.writeHead(req, socket);
    ...
```

### Parameters
* {ServerRequest} req ServerRequest from HTTPServer.
* {Socket} socket Socket from upgrade event.


## getData(buffer)
Removes mask from incoming frame.

### Usage
```javascript
    ...
    socket.on("data", function (buff) {
        var data = upgrade.getData(buff);
        ...
```

### Parameters
* {Buffer} buffer Buffer object from data event of WebSocket.

### Returns
* {String} Unmasked data.


## frameData(msg)
Wraps data in a websocket frame. Note that UpgradeJS does not support payloads larger than 125 bytes.

### Usage
```javascript
    ...
    var data = exports.frameData(message);
    socket.write(data);
    ...
```

### Parameters
* {String} msg Some data to wrap.

### Returns
* {Buffer} Hex encoded Buffer.

### Throws
* {RangeError}


## getSend(socket)
Convenience method to lock send behavior to a specific socket.

### Usage
```javascript
    ...
    var send = upgrade.getSend(socket);
    send("foo");
    send("bar");
```

### Parameters
* {Socket} socket The socket to communicate over.

### Returns
* {Function} Send behavior using a specific socket.


## send(msg, socket)
Convenience method for sending framed data.

### Usage
```javascript
    ...
    upgrade.send("foo", socket);
    upgrade.send("bar", socket);
```

### Parameters
* {String} msg Data to send across websocket.
* {Socket} socket The socket to commincate over.

### Throws
* {RangeError}
