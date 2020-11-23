const RESTManager = require("../rest/RESTManager.js");

const child_process = require("child_process");

class ShardManager {
  constructor(token, clientPath) {
    this.token = token;
    this.clientPath = clientPath;
    this.restManager = new RESTManager(token);
  }

  spawn(id, count, url) {
    let child = child_process.spawn("node", [this.clientPath], {
      stdio: "inherit",
      env: Object.assign({
        SHARD_ID: id,
        SHARD_COUNT: count,
        GATEWAY_URL: url,
        DISCORD_TOKEN: this.token
      }, process.env)
    });
    
    child.on("end", () => {console.log("ok"); this.spawn(id, count, url)});

    console.log(child);
  }

  start() {
    this.restManager.getGatewayBot().then((info) => {
      for (let i = 0; i < info.shards; i++) {
        this.spawn(i, info.shards, info.url);
      }
    });
  }
}

module.exports = ShardManager;