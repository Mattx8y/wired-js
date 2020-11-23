const {EventEmitter} = require("events");
const GatewayConnection = require("./gateway/GatewayConnection.js");
const RESTManager = require("./rest/RESTManager.js");
const Guild = require("./struct/Guild.js");

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

    /**
     * The guilds the client is in
     * @type {Map<Guild>}
     */
    this.guilds = new Map();

    this.gatewayConnection.on("READY", data => {
      data.guilds.forEach(guild => {
        this.guilds.set(guild.id, new Guild(this, guild));
      });
      setTimeout(() => console.log(this.guilds), 5000);
    });

    this.gatewayConnection.on("GUILD_CREATE", data => {
      let guild;
      if (this.guilds.has(data.id)) {
        guild = this.guilds.get(data.id);
        guild.updateData(data);
        this.emit("guildAvailable", guild);
      } else {
        guild = new Guild(this, data);
        this.guilds.set(data.id, guild);
        this.emit("guildCreate", guild);
      }
      this.guilds.set(data.id, guild);
    });

  }

  /**
   * Logs into the client
   */
  login() {
    this.gatewayConnection.login();
  }
}

module.exports = Client;