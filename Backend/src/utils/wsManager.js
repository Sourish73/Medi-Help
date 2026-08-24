const crypto = require('crypto');

let clients = [];

const handleUpgrade = (req, socket, head) => {
  const acceptKey = req.headers['sec-websocket-key'];
  if (!acceptKey) {
    socket.destroy();
    return;
  }

  const hash = crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' +
    hash +
    '\r\n\r\n'
  );

  clients.push(socket);

  socket.on('close', () => {
    clients = clients.filter(c => c !== socket);
  });

  socket.on('error', () => {
    clients = clients.filter(c => c !== socket);
  });
};

const broadcast = (data) => {
  const payload = Buffer.from(JSON.stringify(data));
  const len = payload.length;

  let header;
  if (len <= 125) {
    header = Buffer.alloc(2);
    header[0] = 0x81;
    header[1] = len;
  } else if (len <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  const frame = Buffer.concat([header, payload]);

  clients.forEach(socket => {
    try {
      socket.write(frame);
    } catch {
      clients = clients.filter(c => c !== socket);
    }
  });
};

module.exports = {
  handleUpgrade,
  broadcast,
};
