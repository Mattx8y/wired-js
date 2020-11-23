const RESTManager = require("../rest/RESTManager.js");

const child_process = require("child_process");

/**
 * Manages the creation of shards
 */
class ShardManager {
  /**
   * Creates a ShardManager
   * @param {string} token The client's token
   * @param {string} clientPath The path the the client's javascript file
   */
  constructor(token, clientPath) {
    this.token = token;
    this.clientPath = clientPath;
    this.restManager = new RESTManager(token);
  }

  /**
   * Spawns a shard
   * @param {number} id The ID of the shard
   * @param {number} count The total number of shards
   * @param {string} url The base gateway URL
   * @private
   */
  spawn(id, count, url) {
    child_process.spawn("node", [this.clientPath], {
      stdio: "inherit",
      env: Object.assign({
        SHARD_ID: id,
        SHARD_COUNT: count,
        GATEWAY_URL: url,
        DISCORD_TOKEN: this.token
      }, process.env)
    }).on("end", () => this.spawn(id, count, url));
  }

  /**
   * Starts spawning shards
   */
  start() {
    this.restManager.getGatewayBot().then((info) => {
      for (let i = 0; i < info.shards; i++) {
        this.spawn(i, info.shards, info.url);
      }
    });
  }
}

module.exports = ShardManager;