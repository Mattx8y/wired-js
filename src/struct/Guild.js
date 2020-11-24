const GuildEmoji = require("./GuildEmoji.js");
const Role = require("./Role.js");
const User = require("./User.js");

const GuildSystemChannelFlags = require("./GuildSystemChannelFlags.js");

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
     * The client that initialized this Guild
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

    /**
     * The channels in this guild
     * @type {Map<Snowflake, GuildChannel>}
     */
    this.channels = new Map();

    this.updateData(data);
  }

  /**
   * Updates the Guild's data with new information
   * @param {Object} data The raw guild data
   * @private
   */
  async updateData(data) {
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
     * The guild owner
     * @type {User}
     */
    this.owner;
    if (this.client.users.has(data.owner_id)) {
      this.owner = this.client.users.get(data.owner_id);
    } else {
      this.owner = new User(this.client, await this.client.restManager.getUser(data.owner_id));
      this.client.users.set(data.owner_id, this.owner);
    }

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
    this.widgetEnabled = !!data.widget_enabled;

    /**
     * The channel that the widget invite leads to, or null if set to no invite
     * @type {?GuildChannel}
     */
    this.widgetChannel = this.channels.get(data.widget_channel_id) || null;

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

    /**
     * Whether or not the guild can set an invite splash background
     * @type {boolean}
     */
    this.canSetInviteSplash = data.features.includes("INVITE_SPLASH");

    /**
     * Whether or not the guild can use 384kbps bitrates for voice channels
     * @type {boolean}
     */
    this.canUseVIPRegions = data.features.includes("VIP_REGIONS");

    /**
     * Whether or not the guild can set a vanity invite URL
     * @type {boolean}
     */
    this.canSetVanityURL = data.features.includes("VANITY_URL");

    /**
     * Whether or not the guild is verified
     * @type {boolean}
     */
    this.verified = data.features.includes("VERIFIED");

    /**
     * Whether or not the guild is partnered
     * @type {boolean}
     */
    this.partnered = data.features.includes("PARTNERED");

    /**
     * Whether or not the guild is a community server
     * @type {boolean}
     */
    this.community = data.features.includes("COMMUNITY");

    /**
     * Whether or not the guild can use commerce features
     * @type {boolean}
     */
    this.commerce = data.features.includes("COMMERCE");

    /**
     * Whether or not the guild can create news channels
     * @type {boolean}
     */
    this.canCreateNewsChannels = data.features.includes("NEWS");

    /**
     * Whether or not the guild is in the discovery
     * @type {boolean}
     */
    this.discoverable = data.features.includes("DISCOVERABLE");

    /**
     * Whether or not the guild can be featured in the discovery
     * @type {boolean}
     */
    this.featureable = data.features.includes("FEATUREABLE");

    /**
     * Whether or not the guild can set an animated icon
     * @type {boolean}
     */
    this.canSetAnimatedIcon = data.features.includes("ANIMATED_ICON");

    /**
     * Whether or not the guild can set a banner
     * @type {boolean}
     */
    this.canSetBanner = data.features.includes("BANNER");

    /**
     * Whether or not the guild has the welcome screen enabled
     * @type {boolean}
     */
    this.welcomeScreenEnabled = data.features.includes("WELCOME_SCREEN_ENABLED");

    /**
     * The required MFA level of the guild
     * @type {GuilfMFALevel}
     */
    this.mfaLevel = data.mfa_level;

    /**
     * ID of the application that created this, or null if it wasn't created by a bot
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id;

    /**
     * The system channel, or null if one isn't set
     * @type {?Snowflake}
     */
    this.systemChannel = this.channels.get(data.system_channel_id) || null;

    /**
     * Whether or not join notificaitons are shown in the system channel
     * @type {boolean}
     */
    this.joinMessages = (data.system_channel_flags & GuildSystemChannelFlags.SUPPRESS_JOIN_NOTIFICATIONS) !== GuildSystemChannelFlags.SUPPRESS_JOIN_NOTIFICATIONS;

    /**
     * Whether or not boost notificaitons are shown in the system channel
     * @type {boolean}
     */
    this.boostMessages = (data.system_channel_flags & GuildSystemChannelFlags.SUPPRESS_PREMIUM_SUBSCRIPTIONS) !== GuildSystemChannelFlags.SUPPRESS_PREMIUM_SUBSCRIPTIONS;

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

    console.log(this);    
  }
}

module.exports = Guild;