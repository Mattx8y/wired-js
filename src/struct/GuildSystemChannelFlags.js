/**
 * List of system channel flags
 * @enum {number}
 * @readonly
 */
const GuildSystemChannelFlags = {
  /**
   * Don't send join messages
   */
  SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0,
  /**
   * Don't send boost messages
   */
  SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1
}

module.exports = GuildSystemChannelFlags;