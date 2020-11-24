const Permissions = require("./Permissions.js");

/**
 * Represents a Role
 */
class Role {
  /**
   * Creates a role
   * @param {Client} client The client that created this role
   * @param {Guild} guild The guild this role belongs to
   * @param {Object} data The role's data
   */
  constructor(client, guild, data) {
    /**
     * The client that initialized this Role
     * @type {Client}
     */
    this.client = client;

    /**
     * The guild that this role belongs to
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The ID of the role
     * @type {string}
     */
    this.id = data.id;

    this.updateData(data);
  }

  /**
   * Updates a role's data with new information
   * @param {Object} data The raw data
   * @private
   */
  updateData(data) {
    /**
     * The name of the role
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hex code for the color of the role, or null if it doesn't have a color
     * @type {?string}
     */
    this.color = data.color === 0 ? null : data.color.toString(16);

    /**
     * Whether or not the role is hoisted
     * @type {boolean}
     */
    this.hoisted = data.hoist;

    /**
     * The position of the role
     * @type {number}
     */
    this.position = data.position;

    /**
     * The permissions this role has
     * @type {Permissions<PermissionFlags>}
     */
    this.permissions = new Permissions(data.permissions);

    /**
     * Whether this role is managed by an integration
     * @type {boolean}
     */
    this.managed = data.managed;

    /**
     * Whether this role can be mentioned by everyone
     * @type {boolean}
     */
    this.mentionable = data.mentionable;
  }
}

module.exports = Role;