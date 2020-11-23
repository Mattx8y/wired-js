module.exports = {
  Client: require("./src/Client.js"),
  GatewayConnection: require("./src/gateway/GatewayConnection.js"),
  Intents: require("./src/gateway/Intents.js"),
  RESTManager: require("./src/rest/RESTManager.js"),
  ShardManager: require("./src/shards/ShardManager.js")
}