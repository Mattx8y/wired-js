const EventEmitter = require("events");
const {URL} = require("url");

const WebSocket = require("ws");

const packageInfo = require("../../package.json");

let erlpack;
let zlib;
try {
  erlpack = require("erlpack");
} catch(err) {}
try {
  zlib = require("zlib-sync");
} catch(err) {}

class GatewayConnection extends EventEmitter {
  constructor(token = process.env.DISCORD_TOKEN) {
    super();
    if (!token) throw new TypeError("No token was specified.");  
    this.token = token;
    if (zlib) this.inflate = new zlib.Inflate({
      chunkSize: 65535,
      flush: zlib.Z_SYNC_FLUSH,
      to: erlpack ? "" : "string",
    });
    this.pack = erlpack ? erlpack.pack : JSON.stringify;
    let url = new URL(process.env.GATEWAY_URL);
    url.searchParams.set("v", 8);
    url.searchParams.set("encoding", erlpack ? "etf" : "json");
    if (zlib) url.searchParams.set("compress", "zlib-stream");
    this.gatewayURL = url.href;
    this.commands = new Map();
  }
  
  login(resume = false) {
    this.resume = resume && this.seq && this.sessionID;
    this.socket = new WebSocket(this.gatewayURL);
    this.socket.on("message", this.onPacket.bind(this));
  }
  
  onPacket(data) {
    if (zlib) {
      if (data instanceof ArrayBuffer) data = new Uint8Array(data);
      const flush = data.length >= 4 && data[data.length - 4] === 0x00 && data[data.length - 3] === 0x00 && data[data.length - 2] === 0xff && data[data.length - 1] === 0xff;
      this.inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
      if (!flush) return;
      data = this.inflate.result;
    }
    if (erlpack) {
      if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
      if (data.length == 0) return;
      data = erlpack.unpack(data);
    } else {
      data = JSON.parse(data);
    }
    
    switch (data.op) {
      case 0:
        this.onDispatch(data);
        break;
      case 7:
        this.onReconnect(data);
        break;
      case 9:
        this.onInvalidSession(data);
        break;
      case 10:
        this.onHello(data);
        break;
      case 11:
        this.onHeartbeatACK(data);
        break;
    }
  }
  
  onReconnect(data) {
    this.emit("RECONNECT", data.d);
    this.disconnect(true);
    this.login(true);
  }
  
  onInvalidSession(data) {
    this.emit("INVALID_SESSION", data.d);
    this.disconnect(data.d);
    this.login(data.d);
  }
  
  onHello(data) {
    this.emit("HELLO", data.d);
    this.heartbeatInterval = setInterval(this.heartbeat.bind(this), data.d.heartbeat_interval);
    this.hasRecievedACK = true;
    if (this.resume) return this.resume();
    this.identify();
  }
  
  onHeartbeatACK() {
    this.emit("HEARTBEAT_ACK");
    this.hasRecievedACK = true;
  }
  
  onDispatch(data) {
    this.emit(data.t, data.d);
    this.seq = data.s;
    if (data.t === "READY") this.sessionID = data.d.session_id;
  }
  
  heartbeat() {
    if (this.hasRecievedACK) {
      this.hasRecievedACK = false;
      this.socket.send(this.pack({
        op: 1,
        d: this.seq || null
      }));
    } else {
      this.disconnect(true);
      this.login(true);
    }
  }
  
  identify() {
    this.socket.send(this.pack({
      op: 2,
      d: {
        token: this.token,
        properties: {
          $os: process.platform,
          $browser: packageInfo.name,
          $device: packageInfo.name
        },
        compress: !!zlib,
        shard: [parseInt(process.env.SHARD_ID || 0), parseInt(process.env.SHARD_COUNT || 1)],
        intents: 32767
      }
    }));
  }
  
  resume() {
    this.resume = false;
    this.socket.send(this.pack({
      op: 6,
      d: {
        token: this.token,
        session_id: this.sessionID,
        seq: this.seq
      }
    }))
  }
  
  disconnect(resume = false) {
    this.socket.close(4000);
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
    this.socket = null;
    if (!resume) {
      this.seq = null;
      this.sessionID = null;
    }
  }
}

module.exports = GatewayConnection;