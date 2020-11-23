const https = require("https");

const packageInfo = require("../../package.json");

class RESTManager {
  constructor(token) {
    this.token = token;
  }

  request(path, method = "GET", body) {
    return new Promise((resolve, reject) => {
      const opts = {
        method, 
        headers: {
          authorization: "Bot " + this.token,
          "user-agent": `DiscordBot (${packageInfo.homepage}, ${packageInfo.version})`,
        }
      };
      if (method !== "GET" && typeof body !== "undefined")   {
        body = JSON.stringify(body)
        opts.body = body;
        opts.headers["content-type"] = "application/json";
        opts.headers["content-length"] = Buffer.byteLength(body);
      }
      const request = https.request("https://discord.com/api/v8/" + path, opts, function(response) {
        let body = "";
        response.on("data", chunk => body += chunk);
        response.on("error", reject);
        response.on("end", () => (response.status >= 400 ? reject : resolve)(JSON.parse(body)));
      });
      if (method !== "GET" && typeof body !== "undefined") request.write(body)
      request.end();
    });
  }

  getGatewayBot() {
    return this.request("/gateway/bot");
  }
}

module.exports = RESTManager;