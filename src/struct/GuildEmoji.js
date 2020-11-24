const User = require("./User.js");

/**
 * Represents an emoji on Discord
 */
class GuildEmoji {
  /**
   * Creates a GuildEmoji object
   * @param {Client} client The client that initalized this
   * @param {Guild} guild The guild this emoji belongs to 
   * @parma {Object} data The raw data of the emoji
   */
  constructor(client, guild, data) {
    /**
     * The client that initalized this
     * @type {Client}
     */
    this.client = client;

    /**
     * The guild that this emoji is a part of
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The ID of this emoji
     * @type {Snowflake}
     */
    this.id = data.id;

    this.updateData(data);
  }

  /**
   * Updates the emoji's information with new data
   * @param {Object} data The raw data
   * @private
   */
  updateData(data) {
    /**
     * The name of this emoji
     * @type {string}
     */
    this.name = data.name || this.name;

    /**
     * Roles that this emoji is whitelisted to
     * @type {Map<Snowflake, Role>}
     */
    this.whitelistedRoles = new Map(data.roles.map(role => [role.id, this.guild.roles.get(role)]));

    /**
     * The user that created this emoji
     * @type {?User}
     */
    this.user = null;
    if (data.user) {
      if (this.client.users.has(data.user.id)) {
        this.user = this.client.users.get(data.user.id);
        this.user.updateData(data.user);
      } else {
        this.user = new User(this.client, data.user);
        this.client.users.set(data.user.id, this.user);
      }
    }

    /**
     * Whether or not this emoji must be wrapped in colons
     * @type {boolean}
     */
    this.requiresColons = !!data.require_colons;

    /**
     * Whether or not this emoji is managed
     * @type {boolean}
     */
    this.managed = !!data.managed;

    /**
     * Whether or not this emoji is animated
     * @type {boolean}
     */
    this.animated = !!data.animated;

    /**
     * Whether or not this emoji can be used
     * @type {boolean}
     */
    this.available = !!data.available;
  }
}

module.exports = GuildEmoji;