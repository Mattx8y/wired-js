const {ShardManager} = require(".");

const mgr = new ShardManager(process.env.DISCORD_BOT_TOKEN, __dirname + "/test2.js");

mgr.start();