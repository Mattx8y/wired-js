const https = require("https");

const packageInfo = require("../../package.json");

/**
 * Manages communications to the REST api
 * @private
 */
class RESTManager {
  /**
   * Creates a RESTManager
   * @param {string} token The client's token
   * @private
   */
  constructor(token) {
    this.token = token;
  }

  /**
   * Sends an HTTP request
   * @param {string} path The path to send the request to
   * @param {string} [method="GET"] The method to use
   * @param {*} [body] The body of the request
   * @returns Promise<*> The response to the request
   * @private
   */
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

  /**
   * GETs /gateway/bot
   * @returns {Promise<Object>} The response
   * @private
   */
  getGatewayBot() {
    return this.request("/gateway/bot");
  }

  /**
   * GETs /users/<userID>
   * @param {Snowflake|string} userID The user's ID, or `@me` for the current user
   * @returns {Promise<Object>} The response
   */
  getUser(userID) {
    return this.request(`/users/${userID}`);
  }
}

module.exports = RESTManager;