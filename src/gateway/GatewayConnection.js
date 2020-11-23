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

/**
 * Base data for a packet
 * @typedef {Object} Packet
 * @property {number} op The OPCode of the packet
 * @property {*} d The packet data
 * @property {?string} t The name of the packet (if OPCode 0)
 * @property {?s} The sequence number (if OPCode 0)
 * @private
 */

/**
 * Manages gateway connections
 * @private
 */
class GatewayConnection extends EventEmitter {
  /**
   * Creates a GatewayConnection
   * @param {string} token The client's token.
   * @param {Intents[]} intents The client's intents
   */
  constructor(token, intents) {
    super();

    /**
     * The token used to connect to the gateway
     * @type {string}
     * @private
     */
    this.token = token;

    /**
     * The zlib inflate used for compression
     * @type {?Inflate}
     * @private
     */
    if (zlib) this.inflate = new zlib.Inflate({
      chunkSize: 65535,
      flush: zlib.Z_SYNC_FLUSH,
      to: erlpack ? "" : "string",
    });

    /**
     * Packs a packet to send
     * @method
     * @private
     */
    this.pack = erlpack ? erlpack.pack : JSON.stringify;

    /**
     * The intents for the gateway
     * @type {number}
     * @private
     */
    this.intents = intents.reduce((a, b) => a | b);
    
    let url = new URL(process.env.GATEWAY_URL);
    url.searchParams.set("v", 8);
    url.searchParams.set("encoding", erlpack ? "etf" : "json");
    if (zlib) url.searchParams.set("compress", "zlib-stream");
    
    /**
     * The URL to connect to the gateway with
     * @type {string}
     * @priavte
     */
    this.gatewayURL = url.href;
  }
  
  /**
   * Connect to the gateway
   * @param {boolean} [resume=false] Whether or not to resume a previous session.
   * @private
   */
  login(resume = false) {
    /**
     * Whether or not the connection is resuming
     * @type {boolean}
     * @private
     */
    this.resume = resume && this.seq && this.sessionID;
    
    /**
     * The WebSocket for the gateway connection
     * @type {WebSocket}
     * @private
     */
    this.socket = new WebSocket(this.gatewayURL);
    
    this.socket.on("message", this.onPacket.bind(this));
  }
  
  /**
   * Handle a packet
   * @param {*} data The raw data of the packet
   * @private
   */
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
  
  /**
   * Handle a reconnect payload
   * @fires GatewayConnection#RECONNECT
   * @private
   */
  onReconnect() {
    /**
     * Emitted when the client recieves an OPCode 7 RECONNECT payload
     * @event GatewayConnection#RECONNECT
     * @private
     */
    this.emit("RECONNECT");
    this.disconnect(true);
    this.login(true);
  }
  
  /**
   * Handle an invalid session payload
   * @param {Packet} data The packet data
   * @fires GatewayConnection#INVALID_SESSION
   * @private
   */
  onInvalidSession(data) {
    /**
     * Emitted when the client recieves an OPCode 9 INVALID_SESSION payload
     * @event GatewayConnection#INVALID_SESSION
     * @type {boolean}
     * @private
     */
    this.emit("INVALID_SESSION", data.d);
    this.disconnect(data.d);
    this.login(data.d);
  }
  
  /**
   * Handle a hello payload
   * @param {Packet} data The packet data
   * @fires GatewayConnection#HELLO
   * @private
   */
  onHello(data) {
    /**
     * Emitted when the client recieves an OPCode 10 HELLO payload
     * @event GatewayConnection#HELLO
     * @type {Object}
     * @property {string} heartbeat_interval The heartbeat interval in milliseconds
     * @private
     */
    this.emit("HELLO", data.d);

    /**
     * The heartbeat interval
     * @type {number}
     * @private
     */
    this.heartbeatInterval = setInterval(this.heartbeat.bind(this), data.d.heartbeat_interval);

    /**
     * Whether or not the client has recieved OPCode 11 HEARTBEAT_ACK
     * @type {boolean}
     * @private
     */
    this.hasRecievedACK = true;

    if (this.resume) return this.resume();
    this.identify();
  }
  
  /**
   * Handle a heartbeat ACK payload
   * @fires GatewayConnection#HEARTBEAT_ACK
   * @private
   */
  onHeartbeatACK() {
    /**
     * Emitted when the client recieves an OPCode 11 HEARTBEAT_ACK
     * @event GatewayConnection#HEARTBEAT_ACK
     * @private
     */
    this.emit("HEARTBEAT_ACK");
    this.hasRecievedACK = true;
  }
  
  /**
   * Handle a dispatch payload
   * @param {Packet} data The packet data
   * @private
   */
  onDispatch(data) {
    this.emit(data.t, data.d);
    /**
     * The current sequence number
     * @type {number}
     * @private
     */
    this.seq = data.s;

    /**
     * The session ID
     * @type {string}
     * @private
     */
    if (data.t === "READY") this.sessionID = data.d.session_id;
  }
  
  /**
   * Sends a heartbeat payload
   * @private
   */
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
  
  /**
   * Sends an identify payload
   * @private
   */
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
        intents: this.intents
      }
    }));
  }
  
  /**
   * Sends a resume payload
   * @private
   */
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
  
  /**
   * Disconnects from the gateway
   * @param {boolean} [resume=false] Whether or not to resume the connection.
   * @private
   */
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