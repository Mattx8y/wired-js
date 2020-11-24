const GuildEmoji = require("./GuildEmoji.js");
const Role = require("./Role.js");

/**
 * Represents a guild on Discord
 */
class Guild {
  /**
   * Creates a Guild
   * @param {Client} client The client that created this
   * @param {Object} data The raw guild data
   */
  constructor(client, data) {
    /**
     * The client that created this Guild
     * @type {Client}
     */
    this.client = client;

    /**
     * The ID of the guild
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The roles in this guild
     * @type {Map<Snowflake, Role>}
     */
    this.roles = new Map();

    /**
     * The emojis in this guild
     * @type {Map<Snowflake, GuildEmoji>}
     */
    this.emojis = new Map();

    this.updateData(data);
  }

  /**
   * Updates the Guild's data with new information
   * @param {Object} data The raw guild data
   * @private
   */
  updateData(data) {
    /**
     * Whether or not the guild is available.
     * @type {boolean}
     */
    this.available = !data.unavailable;

    if (!this.available) return;

    /**
     * The name of the guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The icon hash of the guild, or null if the guild has no icon.
     * @type {?string}
     */
    this.iconHash = data.icon || data.icon_hash;

    /**
     * The splash hash of the guild, or null if the guild has no splash.
     * @type {?string}
     */
    this.splashHash = data.splash;

    /**
     * The discovery splash hash of the guild, or null if the guild has no discovery splash
     * @type {?string}
     */
    this.discoverySplashHash = data.discovery_splash;

    /**
     * The guild owner ID
     * @type {string}
     */
    this.ownerID = data.owner_id;

    /**
     * The guild's voice region ID
     * @type {string}
     */
    this.voiceRegionID = data.region;

    /**
     * The AFK channel ID, or null if there is no AFK channel set
     * @type {?string}
     */
    this.afkChannelID = data.afk_channel_id;

    /**
     * The AFK timeout, in seconds
     * @type {number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * Whether or not the server widget is enabled
     * @type {boolean}
     */
    this.widgetEnabled = data.widget_enabled || false;

    /**
     * The ID of the channel that the widget invite leads to, or null if set to no invite
     * @type {?string}
     */
    this.widgetChannelID = data.widget_channel_id;

    /**
     * The verification level of the guild
     * @type {GuildVerificationLevel}
     */
    this.verificationLevel = data.verification_level;

    /**
     * The default message notification level of the guild
     * @type {GuildDefaultMessageNotificationLevel}
     */
    this.defaultMessageNotificationLevel = data.default_message_notifications;

    /**
     * The explicit content filter level of the guild
     * @type {GuildExplicitContentFilterLevel}
     */
    this.explicitContentFilterLevel = data.explicit_content_filter;

    data.roles.forEach(role => {
      if (this.roles.has(role.id)) {
        this.roles.get(role.id).updateData(role);
      } else {
        this.roles.set(role.id, new Role(this.client, this, role));
      };
    });

    data.emojis.forEach(emoji => {
      if (this.emojis.has(emoji.id)) {
        this.emojis.get(emoji.id).updateData(emoji);
      } else {
        this.emojis.set(emoji.id, new GuildEmoji(this.client, this, emoji));
      };
    });

    this.emojis = new Map(data.emojis.map(emoji => [emoji.id, new Emoji(this.client, this, emoji)]));
  }
}

module.exports = Guild;