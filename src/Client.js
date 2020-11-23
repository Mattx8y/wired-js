const {EventEmitter} = require("events");
const GatewayConnection = require("./gateway/GatewayConnection.js");
const RESTManager = require("./rest/RESTManager.js");

class Client extends EventEmitter {
  constructor(token = process.env.DISCORD_TOKEN) {
    super();
    if (!token) throw new TypeError("No token was specified.");
    this.token = token;
    this.restManager = new RESTManager(token);
    this.gatewayConnection = new GatewayConnection(token);

    
  }

  login() {
    this.gatewayConnection.login();
  }
}