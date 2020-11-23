const {EventEmitter} = require("events");
const GatewayConnection = require("./gateway/GatewayConnection.js");
const RESTManager = require("./rest/RESTManager.js");

/**
 * The options for the client
 * @typedef {Object} ClientOtions
 * @property {string} token The token for the client
 * @property {Intents[]} intents The intents for the cient
 */

/**
 * The main Client class
 */
class Client extends EventEmitter {
  /**
   * Creates a new Client
   * @param {ClientOptions} options The options for the client.
   */
  constructor(options = {}) {
    super();
    if (!options.token) options.token = process.env.DISCORD_TOKEN;
    if (!options.token) 
      throw new TypeError("No token was specified.");
    if (!options.token || !(options.intents instanceof Array) || options.intents.length === 0) 
      throw new TypeError("No intents were specified");
    
    /**
     * The token of the client
     * @type {string}
     */
    this.token = options.token;
    
    /**
     * The RESTManager for the client
     * @type {RESTManager}
     * @private
     */
    this.restManager = new RESTManager(options.token);
    
    /**
     * The GatewayConnection for the client
     * @type {GatewayConnection}
     * @private
     */
    this.gatewayConnection = new GatewayConnection(options.token, options.intents);

  }

  /**
   * Logs into the client
   */
  login() {
    this.gatewayConnection.login();
  }
}

module.exports = Client;