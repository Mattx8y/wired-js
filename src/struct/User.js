/**
 * Represents a user on Discord
 */
class User {
  /**
   * Creates a User object
   * @param {Client} client The client that initialized this
   * @param {Object} data The raw user data
   */
  constructor(client, data) {
    /**
     * The client that initalized this
     * @type {Client}
     */
    this.client = client;

    /**
     * The ID of this user
     * @type {Snowflake}
     */
    this.id = data.id;

    this.updateData(data);
  }

  /**
   * Updates the user's information with new data
   * @param {Object} data The raw user data
   * @private
   */
  updateData(data) {
    /**
     * The user's username
     * @type {string}
     */
    this.username = data.username;

    /**
     * The user's discriminator
     * @type {string}
     */
    this.discriminator = data.discriminator;

    /**
     * The user's avatar hash, or null if they don't have an avatar set
     * @type {?string}
     */
    this.avatarHash = data.avatar;

    /**
     * Whether or not the user is a bot
     * @type {boolean}
     */
    this.bot = !!data.bot;

    /**
     * Whether or not the user is an official system account
     * @type {boolean}
     */
    this.system = !!data.system;

    /**
     * The flags integer for the user
     * @type {number}
     */
    this.flags = data.public_flags;
  }
}

module.exports = User;