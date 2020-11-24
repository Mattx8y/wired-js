/**
 * List of default message notification levels
 * @readyonly
 * @enum {number}
 */
const GuildDefaultMessageNotificationLevel = {
  /**
   * By default, all messages trigger a notification
   */
  ALL_MESSAGES: 0,
  /**
   * By default, only mentions trigger a notification
   */
  ONLY_MENTIONS: 1
}

module.exports = GuildDefaultMessageNotificationLevel;